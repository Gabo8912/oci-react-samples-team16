package com.springboot.MyTodoList.dto;

public class UserKpiDTO {
    private String username;
    private Long sprintId;
    private Long completedTasks;
    private Double totalHours;
    private Double costo; // ✅ nuevo campo

    public UserKpiDTO(String username, Long sprintId, Long completedTasks, Double totalHours) {
        this.username = username;
        this.sprintId = sprintId;
        this.completedTasks = completedTasks;
        this.totalHours = totalHours;
        this.costo = totalHours * 25; // ✅ cálculo automático
    }

    public String getUsername() {
        return username;
    }

    public Long getSprintId() {
        return sprintId;
    }

    public Long getCompletedTasks() {
        return completedTasks;
    }

    public Double getTotalHours() {
        return totalHours;
    }

    public Double getCosto() {
        return costo;
    }
}