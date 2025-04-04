package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.service.SprintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SprintController {
    @Autowired
    private SprintService sprintService;

    @PostMapping("/sprints")
    public ResponseEntity<Sprint> addSprint(@RequestBody Sprint sprint) {
        Sprint createdSprint = sprintService.addSprint(sprint);
        HttpHeaders headers = new HttpHeaders();
        headers.set("location", "/api/sprints/" + createdSprint.getSprintId());
        headers.set("Access-Control-Expose-Headers", "location");
        return new ResponseEntity<>(createdSprint, headers, HttpStatus.CREATED);
    }

    @GetMapping("/sprints")
    public ResponseEntity<List<Sprint>> getAllSprints() {
        List<Sprint> sprints = sprintService.findAll();
        return new ResponseEntity<>(sprints, HttpStatus.OK);
    }

    @GetMapping("/sprints/{id}")
    public ResponseEntity<Sprint> getSprintById(@PathVariable int id) {
        Sprint sprint = sprintService.getSprintById(id);
        if (sprint != null) {
            return new ResponseEntity<>(sprint, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/sprints/{id}")
    public ResponseEntity<Sprint> updateSprint(@PathVariable int id, @RequestBody Sprint sprint) {
        Sprint updatedSprint = sprintService.updateSprint(id, sprint);
        if (updatedSprint != null) {
            return new ResponseEntity<>(updatedSprint, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/sprints/{id}")
    public ResponseEntity<Void> deleteSprint(@PathVariable int id) {
        boolean deleted = sprintService.deleteSprint(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}