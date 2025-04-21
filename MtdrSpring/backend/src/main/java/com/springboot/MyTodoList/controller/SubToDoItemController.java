package com.springboot.MyTodoList.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.springboot.MyTodoList.model.SubToDoItem;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.service.SubToDoItemService;
import com.springboot.MyTodoList.service.ToDoItemService;

@RestController
@RequestMapping("/todolist/subtask")
public class SubToDoItemController {
    @Autowired
    private SubToDoItemService subToDoItemService;
    @Autowired 
    private ToDoItemService toDoItemService;

    // Get all subtasks for a specific task
    @GetMapping("/{taskId}")
    public ResponseEntity<List<SubToDoItem>> getSubTasks(@PathVariable int taskId) {
        return ResponseEntity.ok(subToDoItemService.getSubTasks(taskId));
    }

    // Get all subtasks (across all tasks)
    @GetMapping("/all")
    public ResponseEntity<List<SubToDoItem>> getAllSubTasks() {
        return ResponseEntity.ok(subToDoItemService.getAllSubTasks());
    }

    // Get subtask by ID
    @GetMapping("/single/{id}")
    public ResponseEntity<SubToDoItem> getSubTaskById(@PathVariable int id) {
        return ResponseEntity.ok(subToDoItemService.getSubTaskById(id));
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<SubToDoItem> toggleSubTask(@PathVariable int id) {
        return ResponseEntity.ok(subToDoItemService.toggleSubTaskStatus(id));
    }

    @PostMapping("/{taskId}/add")
    public ResponseEntity<SubToDoItem> addSubTask(
            @PathVariable int taskId, 
            @RequestBody SubToDoItem subTask) {
        ToDoItem parentTask = toDoItemService.getItemById(taskId).getBody();  
        if (parentTask == null) {
            return ResponseEntity.notFound().build();
        }
        subTask.setParentTask(parentTask);
        SubToDoItem savedSubTask = subToDoItemService.addSubTask(subTask);
        return ResponseEntity.ok(savedSubTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubTask(@PathVariable int id) {
        boolean isDeleted = subToDoItemService.deleteSubTask(id);
        return isDeleted ? 
            ResponseEntity.noContent().build() : 
            ResponseEntity.notFound().build();
    }
}