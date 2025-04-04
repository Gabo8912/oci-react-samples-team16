package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Team;
import com.springboot.MyTodoList.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TeamService {
    
    @Autowired
    private TeamRepository teamRepository;
    
    public List<Team> findByProjectId(Long projectId) {
        return teamRepository.findByProjectProjectId(projectId);
    }
    
    public List<Team> findByManagerId(Integer managerId) {
        return teamRepository.findByManagerId(managerId);
    }
    
    public Team save(Team team) {
        return teamRepository.save(team);
    }
    
    public void deleteById(Long id) {
        teamRepository.deleteById(id);
    }
}
