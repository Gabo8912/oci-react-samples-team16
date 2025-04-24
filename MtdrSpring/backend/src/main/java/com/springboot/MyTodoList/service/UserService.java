package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Buscar por username
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Autenticación básica (NO segura para producción)
    public Optional<User> authenticate(String username, String password) {
        return userRepository.findByUsernameAndPassword(username, password);
    }

    // Obtener todos los usuarios
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
