package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.service.ToDoItemService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todolist")
public class ToDoItemController {

    private static final String HEADER_LOCATION = "location";
    private static final String HEADER_EXPOSE = "Access-Control-Expose-Headers";

    private final ToDoItemService toDoItemService;

    public ToDoItemController(ToDoItemService toDoItemService) {
        this.toDoItemService = toDoItemService;
    }

    @GetMapping
    public List<ToDoItem> getAllToDoItems() {
        return toDoItemService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ToDoItem> getToDoItemById(@PathVariable int id) {
        return toDoItemService.getItemById(id);
    }

    @PostMapping
    public ResponseEntity<Void> addToDoItem(@RequestBody ToDoItem todoItem) {
        ToDoItem created = toDoItemService.addToDoItem(todoItem);
        HttpHeaders headers = new HttpHeaders();
        headers.set(HEADER_LOCATION, "/api/todolist/" + created.getId());
        headers.set(HEADER_EXPOSE, HEADER_LOCATION);
        return ResponseEntity.ok().headers(headers).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ToDoItem> updateToDoItem(@PathVariable int id, @RequestBody ToDoItem toDoItem) {
        ToDoItem updated = toDoItemService.updateToDoItem(id, toDoItem);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ToDoItem> completeTask(@PathVariable int id, @RequestParam int realHours) {
        ToDoItem updated = toDoItemService.markTaskAsDone(id, realHours);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteToDoItem(@PathVariable int id) {
        boolean deleted = toDoItemService.deleteToDoItem(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/tasks/{id}/progress")
    public ResponseEntity<Double> getTaskProgress(@PathVariable int id) {
        double progress = toDoItemService.getTaskProgress(id);
        return ResponseEntity.ok(progress);
    }
}
