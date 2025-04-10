package com.springboot.MyTodoList.controller; // Fixed package name to match actual location

import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.service.ToDoItemService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ToDoItemControllerTest {

    @Mock
    private ToDoItemService toDoItemService;

    @InjectMocks
    private ToDoItemController toDoItemController;

    @Test
    public void getAllToDoItems_ShouldReturnAllItems() {
        // Arrange
        ToDoItem item1 = new ToDoItem();
        item1.setID(1L);
        item1.setDescription("Task 1");
        item1.setStatus(false);
        
        ToDoItem item2 = new ToDoItem();
        item2.setID(2L);
        item2.setDescription("Task 2");
        item2.setStatus(true);
        
        List<ToDoItem> expectedItems = Arrays.asList(item1, item2);
        
        when(toDoItemService.findAll()).thenReturn(expectedItems);

        // Act
        List<ToDoItem> actualItems = toDoItemController.getAllToDoItems();

        // Assert
        assertEquals(expectedItems.size(), actualItems.size());
        assertEquals(expectedItems, actualItems);
        verify(toDoItemService, times(1)).findAll();
    }

    @Test
    public void deleteToDoItem_ShouldReturnTrueWhenItemExists() {
        // Arrange
        Long itemId = 1L; // Changed to Long if your ID is Long type
        when(toDoItemService.deleteToDoItem(itemId)).thenReturn(true);

        // Act
        ResponseEntity<Boolean> response = toDoItemController.deleteToDoItem(itemId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody());
        verify(toDoItemService, times(1)).deleteToDoItem(itemId);
    }

    @Test
    public void deleteToDoItem_ShouldReturnFalseWhenItemDoesNotExist() {
        // Arrange
        Long nonExistentId = 999L; // Changed to Long if your ID is Long type
        when(toDoItemService.deleteToDoItem(nonExistentId)).thenReturn(false);

        // Act
        ResponseEntity<Boolean> response = toDoItemController.deleteToDoItem(nonExistentId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertFalse(response.getBody());
        verify(toDoItemService, times(1)).deleteToDoItem(nonExistentId);
    }

    @Test
    public void getTaskProgress_ShouldReturnProgress() {
        // Arrange
        Long itemId = 1L; // Changed to Long if your ID is Long type
        double expectedProgress = 0.75;
        when(toDoItemService.getTaskProgress(itemId)).thenReturn(expectedProgress);

        // Act
        ResponseEntity<Double> response = toDoItemController.getTaskProgress(itemId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedProgress, response.getBody());
        verify(toDoItemService, times(1)).getTaskProgress(itemId);
    }
}