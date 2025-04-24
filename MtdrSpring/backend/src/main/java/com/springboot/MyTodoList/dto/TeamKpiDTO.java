package com.springboot.MyTodoList.dto;

public class TeamKpiDTO {
    private String teamName;
    private Long sprintId;
    private Long totalTasks;
    private Double totalHours;
    private Double totalCosto;

    public TeamKpiDTO(String teamName, Long sprintId, Long totalTasks, Double totalHours) {
        this.teamName = teamName;
        this.sprintId = sprintId;
        this.totalTasks = totalTasks;
        this.totalHours = totalHours;
        this.totalCosto = totalHours * 25; // Costo por hora
    }

    public String getTeamName() {
        return teamName;
    }

    public Long getSprintId() {
        return sprintId;
    }

    public Long getTotalTasks() {
        return totalTasks;
    }

    public Double getTotalHours() {
        return totalHours;
    }

    public Double getTotalCosto() {
        return totalCosto;
    }
}
