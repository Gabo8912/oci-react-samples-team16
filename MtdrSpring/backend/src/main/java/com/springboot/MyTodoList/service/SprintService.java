package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.repository.SprintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SprintService {
    private final SprintRepository sprintRepository;

    @Autowired
    public SprintService(SprintRepository sprintRepository) {
        this.sprintRepository = sprintRepository;
    }

    public Sprint addSprint(Sprint sprint) {
        if (sprint == null) {
            throw new IllegalArgumentException("Sprint cannot be null");
        }

        // Validate required fields
        if (sprint.getProjectId() == null) {
            throw new IllegalArgumentException("Project ID must be provided for a sprint");
        }

        return sprintRepository.save(sprint);
    }

    public List<Sprint> findAll() {
        return sprintRepository.findAll();
    }

    public Sprint getSprintById(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID must be a positive number");
        }
        return sprintRepository.findById(id).orElse(null);
    }

    public Sprint updateSprint(int id, Sprint sprintDetails) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID must be a positive number");
        }
        if (sprintDetails == null) {
            throw new IllegalArgumentException("Sprint details cannot be null");
        }

        return sprintRepository.findById(id)
                .map(existingSprint -> {
                    existingSprint.setSprintName(sprintDetails.getSprintName());
                    existingSprint.setStartDate(sprintDetails.getStartDate());
                    existingSprint.setFinishDate(sprintDetails.getFinishDate());
                    existingSprint.setStatus(sprintDetails.getStatus());
                    // Ensure project ID remains unchanged
                    if (sprintDetails.getProjectId() != null && 
                        !sprintDetails.getProjectId().equals(existingSprint.getProjectId())) {
                        throw new IllegalArgumentException("Cannot change project ID of an existing sprint");
                    }
                    return sprintRepository.save(existingSprint);
                })
                .orElse(null);
    }

    public boolean deleteSprint(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID must be a positive number");
        }
        if (sprintRepository.existsById(id)) {
            sprintRepository.deleteById(id);
            return true;
        }
        return false;
    }
    public Sprint completeSprint(int id) {
        return sprintRepository.findById(id)
            .map(sprint -> {
                sprint.setStatus("COMPLETED");
                return sprintRepository.save(sprint);
            })
            .orElse(null);
    }
    public Sprint uncompleteSprint(int id) {
        return sprintRepository.findById(id)
            .map(sprint -> {
                sprint.setStatus("IN_PROGRESS");
                return sprintRepository.save(sprint);
            })
            .orElse(null);
    }
    /* 
    // Additional helper method to find sprints by project
    public List<Sprint> findSprintsByProjectId(Long projectId) {
        if (projectId == null || projectId <= 0) {
            throw new IllegalArgumentException("Project ID must be a positive number");
        }
        return sprintRepository.findByProjectId(projectId);
    }
*/
}