package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "TEAM", schema = "TODOUSER")
public class Team {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TEAM_ID")
    private Long teamId;
    
    @Column(name = "TEAM_NAME", nullable = false)
    private String teamName;
    
    @ManyToOne
    @JoinColumn(name = "MANAGER_ID")
    private User manager;
    
    @ManyToOne
    @JoinColumn(name = "PROJECT_ID", nullable = false)
    private Project project;
    
    @Column(name = "CREATION_DATE", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp creationDate;

    // Getters and Setters
    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }
    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }
    public User getManager() { return manager; }
    public void setManager(User manager) { this.manager = manager; }
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    public Timestamp getCreationDate() { return creationDate; }
    public void setCreationDate(Timestamp creationDate) { this.creationDate = creationDate; }
}