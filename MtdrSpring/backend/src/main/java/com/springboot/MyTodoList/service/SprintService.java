package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.repository.SprintRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SprintService {

    private final SprintRepository sprintRepository;

    public SprintService(SprintRepository sprintRepository) {
        this.sprintRepository = sprintRepository;
    }


    public Sprint addSprint(Sprint sprint) {
        validateSprintNotNull(sprint);

        if (sprint.getProjectId() == null) {
            throw new IllegalArgumentException("Project ID must be provided for a sprint");
        }

        return sprintRepository.save(sprint);
    }

    public List<Sprint> findAll() {
        return sprintRepository.findAll();
    }

    public Sprint getSprintById(int id) {
        validatePositiveId(id);
        return sprintRepository.findById(id).orElse(null);
    }

    public Sprint updateSprint(int id, Sprint sprintDetails) {
        validatePositiveId(id);
        validateSprintNotNull(sprintDetails);

        return sprintRepository.findById(id)
            .map(existing -> {
                existing.setSprintName(sprintDetails.getSprintName());
                existing.setStartDate(sprintDetails.getStartDate());
                existing.setFinishDate(sprintDetails.getFinishDate());
                existing.setStatus(sprintDetails.getStatus());

                if (sprintDetails.getProjectId() != null &&
                    !sprintDetails.getProjectId().equals(existing.getProjectId())) {
                    throw new IllegalArgumentException("Cannot change project ID of an existing sprint");
                }

                return sprintRepository.save(existing);
            })
            .orElse(null);
    }


    public boolean deleteSprint(int id) {
        validatePositiveId(id);
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

    private void validatePositiveId(Integer id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID must be a positive number");
        }
    }

    private void validateSprintNotNull(Sprint sprint) {
        if (sprint == null) {
            throw new IllegalArgumentException("Sprint cannot be null");
        }
    }

}
