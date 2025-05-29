package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.SubToDoItem;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.repository.ToDoItemRepository;
import com.springboot.MyTodoList.repository.SubToDoItemRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ToDoItemService {

    private final ToDoItemRepository toDoItemRepository;
    private final SubToDoItemRepository subToDoItemRepository;

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

        // Asignar fecha de creación si no viene
        if (toDoItem.getCreationTs() == null) {
            toDoItem.setCreationTs(OffsetDateTime.now());
        }

        // Set default estimated hours if null
        if (toDoItem.getEstimatedHours() == null) {
            toDoItem.setEstimatedHours(0.0);
        }

        return toDoItemRepository.save(toDoItem);
    }

    public boolean deleteToDoItem(int id) {
        if (id <= 0) return false;
        if (!toDoItemRepository.existsById(id)) return false;

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
                if (td.getEstimatedHours() != null) {
                    existingItem.setEstimatedHours(td.getEstimatedHours());
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
}
