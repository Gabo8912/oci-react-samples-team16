package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "SPRINTS")
public class Sprint {
    @Id
    @Column(name = "SPRINT_ID")
    private int sprintId;
    
    // Replace the primitive projectId with a proper JPA relationship
    @ManyToOne
    @JoinColumn(name = "PROJECT_ID", referencedColumnName = "PROJECT_ID")
    private Project project;
    
    @Column(name = "SPRINT_NAME")
    private String sprintName;
    
    @Column(name = "START_DATE")
    private OffsetDateTime startDate;
    
    @Column(name = "FINISH_DATE")
    private OffsetDateTime finishDate;
    
    @Column(name = "STATUS")
    private String status;

    // Constructors
    public Sprint() {}

    public Sprint(int sprintId, Project project, String sprintName, OffsetDateTime startDate, 
                 OffsetDateTime finishDate, String status) {
        this.sprintId = sprintId;
        this.project = project;
        this.sprintName = sprintName;
        this.startDate = startDate;
        this.finishDate = finishDate;
        this.status = status;
    }

    // Getters and Setters
    public int getSprintId() {
        return sprintId;
    }

    public void setSprintId(int sprintId) {
        this.sprintId = sprintId;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getSprintName() {
        return sprintName;
    }

    public void setSprintName(String sprintName) {
        this.sprintName = sprintName;
    }

    public OffsetDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(OffsetDateTime startDate) {
        this.startDate = startDate;
    }

    public OffsetDateTime getFinishDate() {
        return finishDate;
    }

    public void setFinishDate(OffsetDateTime finishDate) {
        this.finishDate = finishDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getProjectId() {
        return this.project != null ? this.project.getProjectId() : null;
    }

    // toString method
    @Override
    public String toString() {
        return "Sprint{" +
                "sprintId=" + sprintId +
                ", project=" + (project != null ? project.getProjectId() : "null") +
                ", sprintName='" + sprintName + '\'' +
                ", startDate=" + startDate +
                ", finishDate=" + finishDate +
                ", status='" + status + '\'' +
                '}';
    }
}