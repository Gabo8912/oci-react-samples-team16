package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @GetMapping(value = "/projects")
    public List<Project> getAllProjects() {
        return projectService.findAll();
    }

    @GetMapping(value = "/projects/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    @PostMapping(value = "/projects")
    public ResponseEntity addProject(@RequestBody Project project) {
        Project createdProject = projectService.addProject(project);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location", "" + createdProject.getProjectId());
        responseHeaders.set("Access-Control-Expose-Headers", "location");
        return ResponseEntity.ok()
                .headers(responseHeaders).build();
    }

    @PutMapping(value = "/projects/{id}")
    public ResponseEntity updateProject(@RequestBody Project project, @PathVariable Long id) {
        Project updatedProject = projectService.updateProject(id, project);
        if (updatedProject == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedProject);
    }

    @DeleteMapping(value = "/projects/{id}")
    public ResponseEntity<Boolean> deleteProject(@PathVariable Long id) {
        boolean deleted = projectService.deleteProject(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(true);
    }
}