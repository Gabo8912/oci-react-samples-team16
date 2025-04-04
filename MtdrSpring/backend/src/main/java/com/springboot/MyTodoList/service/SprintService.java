package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.repository.SprintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SprintService {
    @Autowired
    private SprintRepository sprintRepository;

    // Add this method
    public Sprint addSprint(Sprint sprint) {
        // Set default projectId if not provided
        if (sprint.getProjectId() == null) {
            sprint.setProjectId(1); // Default project ID
        }
        return sprintRepository.save(sprint);
    }

    public List<Sprint> findAll() {
        return sprintRepository.findAll();
    }

    public Sprint getSprintById(int id) {
        Optional<Sprint> sprint = sprintRepository.findById(id);
        return sprint.orElse(null);
    }

    public Sprint updateSprint(int id, Sprint sprintDetails) {
        Optional<Sprint> sprintOptional = sprintRepository.findById(id);
        if (sprintOptional.isPresent()) {
            Sprint sprint = sprintOptional.get();
            sprint.setSprintName(sprintDetails.getSprintName());
            sprint.setStartDate(sprintDetails.getStartDate());
            sprint.setFinishDate(sprintDetails.getFinishDate());
            sprint.setStatus(sprintDetails.getStatus());
            return sprintRepository.save(sprint);
        }
        return null;
    }

    public boolean deleteSprint(int id) {
        if (sprintRepository.existsById(id)) {
            sprintRepository.deleteById(id);
            return true;
        }
        return false;
    }
}