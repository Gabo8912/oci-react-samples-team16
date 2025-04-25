package com.springboot.MyTodoList.model;

public class ClickCaptcha {
    // Fixed coordinates for the checkbox (top-left corner)
    private static final int CHECKBOX_X = 10;
    private static final int CHECKBOX_Y = 10;
    private static final int CHECKBOX_SIZE = 20;

    public static int getCheckboxX() { return CHECKBOX_X; }
    public static int getCheckboxY() { return CHECKBOX_Y; }
    public static int getCheckboxSize() { return CHECKBOX_SIZE; }
} 