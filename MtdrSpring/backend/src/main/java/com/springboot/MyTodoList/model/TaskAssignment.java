package com.springboot.MyTodoList.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

@Entity
@Table(name = "TASK_ASSIGNMENT2")
public class TaskAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "TASK_ID", insertable = false, updatable = false)
    private Long taskId;

    @Column(name = "USER_ID", insertable = false, updatable = false)
    private Long userId;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "TASK_ID")
    private ToDoItem task;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "USER_ID")
    private User user;

    public TaskAssignment() {
    }

    public TaskAssignment(ToDoItem task, User user) {
        this.task = task;
        this.user = user;
    }

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
