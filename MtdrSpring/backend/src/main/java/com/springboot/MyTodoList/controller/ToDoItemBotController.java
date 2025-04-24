package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.SubToDoItem;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.service.SubToDoItemService;
import com.springboot.MyTodoList.service.TaskAssignmentService;
import com.springboot.MyTodoList.service.ToDoItemService;
import com.springboot.MyTodoList.service.SprintService;
import com.springboot.MyTodoList.service.UserService;
import com.springboot.MyTodoList.util.BotCommands;
import com.springboot.MyTodoList.util.BotHelper;
import com.springboot.MyTodoList.util.BotLabels;
import com.springboot.MyTodoList.util.BotMessages;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardRemove;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class ToDoItemBotController extends TelegramLongPollingBot {
    private static final Logger logger = LoggerFactory.getLogger(ToDoItemBotController.class);
    private static final double LONG_TASK_DURATION = 4.0;

    private enum BotState {
        NONE,
        AWAITING_DESCRIPTION,
        AWAITING_ESTIMATED_HOURS,
        AWAITING_SUBTASKS_INPUT,
        AWAITING_SPRINT_SELECTION,
        AWAITING_USER_SELECTION,
        AWAITING_REAL_HOURS,
        AWAITING_ADD_SUBTASK
    }

    private final ToDoItemService toDoItemService;
    private final SprintService sprintService;
    private final UserService userService;
    private final TaskAssignmentService taskAssignmentService;
    private final SubToDoItemService subToDoItemService;
    private final String botName;

    private final Map<Long, BotState> chatState = new ConcurrentHashMap<>();
    private final Map<Long, ToDoItem> pendingToDo = new ConcurrentHashMap<>();
    private final Map<Long, List<String>> pendingSubTasksInput = new ConcurrentHashMap<>();
    private final Map<Long, Integer> pendingRealHoursTask = new ConcurrentHashMap<>();

    public ToDoItemBotController(String botToken,
            String botName,
            ToDoItemService toDoItemService,
            SprintService sprintService,
            UserService userService,
            TaskAssignmentService taskAssignmentService,
            SubToDoItemService subToDoItemService) {
        super(botToken);
        this.toDoItemService = toDoItemService;
        this.sprintService = sprintService;
        this.userService = userService;
        this.taskAssignmentService = taskAssignmentService;
        this.subToDoItemService = subToDoItemService;
        this.botName = botName;
        logger.info("Bot initialized: {}", botName);
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (!update.hasMessage() || !update.getMessage().hasText())
            return;
        long chatId = update.getMessage().getChatId();
        String text = update.getMessage().getText().trim();
        BotState state = chatState.getOrDefault(chatId, BotState.NONE);

        try {
            switch (state) {
                case AWAITING_DESCRIPTION:
                    handleAwaitingDescription(chatId, text);
                    return;
                case AWAITING_ESTIMATED_HOURS:
                    handleAwaitingEstimatedHours(chatId, text);
                    return;
                case AWAITING_SUBTASKS_INPUT:
                    handleAwaitingSubtasks(chatId, text);
                    return;
                case AWAITING_SPRINT_SELECTION:
                    handleAwaitingSprintSelection(chatId, text);
                    return;
                case AWAITING_USER_SELECTION:
                    handleAwaitingUserSelection(chatId, text);
                    return;
                case AWAITING_REAL_HOURS:
                    handleAwaitingRealHours(chatId, text);
                    return;
                case AWAITING_ADD_SUBTASK:
                    handleAwaitingAddSubtask(chatId, text);
                    return;
                default:
                    break;
            }

            // No flow pending: handle commands
            if ("/dashboard".equalsIgnoreCase(text)) {
                handleDashboardCommand(chatId);
            } else if ("/completed".equalsIgnoreCase(text)) {
                handleCompletedCommand(chatId);
            } else if ("/addsubtask".equalsIgnoreCase(text)) {
                handleAddSubtaskCommand(chatId);
            } else if (text.equals(BotCommands.START_COMMAND.getCommand())
                    || text.equals(BotLabels.SHOW_MAIN_SCREEN.getLabel())) {
                handleStartCommand(chatId);
            } else if (text.equals(BotCommands.TODO_LIST.getCommand())
                    || text.equals(BotLabels.LIST_ALL_ITEMS.getLabel())
                    || text.equals(BotLabels.MY_TODO_LIST.getLabel())) {
                handleListCommand(chatId);
            } else if (text.equals(BotCommands.ADD_ITEM.getCommand())
                    || text.equals(BotLabels.ADD_NEW_ITEM.getLabel())) {
                handleAddItemCommand(chatId);
            } else {
                BotHelper.sendMessageToTelegram(chatId, "⚠️ Comando no reconocido. Usa /start para ver opciones.",
                        this);
            }
        } catch (Exception e) {
            logger.error("Error processing update", e);
            BotHelper.sendMessageToTelegram(chatId, "❌ Ocurrió un error. Intenta de nuevo.", this);
        }
    }

    @Override
    public String getBotUsername() {
        return botName;
    }

    /*** CORE HANDLERS ***/
    private void handleStartCommand(long chatId) throws TelegramApiException {
        SendMessage msg = new SendMessage();
        msg.setChatId(chatId);
        msg.setText(BotMessages.HELLO_MYTODO_BOT.getMessage());

        ReplyKeyboardMarkup kb = new ReplyKeyboardMarkup();
        List<KeyboardRow> rows = new ArrayList<>();
        KeyboardRow r1 = new KeyboardRow();
        r1.add(BotLabels.LIST_ALL_ITEMS.getLabel());
        r1.add(BotLabels.ADD_NEW_ITEM.getLabel());
        rows.add(r1);
        KeyboardRow r2 = new KeyboardRow();
        r2.add("/completed");
        r2.add("/dashboard");
        rows.add(r2);
        KeyboardRow r3 = new KeyboardRow();
        r3.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
        r3.add(BotLabels.HIDE_MAIN_SCREEN.getLabel());
        rows.add(r3);
        kb.setKeyboard(rows);
        msg.setReplyMarkup(kb);
        execute(msg);
    }

    private void handleListCommand(long chatId) {
        List<ToDoItem> active = toDoItemService.findAll().stream()
            .filter(i -> !i.isDone())
            .collect(Collectors.toList());
    
        if (active.isEmpty()) {
            BotHelper.sendMessageToTelegram(chatId, "No tienes tareas activas.", this);
        } else {
            StringBuilder sb = new StringBuilder("📋 *Tus tareas activas:*\n\n");
            Map<Long, List<ToDoItem>> bySprint = active.stream()
                .collect(Collectors.groupingBy(ToDoItem::getSprintId));
            for (var entry : bySprint.entrySet()) {
                Sprint sp = sprintService.getSprintById(entry.getKey().intValue());
                sb.append("🔹 Sprint ").append(sp.getSprintName()).append("\n");
                for (ToDoItem t : entry.getValue()) {
                    sb.append("   ↪️ ").append(t.getDescription())
                      .append(" (").append(t.getEstimatedHours()).append("h)")
                      .append("  /done_").append(t.getId())
                      .append("  /addsubtask\n");
                }
                sb.append("\n");
            }
            BotHelper.sendMessageToTelegram(chatId, sb.toString(), this);
        }
    
        // Mostrar siempre el menú después
        sendMainMenu(chatId);
    }
    
    private void handleCompletedCommand(long chatId) {
        List<ToDoItem> done = toDoItemService.findAll().stream().filter(ToDoItem::isDone).collect(Collectors.toList());
        StringBuilder sb = new StringBuilder("✅ *Completed Tasks:*\n\n");
        Map<Long, List<ToDoItem>> bySprint = done.stream().collect(Collectors.groupingBy(ToDoItem::getSprintId));
        bySprint.forEach((sprintId, tasks) -> {
            Sprint sp = sprintService.getSprintById(sprintId.intValue());
            sb.append("🔹 Sprint ").append(sp.getSprintId())
                    .append(" (").append(sp.getSprintName()).append(") (Total: ")
                    .append(tasks.size()).append(")\n");
            tasks.forEach(t -> sb.append("   ↪️ ").append(t.getDescription())
                    .append(" ✓ ").append(t.getRealHours()).append("h\n"));
            sb.append("\n");
        });
        BotHelper.sendMessageToTelegram(chatId, sb.toString(), this);
    }

    private void handleDashboardCommand(long chatId) {
        // Similar logic to dashboard.js: stats per user
        StringBuilder sb = new StringBuilder("📊 *Dashboard: Stats per User*\n\n");
        userService.getAllUsers().forEach(u -> {
            List<com.springboot.MyTodoList.model.TaskAssignment> assigns = taskAssignmentService
                    .getAssignmentsForUser((long) u.getId());
            int totalTasks = assigns.size();
            double totalHours = assigns.stream()
                    .mapToDouble(a -> Optional.ofNullable(a.getTask().getRealHours()).orElse(0)).sum();
            sb.append("• ").append(u.getUsername())
                    .append(" — Tasks: ").append(totalTasks)
                    .append(", Hours: ").append(String.format("%.1f", totalHours))
                    .append(", Cost: $").append(String.format("%.2f", totalHours * 25))
                    .append("\n");
        });
        BotHelper.sendMessageToTelegram(chatId, sb.toString(), this);
    }

    /*** CREATION FLOW ***/
    private void handleAddItemCommand(long chatId) {
        BotHelper.sendMessageToTelegram(chatId, "🖊️ Describe la nueva tarea:", this);
        chatState.put(chatId, BotState.AWAITING_DESCRIPTION);
    }

    private void handleAwaitingDescription(long chatId, String text) {
        ToDoItem t = new ToDoItem();
        t.setDescription(text);
        t.setCreationTs(OffsetDateTime.now());
        t.setDone(false);
        pendingToDo.put(chatId, t);
        BotHelper.sendMessageToTelegram(chatId, "⏱️ Horas estimadas?", this);
        chatState.put(chatId, BotState.AWAITING_ESTIMATED_HOURS);
    }

    private void handleAwaitingEstimatedHours(long chatId, String text) {
        double est;
        try {
            est = Double.parseDouble(text);
        } catch (Exception e) {
            BotHelper.sendMessageToTelegram(chatId, "⚠️ Número inválido.", this);
            return;
        }
        ToDoItem t = pendingToDo.get(chatId);
        t.setEstimatedHours(est);
        if (est > LONG_TASK_DURATION) {
            BotHelper.sendMessageToTelegram(chatId, "🔸 Horas >4. Ingresa subtareas separadas por ", this);
            chatState.put(chatId, BotState.AWAITING_SUBTASKS_INPUT);
        } else {
            startSprintSelection(chatId);
        }
    }

    private void handleAwaitingSubtasks(long chatId, String text) {
        List<String> subs = Arrays.stream(text.split(","))
                .map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());
        pendingSubTasksInput.put(chatId, subs);
        startSprintSelection(chatId);
    }

    private void startSprintSelection(long chatId) {
        ReplyKeyboardMarkup kb = new ReplyKeyboardMarkup();
        kb.setResizeKeyboard(true);
        kb.setOneTimeKeyboard(true);
    
        List<KeyboardRow> rows = new ArrayList<>();
        for (Sprint s : sprintService.findAll()) {
            KeyboardRow r = new KeyboardRow();
            r.add(s.getSprintId() + " - " + s.getSprintName());
            rows.add(r);
        }
        kb.setKeyboard(rows);
    
        // Enviar con teclado
        SendMessage msg = new SendMessage();
        msg.setChatId(String.valueOf(chatId));
        msg.setText("🔖 Selecciona sprint:");
        msg.setReplyMarkup(kb);
        try { execute(msg); }
        catch (TelegramApiException e) { logger.error(e.getMessage(), e); }
    
        chatState.put(chatId, BotState.AWAITING_SPRINT_SELECTION);
    }
    

    private void handleAwaitingSprintSelection(long chatId, String text) {
        int sprintId = Integer.parseInt(text.split(" - ")[0]);
        ToDoItem t = pendingToDo.get(chatId);
        t.setSprintId((long) sprintId);
    
        ReplyKeyboardMarkup kb = new ReplyKeyboardMarkup();
        kb.setResizeKeyboard(true);
        kb.setOneTimeKeyboard(true);
    
        List<KeyboardRow> rows = new ArrayList<>();
        for (User u : userService.getAllUsers()) {
            KeyboardRow r = new KeyboardRow();
            r.add(u.getUsername());
            rows.add(r);
        }
        kb.setKeyboard(rows);
    
        SendMessage msg = new SendMessage();
        msg.setChatId(String.valueOf(chatId));
        msg.setText("👤 Asigna usuario:");
        msg.setReplyMarkup(kb);
        try { execute(msg); }
        catch (TelegramApiException e) { logger.error(e.getMessage(), e); }
    
        chatState.put(chatId, BotState.AWAITING_USER_SELECTION);
    }
    
    private void handleAwaitingUserSelection(long chatId, String text) {
        User u = userService.findByUsername(text).orElse(null);
        if (u == null) {
            BotHelper.sendMessageToTelegram(chatId, "⚠️ Usuario no existe.", this);
            return;
        }
        ToDoItem t = pendingToDo.get(chatId);
        t.setUserId((long) u.getId());
        ToDoItem saved = toDoItemService.addToDoItem(t);
        taskAssignmentService.createAssignment((long) saved.getId(), (long) u.getId());
        if (pendingSubTasksInput.containsKey(chatId)) {
            pendingSubTasksInput.get(chatId)
                    .forEach(desc -> subToDoItemService.addSubTask(new SubToDoItem(saved, desc, false)));
            pendingSubTasksInput.remove(chatId);
        }
        BotHelper.sendMessageToTelegram(chatId, "✅ Tarea creada ID " + saved.getId(), this);
        chatState.put(chatId, BotState.NONE);
    }

    /*** SUBTASK FLOW ***/
    private void handleAddSubtaskCommand(long chatId) {
        // No borramos el teclado, dejamos el principal
        BotHelper.sendMessageToTelegram(chatId,
            "🔸 Ahora ingresa subtarea en formato <taskId>:<descripción>. Cuando termines escribe \"terminar\".",
            this);
        chatState.put(chatId, BotState.AWAITING_ADD_SUBTASK);
    }
    
    private void handleAwaitingAddSubtask(long chatId, String text) {
        if ("terminar".equalsIgnoreCase(text)) {
            BotHelper.sendMessageToTelegram(chatId, "✅ Has terminado de agregar subtareas.", this);
            chatState.put(chatId, BotState.NONE);
            sendMainMenu(chatId);
            return;
        }
    
        try {
            String[] parts = text.split(":", 2);
            int taskId = Integer.parseInt(parts[0].trim());
            String desc = parts[1].trim();
            ToDoItem parent = toDoItemService.getItemById(taskId).getBody();
            subToDoItemService.addSubTask(new SubToDoItem(parent, desc, false));
    
            BotHelper.sendMessageToTelegram(chatId,
                "🔸 Subtarea añadida. Escribe otra subtarea o \"terminar\" cuando hayas acabado.",
                this);
            // permanecemos en AWAITING_ADD_SUBTASK
        } catch (Exception e) {
            BotHelper.sendMessageToTelegram(chatId,
                "⚠️ Formato inválido. Usa <taskId>:<descripción> o escribe \"terminar\".",
                this);
            // permanecemos en AWAITING_ADD_SUBTASK
        }
    }
    

    /*** COMPLETE FLOW ***/
    private void handleCompletedRealHours(long chatId, String text) {
        // Deprecated by handleAwaitingRealHours
    }

    private void handleAwaitingRealHours(long chatId, String text) {
        int id = pendingRealHoursTask.get(chatId);
        int real;
        try {
            real = Integer.parseInt(text);
        } catch (Exception e) {
            BotHelper.sendMessageToTelegram(chatId, "⚠️ Número inválido.", this);
            return;
        }
        toDoItemService.markTaskAsDone(id, real);
        BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_DONE.getMessage(), this);
        pendingRealHoursTask.remove(chatId);
        chatState.put(chatId, BotState.NONE);
    }

    // al final de la clase, justo antes de cerrar la llave
private void sendMainMenu(long chatId) {
    ReplyKeyboardMarkup kb = new ReplyKeyboardMarkup();
    kb.setResizeKeyboard(true);
    kb.setOneTimeKeyboard(false);
    List<KeyboardRow> rows = new ArrayList<>();

    KeyboardRow r1 = new KeyboardRow();
    r1.add(BotLabels.LIST_ALL_ITEMS.getLabel());
    r1.add(BotLabels.ADD_NEW_ITEM.getLabel());
    rows.add(r1);

    KeyboardRow r2 = new KeyboardRow();
    r2.add("/completed");
    r2.add("/dashboard");
    rows.add(r2);

    KeyboardRow r3 = new KeyboardRow();
    r3.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
    r3.add(BotLabels.HIDE_MAIN_SCREEN.getLabel());
    rows.add(r3);

    kb.setKeyboard(rows);

    SendMessage menu = new SendMessage();
    menu.setChatId(String.valueOf(chatId));
    menu.setText("Elige una opción:");
    menu.setReplyMarkup(kb);
    try {
        execute(menu);
    } catch (TelegramApiException e) {
        logger.error("Error enviando menú", e);
    }
}


}
