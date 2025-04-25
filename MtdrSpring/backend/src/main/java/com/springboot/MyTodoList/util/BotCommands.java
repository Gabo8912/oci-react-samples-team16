package com.springboot.MyTodoList.util;

public enum BotCommands {

	START_COMMAND("/start"),
	LOGIN_COMMAND("/login"),
	HIDE_COMMAND("/hide"), 
	TODO_LIST("/todolist"),
	ADD_ITEM("/additem"),
	EXIT_COMMAND("/exit"),
    ADD_TASK("/addtask"),
    COMPLETED("/completed"),
    ADD_SUBTASK("/addsubtask");

	private String command;

	BotCommands(String enumCommand) {
		this.command = enumCommand;
	}

	public String getCommand() {
		return command;
	}
}
