package com.springboot.MyTodoList.model;

public class ErrorResponse {
    private String message;
    private String details;

    // Constructor with both message and details
    public ErrorResponse(String message, String details) {
        this.message = message;
        this.details = details;
    }

    // Constructor with just message (if needed)
    public ErrorResponse(String message) {
        this.message = message;
        this.details = null;
    }

    // Getters and setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}