package com.springboot.MyTodoList.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.springboot.MyTodoList.model.SubToDoItem;
import com.springboot.MyTodoList.repository.SubToDoItemRepository;

@Service
public class SubToDoItemService {
    @Autowired
    private SubToDoItemRepository subToDoItemRepository;

    public List<SubToDoItem> getSubTasks(int todoitemId) {
        return subToDoItemRepository.findByParentTask_ID(todoitemId);
    }

    public SubToDoItem toggleSubTaskStatus(int id) {
        SubToDoItem subTask = subToDoItemRepository.findById(id).orElseThrow();
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
