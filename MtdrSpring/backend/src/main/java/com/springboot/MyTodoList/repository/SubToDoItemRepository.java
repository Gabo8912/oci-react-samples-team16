package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.SubToDoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubToDoItemRepository extends JpaRepository<SubToDoItem, Integer> {
    
    // Use todoItem.id since that's the actual property name in the entity
    List<SubToDoItem> findByTodoItem_Id(int todoItemId);
    
    @Modifying
    @Query("DELETE FROM SubToDoItem s WHERE s.todoItem.id = :todoItemId")
    void deleteByTodoItemId(@Param("todoItemId") int todoItemId);
    
    // Remove the findByParentTaskId method since we don't have a parentTask property
    // Or rename it to findByTodoItem_Id if you want to keep both names
}