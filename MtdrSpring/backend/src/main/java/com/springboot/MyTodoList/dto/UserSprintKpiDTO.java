package com.springboot.MyTodoList.dto;

public class UserSprintKpiDTO {
    private Long sprintId;
    private Long completedTasks;

    public UserSprintKpiDTO(Long sprintId, Long completedTasks) {
        this.sprintId = sprintId;
        this.completedTasks = completedTasks;
    }

    public Long getSprintId() {
        return sprintId;
    }

    public void setSprintId(Long sprintId) {
        this.sprintId = sprintId;
    }

    public Long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(Long completedTasks) {
        this.completedTasks = completedTasks;
    }
}
