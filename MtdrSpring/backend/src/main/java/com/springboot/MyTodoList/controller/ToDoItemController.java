package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.service.ToDoItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ToDoItemController {
    @Autowired
    private ToDoItemService toDoItemService;

    @GetMapping(value = "/todolist")
    public List<ToDoItem> getAllToDoItems() {
        return toDoItemService.findAll();
    }

    @GetMapping(value = "/todolist/{id}")
    public ResponseEntity<ToDoItem> getToDoItemById(@PathVariable int id) {
        return toDoItemService.getItemById(id);
    }

    @PostMapping(value = "/todolist")
    public ResponseEntity addToDoItem(@RequestBody ToDoItem todoItem) {
        ToDoItem td = toDoItemService.addToDoItem(todoItem);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location", "" + td.getId());
        responseHeaders.set("Access-Control-Expose-Headers", "location");
        return ResponseEntity.ok()
                .headers(responseHeaders).build();
    }

    @PutMapping(value = "todolist/{id}")
    public ResponseEntity updateToDoItem(@RequestBody ToDoItem toDoItem, @PathVariable int id) {
        ToDoItem updatedItem = toDoItemService.updateToDoItem(id, toDoItem);
        if (updatedItem == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping(value = "todolist/{id}")
    public ResponseEntity<Boolean> deleteToDoItem(@PathVariable("id") int id) {
        boolean deleted = toDoItemService.deleteToDoItem(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(true);
    }

    @GetMapping("/tasks/{id}/progress")
    public ResponseEntity<Double> getTaskProgress(@PathVariable int id) {
        double progress = toDoItemService.getTaskProgress(id);
        return ResponseEntity.ok(progress);
    }
}