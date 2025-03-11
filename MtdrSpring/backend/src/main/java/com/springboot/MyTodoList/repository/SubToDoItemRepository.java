package com.springboot.MyTodoList.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.springboot.MyTodoList.model.SubToDoItem;

@Repository
public interface SubToDoItemRepository extends JpaRepository<SubToDoItem, Integer>{
    List<SubToDoItem> findByParentTask_ID(int todoitemId);
}

