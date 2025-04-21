package com.springboot.MyTodoList.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.springboot.MyTodoList.model.SubToDoItem;
import com.springboot.MyTodoList.repository.SubToDoItemRepository;

@Service
public class SubToDoItemService {
    @Autowired
    private SubToDoItemRepository subToDoItemRepository;

    public List<SubToDoItem> getSubTasks(int todoitemId) {
        return subToDoItemRepository.findByTodoItem_Id(todoitemId);
    }

    public List<SubToDoItem> getAllSubTasks() {
        return subToDoItemRepository.findAll();
    }

    public SubToDoItem getSubTaskById(int id) {
        return subToDoItemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Subtask not found"));
    }

    public SubToDoItem toggleSubTaskStatus(int id) {
        SubToDoItem subTask = getSubTaskById(id);
        subTask.setDone(!subTask.isDone());
        return subToDoItemRepository.save(subTask);
    }
    
    public SubToDoItem addSubTask(SubToDoItem subTask) {
        return subToDoItemRepository.save(subTask);
    }

    public boolean deleteSubTask(int id) {
        try {
            subToDoItemRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}