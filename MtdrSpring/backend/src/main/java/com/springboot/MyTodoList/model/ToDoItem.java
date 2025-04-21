package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Table(name = "TODOITEM")
public class ToDoItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "CREATION_TS")
    private OffsetDateTime creationTs;

    @Column(name = "DONE")
    private boolean done;

    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "SPRINT_ID")
    private Long sprintId;

    @Column(name = "REAL_HOURS")
    private Integer realHours;

    // Default constructor required by JPA
    public ToDoItem() {
    }

    // Constructor
    public ToDoItem(String description, OffsetDateTime creationTs, boolean done, Long userId, Long sprintId) {
        this.description = description;
        this.creationTs = creationTs;
        this.done = done;
        this.userId = userId;
        this.sprintId = sprintId;
    }

    // Getters and setters - using getId() instead of getID()
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public OffsetDateTime getCreationTs() {
        return creationTs;
    }

    public void setCreationTs(OffsetDateTime creationTs) {
        this.creationTs = creationTs;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getSprintId() {
        return sprintId;
    }

    public void setSprintId(Long sprintId) {
        this.sprintId = sprintId;
    }

    public Integer getRealHours() {
        return realHours;
    }

    public void setRealHours(Integer realHours) {
        this.realHours = realHours;
    }

    @Override
    public String toString() {
        return "ToDoItem{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", creationTs=" + creationTs +
                ", done=" + done +
                ", userId=" + userId +
                ", sprintId=" + sprintId +
                '}';
    }
}