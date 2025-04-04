package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "SPRINTS", schema = "TODOUSER")
public class Sprint {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SPRINT_ID")
    private Long sprintId;
    
    @ManyToOne
    @JoinColumn(name = "PROJECT_ID", nullable = false)
    private Project project;
    
    @Column(name = "SPRINT_NAME", nullable = false)
    private String sprintName;
    
    @Column(name = "START_DATE")
    @Temporal(TemporalType.DATE)
    private Date startDate;
    
    @Column(name = "FINISH_DATE")
    @Temporal(TemporalType.DATE)
    private Date finishDate;
    
    @Column(name = "STATUS", length = 50)
    private String status;
    
    @OneToMany(mappedBy = "sprint", cascade = CascadeType.ALL)
    private List<ToDoItem> todoItems;

    // Getters and Setters
    public Long getSprintId() { return sprintId; }
    public void setSprintId(Long sprintId) { this.sprintId = sprintId; }
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    public String getSprintName() { return sprintName; }
    public void setSprintName(String sprintName) { this.sprintName = sprintName; }
    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }
    public Date getFinishDate() { return finishDate; }
    public void setFinishDate(Date finishDate) { this.finishDate = finishDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<ToDoItem> getTodoItems() { return todoItems; }
    public void setTodoItems(List<ToDoItem> todoItems) { this.todoItems = todoItems; }
}