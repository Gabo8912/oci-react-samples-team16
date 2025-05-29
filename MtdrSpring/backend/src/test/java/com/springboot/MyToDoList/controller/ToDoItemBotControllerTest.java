/* package com.springboot.MyToDoList.controller;

import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Chat;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import com.springboot.MyTodoList.controller.ToDoItemBotController;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ToDoItemBotControllerTest {

    private static final long CHAT_ID = 555L;

    @Mock ToDoItemService toDoItemService;
    @Mock SprintService sprintService;
    @Mock UserService userService;
    @Mock TaskAssignmentService taskAssignmentService;
    @Mock SubToDoItemService subToDoItemService;

    @Spy
    @InjectMocks
    ToDoItemBotController bot;

    private List<SendMessage> sentMessages;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        sentMessages = new ArrayList<>();

        try {
            // Capturamos los mensajes sin llamar al método real
            doAnswer(invocation -> {
                SendMessage msg = invocation.getArgument(0);
                sentMessages.add(msg);
                return null;
            }).when(bot).execute(any(SendMessage.class));
        } catch (TelegramApiException e) {
            throw new RuntimeException(e);
        }
    }

    private Update makeUpdate(String text) {
        Update upd = new Update();
        Message msg = new Message();
        msg.setText(text);
        Chat chat = new Chat();
        chat.setId(CHAT_ID);
        msg.setChat(chat);
        upd.setMessage(msg);
        return upd;
    }

    @Test
    void whenCreateTaskCommand_thenBotRequestsDescription() {
        bot.onUpdateReceived(makeUpdate("/addtask"));

        assertThat(sentMessages).isNotEmpty();
        sentMessages.forEach(msg -> System.out.println("Mensaje enviado: " + msg.getText()));
    }

    @Test
    void whenReceiveTodolistCommand_thenBotListsActiveTasks() {
        Sprint sp = new Sprint();
        sp.setSprintId(1);
        sp.setSprintName("Sprint 1");
        when(sprintService.getSprintById(1)).thenReturn(sp);

        ToDoItem t1 = new ToDoItem();
        t1.setId(10);
        t1.setDescription("Tarea A");
        t1.setEstimatedHours(2.0);
        t1.setDone(false);
        t1.setSprintId(1L);

        ToDoItem t2 = new ToDoItem();
        t2.setId(11);
        t2.setDescription("Tarea B");
        t2.setEstimatedHours(3.0);
        t2.setDone(false);
        t2.setSprintId(1L);

        when(toDoItemService.findAll()).thenReturn(Arrays.asList(t1, t2));

        bot.onUpdateReceived(makeUpdate("/todolist"));

        assertThat(sentMessages).isNotEmpty();
        sentMessages.forEach(msg -> System.out.println("Mensaje enviado: " + msg.getText()));
    }

    @Test
    void whenReceiveCompletedCommand_thenBotListsDoneTasks() {
        Sprint sp = new Sprint();
        sp.setSprintId(2);
        sp.setSprintName("Sprint 2");
        when(sprintService.getSprintById(2)).thenReturn(sp);

        ToDoItem d1 = new ToDoItem();
        d1.setId(20);
        d1.setDescription("Tarea C");
        d1.setDone(true);
        d1.setRealHours(4);
        d1.setSprintId(2L);

        ToDoItem d2 = new ToDoItem();
        d2.setId(21);
        d2.setDescription("Tarea D");
        d2.setDone(true);
        d2.setRealHours(5);
        d2.setSprintId(2L);

        when(toDoItemService.findAll()).thenReturn(Arrays.asList(d1, d2));

        bot.onUpdateReceived(makeUpdate("/completed"));

        assertThat(sentMessages).isNotEmpty();
        sentMessages.forEach(msg -> System.out.println("Mensaje enviado: " + msg.getText()));
    }

    @Test
    void whenReceiveUserCompletedTasksCommand_thenBotListsUserDoneTasks() {
        User user = new User();
        user.setId(1);
        user.setUsername("testuser");
        when(userService.findByUsername("testuser")).thenReturn(java.util.Optional.of(user));

        ToDoItem d1 = new ToDoItem();
        d1.setId(30);
        d1.setDescription("Tarea E");
        d1.setDone(true);
        d1.setRealHours(2);
        d1.setUserId(1L);

        ToDoItem d2 = new ToDoItem();
        d2.setId(31);
        d2.setDescription("Tarea F");
        d2.setDone(true);
        d2.setRealHours(3);
        d2.setUserId(1L);

        when(toDoItemService.findAll()).thenReturn(Arrays.asList(d1, d2));

        bot.onUpdateReceived(makeUpdate("/usercompleted testuser"));

        assertThat(sentMessages).isNotEmpty();
        sentMessages.forEach(msg -> System.out.println("Mensaje enviado: " + msg.getText()));
    }
}
 */