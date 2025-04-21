package com.springboot.MyTodoList.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    
    @GetMapping("/")
    public String home() {
        return "forward:/index.html"; // Serves your React frontend
    }
}