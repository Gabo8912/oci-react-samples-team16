package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Team;
import com.springboot.MyTodoList.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/teams")
public class TeamController {
    
    @Autowired
    private TeamService teamService;
    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Team>> getTeamsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(teamService.findByProjectId(projectId));
    }
    
    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<Team>> getTeamsByManager(@PathVariable Integer managerId) {
        return ResponseEntity.ok(teamService.findByManagerId(managerId));
    }
    
    @PostMapping
    public ResponseEntity<Team> createTeam(@RequestBody Team team) {
        return ResponseEntity.ok(teamService.save(team));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        teamService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}