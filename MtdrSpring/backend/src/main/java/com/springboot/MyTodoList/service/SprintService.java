package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.repository.SprintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SprintService {
    
    @Autowired
    private SprintRepository sprintRepository;
    
    public List<Sprint> findByProjectId(Long projectId) {
        return sprintRepository.findByProjectProjectId(projectId);
    }
    
    public Sprint save(Sprint sprint) {
        return sprintRepository.save(sprint);
    }
    
    public void deleteById(Long id) {
        sprintRepository.deleteById(id);
    }
}