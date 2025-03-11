package com.springboot.MyTodoList.model;

import javax.persistence.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.OffsetDateTime;

@Entity
@Table(name = "SUBTODOITEM", schema = "TODOUSER")

public class SubToDoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ID;

    @ManyToOne
    @JoinColumn(name = "TODOITEM_ID", nullable = false)
    private ToDoItem parentTask;

    @Column(name = "DESCRIPTION", length = 4000)
    String description;

    @Column(name = "CREATION_TS", columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private OffsetDateTime creation_ts;

    @Column(name = "DONE")
    private Boolean done;

    public SubToDoItem() {
    }

    public void SubTodoItem(int ID, ToDoItem parentTask, String description, Boolean done, OffsetDateTime creation_ts) {
        this.description = description;
        this.done = done;
        this.ID = ID;
        this.parentTask = parentTask;
        this.creation_ts = creation_ts;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public void setToDoItem(ToDoItem parenTask) {
        this.parentTask = parenTask;
    }

    public void setParentTask(ToDoItem parentTask) {
        this.parentTask = parentTask;
    }

    public String getDescription() {
        return description;
    }

    public int getID() {
        return ID;
    }

    public boolean isDone() {
        return done;
    }

    public ToDoItem getParentTask() {
        return parentTask;
    }

    public OffsetDateTime getCreation_ts() {
        return creation_ts;
    }

    public void setCreation_ts(OffsetDateTime creation_ts) {
        this.creation_ts = creation_ts;
    }

    

}
