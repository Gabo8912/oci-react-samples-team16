/* package com.springboot.MyToDoList.controller;

import com.springboot.MyTodoList.controller.ToDoItemController;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.service.ToDoItemService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
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

    private ToDoItem createTestItem(int id, String description) {
        return new ToDoItem("Task", OffsetDateTime.now(), true, 2L, 1L, 1.1);

    }

    @Test
    public void getAllToDoItems_ShouldReturnAllItems() {
        ToDoItem item1 = createTestItem(1, "Task 1");
        ToDoItem item2 = createTestItem(2, "Task 2");
        List<ToDoItem> expectedItems = Arrays.asList(item1, item2);

        when(toDoItemService.findAll()).thenReturn(expectedItems);

        List<ToDoItem> result = toDoItemController.getAllToDoItems();

        assertEquals(expectedItems, result);
        verify(toDoItemService, times(1)).findAll();
    }

    @Test
    public void getToDoItemById_ShouldReturnItemIfExists() {
        int itemId = 1;
        ToDoItem expectedItem = createTestItem(itemId, "Task 1");
        when(toDoItemService.getItemById(itemId)).thenReturn(ResponseEntity.ok(expectedItem));

        ResponseEntity<ToDoItem> response = toDoItemController.getToDoItemById(itemId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedItem, response.getBody());
        verify(toDoItemService, times(1)).getItemById(itemId);
    }

    @Test
    public void getToDoItemById_ShouldReturnNotFoundIfNotExists() {
        int itemId = 999;
        when(toDoItemService.getItemById(itemId)).thenReturn(ResponseEntity.notFound().build());

        ResponseEntity<ToDoItem> response = toDoItemController.getToDoItemById(itemId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(toDoItemService, times(1)).getItemById(itemId);
    }

    @Test
    public void addToDoItem_ShouldReturnOkWithLocationHeader() {
        ToDoItem newItem = createTestItem(0, "New Task");
        ToDoItem createdItem = createTestItem(1, "New Task");

        when(toDoItemService.addToDoItem(newItem)).thenReturn(createdItem);

        ResponseEntity response = toDoItemController.addToDoItem(newItem);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        HttpHeaders headers = response.getHeaders();
        assertEquals("0", headers.getFirst("location"));
        assertEquals("location", headers.getFirst("Access-Control-Expose-Headers"));

        verify(toDoItemService, times(1)).addToDoItem(newItem);
    }

    @Test
    public void updateToDoItem_ShouldReturnUpdatedItemIfExists() {
        int itemId = 1;
        ToDoItem updatedItem = createTestItem(itemId, "Updated Task");

        when(toDoItemService.updateToDoItem(itemId, updatedItem)).thenReturn(updatedItem);

        ResponseEntity<ToDoItem> response = toDoItemController.updateToDoItem(updatedItem, itemId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedItem, response.getBody());
        verify(toDoItemService, times(1)).updateToDoItem(itemId, updatedItem);
    }

    @Test
    public void updateToDoItem_ShouldReturnNotFoundIfItemDoesNotExist() {
        int itemId = 999;
        ToDoItem updatedItem = createTestItem(itemId, "Doesn't Exist");

        when(toDoItemService.updateToDoItem(itemId, updatedItem)).thenReturn(null);

        ResponseEntity<ToDoItem> response = toDoItemController.updateToDoItem(updatedItem, itemId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(toDoItemService, times(1)).updateToDoItem(itemId, updatedItem);
    }

    @Test
    public void deleteToDoItem_ShouldReturnTrueIfDeleted() {
        int itemId = 1;
        when(toDoItemService.deleteToDoItem(itemId)).thenReturn(true);

        ResponseEntity<Boolean> response = toDoItemController.deleteToDoItem(itemId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody());
        verify(toDoItemService, times(1)).deleteToDoItem(itemId);
    }

    @Test
    public void deleteToDoItem_ShouldReturnNotFoundIfItemDoesNotExist() {
        int itemId = 999;
        when(toDoItemService.deleteToDoItem(itemId)).thenReturn(false);

        ResponseEntity<Boolean> response = toDoItemController.deleteToDoItem(itemId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(toDoItemService, times(1)).deleteToDoItem(itemId);
    }

    @Test
    public void getTaskProgress_ShouldReturnProgress() {
        int itemId = 1;
        double expectedProgress = 75.0;

        when(toDoItemService.getTaskProgress(itemId)).thenReturn(expectedProgress);

        ResponseEntity<Double> response = toDoItemController.getTaskProgress(itemId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedProgress, response.getBody());
        verify(toDoItemService, times(1)).getTaskProgress(itemId);
    }
}
 */