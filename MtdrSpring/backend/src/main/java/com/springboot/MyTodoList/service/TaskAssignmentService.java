package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.TaskAssignment;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.repository.TaskAssignmentRepository;
import com.springboot.MyTodoList.repository.ToDoItemRepository;
import com.springboot.MyTodoList.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskAssignmentService {

    @Autowired
    private TaskAssignmentRepository taskAssignmentRepository;

    @Autowired
    private ToDoItemRepository toDoItemRepository;

    @Autowired
    private UserRepository userRepository;

    public TaskAssignment createAssignment(Long taskId, Long userId) {
        // Convert Long to Integer for taskId, but keep userId as Long
        Optional<ToDoItem> task = toDoItemRepository.findById(taskId.intValue());
        Optional<User> user = userRepository.findById(userId); // ✅ esto ya está correcto

        if (task.isPresent() && user.isPresent()) {
            TaskAssignment newAssignment = new TaskAssignment();
            newAssignment.setTask(task.get());
            newAssignment.setUser(user.get());
            return taskAssignmentRepository.save(newAssignment);
        }

        throw new IllegalArgumentException("Task or User not found with provided IDs");
    }

    public List<TaskAssignment> getAssignmentsForUser(Long userId) {
        return taskAssignmentRepository.findByUserId(userId);
    }

    public List<TaskAssignment> getAssignmentsForTask(Long taskId) {
        return taskAssignmentRepository.findByTaskId(taskId);
    }
}
