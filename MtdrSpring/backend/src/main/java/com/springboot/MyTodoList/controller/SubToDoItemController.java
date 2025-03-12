package com.springboot.MyTodoList.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.MyTodoList.model.SubToDoItem;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.service.SubToDoItemService;
import com.springboot.MyTodoList.service.ToDoItemService;

@RestController
@RequestMapping("/subtask")
public class SubToDoItemController {
    @Autowired
    private SubToDoItemService subToDoItemService;

    @Autowired 
    private ToDoItemService toDoItemService;

    @GetMapping("/{taskId}")
    public ResponseEntity<List<SubToDoItem>> getSubTasks(@PathVariable int taskId) {
        return ResponseEntity.ok(subToDoItemService.getSubTasks(taskId));
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<SubToDoItem> toggleSubTask(@PathVariable int id) {
        return ResponseEntity.ok(subToDoItemService.toggleSubTaskStatus(id));
    }

    @PostMapping("/{taskId}/add")
    public ResponseEntity<SubToDoItem> addSubTask(@PathVariable int taskId, @RequestBody SubToDoItem subTask) {
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
        if (isDeleted) {
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }
}
