package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Integer> {
    // Basic CRUD operations are inherited from JpaRepository
    List<Sprint> findByProjectId(Integer projectId);
    List<Sprint> findByStatus(String status);
}