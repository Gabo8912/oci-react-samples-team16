package com.springboot.MyTodoList.model;

import javax.persistence.*;

@Entity
@Table(name = "TASK_ASSIGNMENT2")
public class TaskAssignment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Keep as Long
    
    @Column(name = "TASK_ID", insertable = false, updatable = false)
    private Long taskId;  // Keep as Long
    
    @Column(name = "USER_ID", insertable = false, updatable = false)
    private Long userId;  // Keep as Long
    
    @ManyToOne
    @JoinColumn(name = "TASK_ID")
    private ToDoItem task;  // References ToDoItem with Integer ID
    
    @ManyToOne
    @JoinColumn(name = "USER_ID")
    private User user;  // References User with Integer ID

    // Constructors
    public TaskAssignment() {
    }

    // Constructor with objects
    public TaskAssignment(ToDoItem task, User user) {
        this.task = task;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ToDoItem getTask() {
        return task;
    }

    public void setTask(ToDoItem task) {
        this.task = task;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "TaskAssignment{" +
                "id=" + id +
                ", task=" + (task != null ? task.getId() : "null") +
                ", user=" + (user != null ? user.getId() : "null") +
                '}';
    }
}