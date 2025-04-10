package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Team;

import java.util.List;

public interface TeamService {
    List<Team> findAll();
    Team getTeamById(Integer id);
    Team addTeam(Team team);
    Team updateTeam(Integer id, Team team);
    boolean deleteTeam(Integer id);
}
