package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Integer> {
    
    // Remove this incorrect method (it's trying to use a non-existent field)
    // List<Sprint> findByProjectById(int projectId);
    
    // Correct method using the Project relationship
    @Query("SELECT s FROM Sprint s WHERE s.project.projectId = :projectId")
    List<Sprint> findByProjectId(@Param("projectId") int projectId);
    
    // Regular derived query method
    List<Sprint> findByStatus(String status);
}