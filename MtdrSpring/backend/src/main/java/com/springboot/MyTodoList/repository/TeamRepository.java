package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Integer> {
}