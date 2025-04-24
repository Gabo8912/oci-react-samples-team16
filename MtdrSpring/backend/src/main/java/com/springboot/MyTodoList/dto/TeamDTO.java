package com.springboot.MyTodoList.dto;

import java.util.List;

public class TeamDTO {
    private Long id;
    private String name;
    private List<Long> userIds;

    public TeamDTO(Long id, String name, List<Long> userIds) {
        this.id = id;
        this.name = name;
        this.userIds = userIds;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public List<Long> getUserIds() { return userIds; }
}
