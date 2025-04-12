/*
package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "TEAMS")
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TEAM_ID")
    private Integer teamId;
    
    @Column(name = "NAME")
    private String name;
    
    @Column(name = "DESCRIPTION")
    private String description;
    
    @Column(name = "CREATED_DATE")
    private OffsetDateTime createdDate;

    // Constructors
    public Team() {}

    public Team(Integer teamId, String name, String description, OffsetDateTime createdDate) {
        this.teamId = teamId;
        this.name = name;
        this.description = description;
        this.createdDate = createdDate;
    }

    // Getters and Setters
    public Integer getTeamId() {
        return teamId;
    }

    public void setTeamId(Integer teamId) {
        this.teamId = teamId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public OffsetDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(OffsetDateTime createdDate) {
        this.createdDate = createdDate;
    }

    @Override
    public String toString() {
        return "Team{" +
                "teamId=" + teamId +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", createdDate=" + createdDate +
                '}';
    }
}*/