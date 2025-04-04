package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.repository.ProjectRepository;
import com.springboot.MyTodoList.repository.SprintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SprintService {

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private ProjectRepository projectRepository;
    // Get all sprints
    public List<Sprint> findAll() {
        return sprintRepository.findAll();
    }

    // Get sprint by ID
    public ResponseEntity<Sprint> getSprintById(int id) {
        Optional<Sprint> sprintData = sprintRepository.findById(id);
        return sprintData.map(sprint -> new ResponseEntity<>(sprint, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Create new sprint
    public Sprint addSprint(Sprint sprint) {
        return sprintRepository.save(sprint);
    }

    // Delete sprint
    public boolean deleteSprint(int id) {
        try {
            sprintRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }


    public Sprint updateSprint(int id, Sprint sprintUpdates) {
        Optional<Sprint> sprintData = sprintRepository.findById(id);
        if (sprintData.isPresent()) {
            Sprint sprint = sprintData.get();
            sprint.setSprintName(sprintUpdates.getSprintName());
            
            // Hardcode project ID to 1
            Project project = new Project();
            project.setProjectId(1L);
            sprint.setProject(project);
            
            sprint.setStartDate(sprintUpdates.getStartDate());
            sprint.setFinishDate(sprintUpdates.getFinishDate());
            sprint.setStatus(sprintUpdates.getStatus());
            return sprintRepository.save(sprint);
        }
        return null;
    }

    // Get sprints by project ID
    public List<Sprint> findByProjectId(int projectId) {
        return sprintRepository.findByProjectId(projectId);
    }

    // Get active sprints (assuming "ACTIVE" is a status value)
    public List<Sprint> findActiveSprints() {
        return sprintRepository.findByStatus("ACTIVE");
    }

    // Get sprints by status
    public List<Sprint> findByStatus(String status) {
        return sprintRepository.findByStatus(status);
    }

    // Check if a sprint exists by ID
    public boolean existsById(int id) {
        return sprintRepository.existsById(id);
    }
    
   
}