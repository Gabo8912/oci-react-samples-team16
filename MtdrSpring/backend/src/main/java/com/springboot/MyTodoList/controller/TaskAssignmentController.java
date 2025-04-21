package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.TaskAssignment;
import com.springboot.MyTodoList.service.TaskAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/task-assignments")
public class TaskAssignmentController {

    @Autowired
    private TaskAssignmentService taskAssignmentService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskAssignment>> getAssignmentsForUser(@PathVariable Long userId) {
        List<TaskAssignment> assignments = taskAssignmentService.getAssignmentsForUser(userId);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<TaskAssignment>> getAssignmentsForTask(@PathVariable Long taskId) {
        List<TaskAssignment> assignments = taskAssignmentService.getAssignmentsForTask(taskId);
        return ResponseEntity.ok(assignments);
    }

    @PostMapping
    public ResponseEntity<TaskAssignment> createAssignment(
            @RequestParam Long taskId,
            @RequestParam Long userId) {
        TaskAssignment assignment = taskAssignmentService.createAssignment(taskId, userId);
        return ResponseEntity.ok(assignment);
    }
}