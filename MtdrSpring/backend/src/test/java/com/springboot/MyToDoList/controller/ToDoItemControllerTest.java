/* 
package com.springboot.MyToDoList.controller;

import com.springboot.MyTodoList.controller.ToDoItemController;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.service.ToDoItemService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.time.OffsetDateTime;
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

    private ToDoItem createTestItem(int id, String description, OffsetDateTime timestamp, boolean done) {
        ToDoItem item = new ToDoItem();
        item.setId(id);
        item.setDescription(description);
        item.setCreationTs(timestamp);
        item.setDone(done);
        return item;
    }

    @Test
    public void getAllToDoItems_ShouldReturnAllItems() {
        // Arrange
        OffsetDateTime now = OffsetDateTime.now();
        ToDoItem item1 = createTestItem(1, "Task 1", now, false);
        ToDoItem item2 = createTestItem(2, "Task 2", now, true);
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
    public void getToDoItemById_ShouldReturnItemWhenExists() {
        // Arrange
        int itemId = 1;
        OffsetDateTime now = OffsetDateTime.now();
        ToDoItem expectedItem = createTestItem(itemId, "Task 1", now, false);
        when(toDoItemService.getItemById(itemId))
            .thenReturn(ResponseEntity.ok(expectedItem));

        // Act
        ResponseEntity<ToDoItem> response = toDoItemController.getToDoItemById(itemId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedItem, response.getBody());
        verify(toDoItemService, times(1)).getItemById(itemId);
    }

    @Test
    public void getToDoItemById_ShouldReturnNotFoundWhenItemDoesNotExist() {
        // Arrange
        int nonExistentId = 999;
        when(toDoItemService.getItemById(nonExistentId))
            .thenReturn(new ResponseEntity<>(HttpStatus.NOT_FOUND));

        // Act
        ResponseEntity<ToDoItem> response = toDoItemController.getToDoItemById(nonExistentId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(toDoItemService, times(1)).getItemById(nonExistentId);
    }

    @Test
    public void addToDoItem_ShouldCreateNewItemAndReturnLocationHeader() throws Exception {
        // Arrange
        OffsetDateTime now = OffsetDateTime.now();
        ToDoItem newItem = createTestItem(0, "New Task", now, false);
        ToDoItem savedItem = createTestItem(1, "New Task", now, false);
        
        when(toDoItemService.addToDoItem(newItem)).thenReturn(savedItem);

        // Act
        ResponseEntity<?> response = toDoItemController.addToDoItem(newItem);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getHeaders().containsKey("location"));
        assertEquals("1", response.getHeaders().getFirst("location"));
        verify(toDoItemService, times(1)).addToDoItem(newItem);
    }

    @Test
    public void updateToDoItem_ShouldUpdateExistingItem() {
        // Arrange
        int itemId = 1;
        OffsetDateTime now = OffsetDateTime.now();
        ToDoItem updatedItem = createTestItem(itemId, "Updated Task", now, true);
        when(toDoItemService.updateToDoItem(itemId, updatedItem)).thenReturn(updatedItem);

        // Act
        ResponseEntity<?> response = toDoItemController.updateToDoItem(updatedItem, itemId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedItem, response.getBody());
        verify(toDoItemService, times(1)).updateToDoItem(itemId, updatedItem);
    }

    @Test
    public void updateToDoItem_ShouldReturnNotFoundWhenItemDoesNotExist() {
        // Arrange
        int nonExistentId = 999;
        OffsetDateTime now = OffsetDateTime.now();
        ToDoItem item = createTestItem(nonExistentId, "Non-existent Task", now, false);
        when(toDoItemService.updateToDoItem(nonExistentId, item))
            .thenThrow(new RuntimeException("Item not found"));

        // Act
        ResponseEntity<?> response = toDoItemController.updateToDoItem(item, nonExistentId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(toDoItemService, times(1)).updateToDoItem(nonExistentId, item);
    }

    @Test
    public void deleteToDoItem_ShouldReturnTrueWhenItemExists() {
        // Arrange
        int itemId = 1;
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
        int nonExistentId = 999;
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
        int itemId = 1;
        double expectedProgress = 75.0;
        when(toDoItemService.getTaskProgress(itemId)).thenReturn(expectedProgress);

        // Act
        ResponseEntity<Double> response = toDoItemController.getTaskProgress(itemId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedProgress, response.getBody());
        verify(toDoItemService, times(1)).getTaskProgress(itemId);
    }
}*/