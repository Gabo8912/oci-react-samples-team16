package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "SUBTODOITEM", schema = "TODOUSER")
public class SubToDoItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ID;

    @ManyToOne
    @JoinColumn(name = "TODOITEM_ID", nullable = false)
    private ToDoItem todoItem;

    @Column(name = "DESCRIPTION", length = 4000)
    private String description;

    @Column(name = "CREATION_TS", columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private OffsetDateTime creation_ts;

    @Column(name = "DONE")
    private Boolean done;

    // Constructors
    public SubToDoItem() {}

    public SubToDoItem(ToDoItem parentTask, String description, Boolean done) {
        this.todoItem = parentTask;
        this.description = description;
        this.done = done;
    }

    // Getters and Setters
    public int getID() { return ID; }
    public void setID(int ID) { this.ID = ID; }
    
    public ToDoItem getTodoItem() { return todoItem; }
    public void setTodoItem(ToDoItem todoItem) { this.todoItem = todoItem; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public OffsetDateTime getCreation_ts() { return creation_ts; }
    public void setCreation_ts(OffsetDateTime creation_ts) { this.creation_ts = creation_ts; }
    
    public Boolean isDone() { return done; }
    public void setDone(Boolean done) { this.done = done; }

    // Helper method for parent task reference
    public void setParentTask(ToDoItem todoItem) {
        this.todoItem = todoItem;
    }
    
    public ToDoItem getParentTask() {
        return todoItem;
    }

    @Override
    public String toString() {
        return "SubToDoItem{" +
                "ID=" + ID +
                ", description='" + description + '\'' +
                ", creation_ts=" + creation_ts +
                ", done=" + done +
                ", parentTaskID=" + (todoItem != null ? todoItem.getId() : "null") +
                '}';
    }
}