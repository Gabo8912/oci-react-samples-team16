package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.SubToDoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubToDoItemRepository extends JpaRepository<SubToDoItem, Integer> {
    List<SubToDoItem> findByParentTask_ID(int todoitemId);
}