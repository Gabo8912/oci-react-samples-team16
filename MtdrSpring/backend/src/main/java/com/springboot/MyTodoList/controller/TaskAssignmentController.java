package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.dto.TeamDTO;
import com.springboot.MyTodoList.model.TaskAssignment;
import com.springboot.MyTodoList.service.TaskAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
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
    //Yogurt
    //Gurt: yo
    @GetMapping("/teams")
    public ResponseEntity<List<TeamDTO>> getTeams() {
        // Hardcoded teams for now
        TeamDTO team1 = new TeamDTO(1L, "Team 1", Arrays.asList(2L, 3L, 6L)); // Manager + 2 users
        TeamDTO team2 = new TeamDTO(2L, "Team 2", Arrays.asList(2L, 7L, 8L));  // Manager + 2 users
        return ResponseEntity.ok(Arrays.asList(team1, team2));
    }
}