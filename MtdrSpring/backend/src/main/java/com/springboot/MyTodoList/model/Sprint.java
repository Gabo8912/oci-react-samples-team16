package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "SPRINTS")
public class Sprint {
    @Id
    @Column(name = "SPRINT_ID")
    private Integer sprintId;
    
    @Column(name = "PROJECT_ID")
    private Integer projectId; // Changed to Integer for consistency
    
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

    public Sprint(Integer sprintId, Integer projectId, String sprintName, 
                OffsetDateTime startDate, OffsetDateTime finishDate, 
                String status) {
        this.sprintId = sprintId;
        this.projectId = projectId;
        this.sprintName = sprintName;
        this.startDate = startDate;
        this.finishDate = finishDate;
        this.status = status;
    }

    // Getters and Setters
    public Integer getSprintId() {
        return sprintId;
    }

    public void setSprintId(Integer sprintId) {
        this.sprintId = sprintId;
    }

    public Integer getProjectId() {
        return projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
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

    @Override
    public String toString() {
        return "Sprint{" +
                "sprintId=" + sprintId +
                ", projectId=" + projectId +
                ", sprintName='" + sprintName + '\'' +
                ", startDate=" + startDate +
                ", finishDate=" + finishDate +
                ", status='" + status + '\'' +
                '}';
    }
}