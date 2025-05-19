package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.TaskAssignment;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.repository.TaskAssignmentRepository;
import com.springboot.MyTodoList.repository.ToDoItemRepository;
import com.springboot.MyTodoList.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskAssignmentService {

    private final TaskAssignmentRepository taskAssignmentRepository;
    private final ToDoItemRepository toDoItemRepository;
    private final UserRepository userRepository;

    public TaskAssignmentService(
        TaskAssignmentRepository taskAssignmentRepository,
        ToDoItemRepository toDoItemRepository,
        UserRepository userRepository
    ) {
        this.taskAssignmentRepository = taskAssignmentRepository;
        this.toDoItemRepository = toDoItemRepository;
        this.userRepository = userRepository;
    }

    public TaskAssignment createAssignment(Long taskId, Long userId) {
        ToDoItem task = toDoItemRepository.findById(taskId.intValue())
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + taskId));

        User user = userRepository.findById(userId.intValue())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        TaskAssignment assignment = new TaskAssignment();
        assignment.setTask(task);
        assignment.setUser(user);
        return taskAssignmentRepository.save(assignment);
    }

    public List<TaskAssignment> getAssignmentsForUser(Long userId) {
        return taskAssignmentRepository.findByUserId(userId);
    }

    public List<TaskAssignment> getAssignmentsForTask(Long taskId) {
        return taskAssignmentRepository.findByTaskId(taskId);
    }
}
