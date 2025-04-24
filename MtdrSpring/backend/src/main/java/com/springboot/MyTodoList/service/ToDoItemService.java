// ✅ 2. ToDoItemService.java (versión estable original sin KPI de equipos)

package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.dto.UserKpiDTO;
import com.springboot.MyTodoList.model.SubToDoItem;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.repository.ToDoItemRepository;
import com.springboot.MyTodoList.repository.SubToDoItemRepository;
import com.springboot.MyTodoList.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ToDoItemService {

    private final ToDoItemRepository toDoItemRepository;
    private final SubToDoItemRepository subToDoItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    public ToDoItemService(ToDoItemRepository toDoItemRepository,
                           SubToDoItemRepository subToDoItemRepository) {
        this.toDoItemRepository = toDoItemRepository;
        this.subToDoItemRepository = subToDoItemRepository;
    }

    public List<ToDoItem> findAll() {
        return toDoItemRepository.findAll();
    }

    public ResponseEntity<ToDoItem> getItemById(int id) {
        if (id <= 0) {
            return ResponseEntity.badRequest().build();
        }
        return toDoItemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public ToDoItem addToDoItem(ToDoItem toDoItem) {
        if (toDoItem == null) {
            throw new IllegalArgumentException("ToDoItem cannot be null");
        }
        if (toDoItem.getDescription() == null || toDoItem.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Description cannot be empty");
        }
        if (toDoItem.getUserId() == null) {
            throw new IllegalArgumentException("userId is required when creating a task.");
        }
        return toDoItemRepository.save(toDoItem);
    }

    public boolean deleteToDoItem(int id) {
        if (id <= 0) {
            return false;
        }
        if (!toDoItemRepository.existsById(id)) {
            return false;
        }
        subToDoItemRepository.deleteByTodoItemId(id);
        toDoItemRepository.deleteById(id);
        return true;
    }

    public ToDoItem updateToDoItem(int id, ToDoItem td) {
        return toDoItemRepository.findById(id)
                .map(existingItem -> {
                    existingItem.setDescription(td.getDescription());
                    existingItem.setDone(td.isDone());
                    if (td.getRealHours() != null) {
                        existingItem.setRealHours(td.getRealHours());
                    }
                    return toDoItemRepository.save(existingItem);
                })
                .orElse(null);
    }

    public double getTaskProgress(int todoitemId) {
        if (todoitemId <= 0) {
            throw new IllegalArgumentException("ID must be positive");
        }
        List<SubToDoItem> subTasks = subToDoItemRepository.findByTodoItem_Id(todoitemId);
        if (subTasks.isEmpty()) {
            return 0.0;
        }
        long completed = subTasks.stream()
                .filter(SubToDoItem::isDone)
                .count();
        return ((double) completed / subTasks.size()) * 100;
    }

    public ToDoItem markTaskAsDone(int id, int realHours) {
        Optional<ToDoItem> optional = toDoItemRepository.findById(id);
        if (!optional.isPresent()) {
            return null;
        }

        ToDoItem task = optional.get();
        task.setDone(true);
        task.setRealHours(realHours);
        return toDoItemRepository.save(task);
    }

    // ✅ KPI por usuario con nombre real
    public List<UserKpiDTO> getUserKpisGroupedBySprint() {
        List<ToDoItem> completedTasks = toDoItemRepository.findByDoneTrue();

        return completedTasks.stream()
                .collect(Collectors.groupingBy(item -> item.getUserId() + "-" + item.getSprintId()))
                .entrySet().stream()
                .map(entry -> {
                    String[] parts = entry.getKey().split("-");
                    Long userId = Long.parseLong(parts[0]);
                    Long sprintId = Long.parseLong(parts[1]);

                    List<ToDoItem> userSprintTasks = entry.getValue();

                    String username = userRepository.findById(userId)
                            .map(u -> u.getUsername())
                            .orElse("Usuario " + userId);

                    long completed = userSprintTasks.size();
                    double hours = userSprintTasks.stream()
                            .mapToDouble(t -> t.getRealHours() != null ? t.getRealHours() : 0)
                            .sum();

                    return new UserKpiDTO(username, sprintId, completed, hours);
                })
                .collect(Collectors.toList());
    }
} 
