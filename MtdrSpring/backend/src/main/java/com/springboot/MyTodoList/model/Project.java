package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "PROJECTS")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PROJECT_ID")
    private Long projectId;
    
    @Column(name = "PROJECT_NAME")
    private String projectName;
    
    @Column(name = "DESCRIPTION")
    private String description;
    
    @Column(name = "STATUS")
    private String status;
    
    @Column(name = "START_DATE")
    private LocalDate startDate;
    
    @Column(name = "ESTIMATED_TIME")
    private Integer estimatedTime;
    
    @Column(name = "FINISH_DATE")
    private LocalDate finishDate;

    public Project() {
    }

    public Project(String projectName, String description, String status, 
                  LocalDate startDate, Integer estimatedTime, LocalDate finishDate) {
        this.projectName = projectName;
        this.description = description;
        this.status = status;
        this.startDate = startDate;
        this.estimatedTime = estimatedTime;
        this.finishDate = finishDate;
    }

    // Getters and Setters
    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public Integer getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(Integer estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public LocalDate getFinishDate() {
        return finishDate;
    }

    public void setFinishDate(LocalDate finishDate) {
        this.finishDate = finishDate;
    }

    @Override
    public String toString() {
        return "Project{" +
                "projectId=" + projectId +
                ", projectName='" + projectName + '\'' +
                ", description='" + description + '\'' +
                ", status='" + status + '\'' +
                ", startDate=" + startDate +
                ", estimatedTime=" + estimatedTime +
                ", finishDate=" + finishDate +
                '}';
    }
}