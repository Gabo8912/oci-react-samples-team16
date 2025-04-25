/* package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "TEAM")
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TEAM_ID")
    private Integer teamId;

    @Column(name = "TEAM_NAME", nullable = false)
    private String teamName;

    @ManyToOne
    @JoinColumn(name = "MANAGER_ID", nullable = false)
    private User manager;

    @ManyToOne
    @JoinColumn(name = "PROJECT_ID", nullable = false)
    private Project project;

    @Column(name = "CREATION_DATE", columnDefinition = "TIMESTAMP")
    private OffsetDateTime creationDate;

    // Constructors
    public Team() {}

    public Team(Integer teamId, String teamName, User manager, Project project, OffsetDateTime creationDate) {
        this.teamId = teamId;
        this.teamName = teamName;
        this.manager = manager;
        this.project = project;
        this.creationDate = creationDate;
    }

    // Getters and Setters
    public Integer getTeamId() {
        return teamId;
    }

    public void setTeamId(Integer teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public User getManager() {
        return manager;
    }

    public void setManager(User manager) {
        this.manager = manager;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public OffsetDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(OffsetDateTime creationDate) {
        this.creationDate = creationDate;
    }

    @Override
    public String toString() {
        return "Team{" +
                "teamId=" + teamId +
                ", teamName='" + teamName + '\'' +
                ", manager=" + (manager != null ? manager.getId() : null) +
                ", project=" + (project != null ? project.getProjectId() : null) +
                ", creationDate=" + creationDate +
                '}';
    }
}*/