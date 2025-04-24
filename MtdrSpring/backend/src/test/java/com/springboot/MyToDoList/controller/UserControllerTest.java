package com.springboot.MyToDoList.controller;
//Dumb edit
import com.springboot.MyTodoList.controller.UserController;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.service.UserService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private User createTestUser(int id, String username, String email) {
        User user = new User();
        user.setId(id);
        user.setUsername(username);
        user.setPassword("password123");
        user.setEmail(email);
        user.setRole("USER");
        return user;
    }

    @Test
    public void getAllUsers_ShouldReturnAllUsers() {
        // Arrange
        List<User> users = Arrays.asList(
            createTestUser(1, "alice", "alice@example.com"),
            createTestUser(2, "bob", "bob@example.com")
        );

        when(userService.getAllUsers()).thenReturn(users);

        // Act
        ResponseEntity<List<User>> response = userController.getAllUsers();

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(users, response.getBody());
        verify(userService, times(1)).getAllUsers();
    }

    @Test
    public void login_ShouldReturnUserWhenCredentialsValid() {
        // Arrange
        User loginRequest = new User();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");

        User authenticatedUser = createTestUser(1, "testuser", "test@example.com");

        when(userService.authenticate("testuser", "password123"))
            .thenReturn(Optional.of(authenticatedUser));

        // Act
        ResponseEntity<User> response = userController.login(loginRequest);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(authenticatedUser, response.getBody());
        verify(userService, times(1)).authenticate("testuser", "password123");
    }

    @Test
    public void login_ShouldReturnUnauthorizedWhenInvalidCredentials() {
        // Arrange
        User loginRequest = new User();
        loginRequest.setUsername("wronguser");
        loginRequest.setPassword("wrongpass");

        when(userService.authenticate("wronguser", "wrongpass"))
            .thenReturn(Optional.empty());

        // Act
        ResponseEntity<User> response = userController.login(loginRequest);

        // Assert
        assertEquals(401, response.getStatusCodeValue());
        assertNull(response.getBody());
        verify(userService, times(1)).authenticate("wronguser", "wrongpass");
    }

    @Test
    public void getUserByUsername_ShouldReturnUserWhenExists() {
        // Arrange
        String username = "alice";
        User user = createTestUser(1, username, "alice@example.com");
        when(userService.findByUsername(username)).thenReturn(Optional.of(user));

        // Act
        ResponseEntity<User> response = userController.getUserByUsername(username);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(user, response.getBody());
        verify(userService, times(1)).findByUsername(username);
    }

    @Test
    public void getUserByUsername_ShouldReturnNotFoundWhenUserDoesNotExist() {
        // Arrange
        String username = "nonexistent";
        when(userService.findByUsername(username)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<User> response = userController.getUserByUsername(username);

        // Assert
        assertEquals(404, response.getStatusCodeValue());
        assertNull(response.getBody());
        verify(userService, times(1)).findByUsername(username);
    }
}
