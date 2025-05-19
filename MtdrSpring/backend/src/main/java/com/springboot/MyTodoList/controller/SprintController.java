package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.service.SprintService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class SprintController {

    private static final String HEADER_LOCATION = "location";
    private static final String HEADER_EXPOSE = "Access-Control-Expose-Headers";

    private final SprintService sprintService;

    public SprintController(SprintService sprintService) {
        this.sprintService = sprintService;
    }

    @PostMapping("/sprints")
    public ResponseEntity<Sprint> addSprint(@RequestBody Sprint sprint) {
        Sprint createdSprint = sprintService.addSprint(sprint);
        HttpHeaders headers = new HttpHeaders();
        headers.set(HEADER_LOCATION, "/api/sprints/" + createdSprint.getSprintId());
        headers.set(HEADER_EXPOSE, HEADER_LOCATION);
        return new ResponseEntity<>(createdSprint, headers, HttpStatus.CREATED);
    }

    @GetMapping("/sprints")
    public ResponseEntity<List<Sprint>> getAllSprints() {
        return ResponseEntity.ok(sprintService.findAll());
    }

    @GetMapping("/sprints/{id}")
    public ResponseEntity<Sprint> getSprintById(@PathVariable int id) {
        return wrapOrNotFound(sprintService.getSprintById(id));
    }

    @PostMapping("/sprints/{id}/complete")
    public ResponseEntity<Sprint> completeSprint(@PathVariable int id) {
        return wrapOrNotFound(sprintService.completeSprint(id));
    }

    @PostMapping("/sprints/{id}/uncomplete")
    public ResponseEntity<Sprint> uncompleteSprint(@PathVariable int id) {
        return wrapOrNotFound(sprintService.uncompleteSprint(id));
    }

    @PutMapping("/sprints/{id}")
    public ResponseEntity<Sprint> updateSprint(@PathVariable int id, @RequestBody Sprint sprint) {
        return wrapOrNotFound(sprintService.updateSprint(id, sprint));
    }

    @DeleteMapping("/sprints/{id}")
    public ResponseEntity<Void> deleteSprint(@PathVariable int id) {
        return sprintService.deleteSprint(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    private <T> ResponseEntity<T> wrapOrNotFound(T body) {
        return body != null
                ? ResponseEntity.ok(body)
                : ResponseEntity.notFound().build();
    }
}
