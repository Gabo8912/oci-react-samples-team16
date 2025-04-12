package com.springboot.MyToDoList.controller;
//Dumb comment
import com.springboot.MyTodoList.controller.SprintController;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.service.SprintService;
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
public class SprintControllerTest {

    @Mock
    private SprintService sprintService;

    @InjectMocks
    private SprintController sprintController;

    private Sprint createTestSprint(int id, String name) {
        OffsetDateTime now = OffsetDateTime.now();
        return new Sprint(id, 1, name, 
                        now, now.plusDays(14), 
                        "ACTIVE");
    }

    @Test
    public void getAllSprints_ShouldReturnAllSprints() {
        // Arrange
        Sprint sprint1 = createTestSprint(1, "Sprint 1");
        Sprint sprint2 = createTestSprint(2, "Sprint 2");
        List<Sprint> expectedSprints = Arrays.asList(sprint1, sprint2);
        
        when(sprintService.findAll()).thenReturn(expectedSprints);

        // Act
        ResponseEntity<List<Sprint>> response = sprintController.getAllSprints();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedSprints, response.getBody());
        verify(sprintService, times(1)).findAll();
    }

    @Test
    public void getSprintById_ShouldReturnSprintWhenExists() {
        // Arrange
        int sprintId = 1;
        Sprint expectedSprint = createTestSprint(sprintId, "Sprint 1");
        when(sprintService.getSprintById(sprintId)).thenReturn(expectedSprint);

        // Act
        ResponseEntity<Sprint> response = sprintController.getSprintById(sprintId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedSprint, response.getBody());
        verify(sprintService, times(1)).getSprintById(sprintId);
    }

    @Test
    public void getSprintById_ShouldReturnNotFoundWhenSprintDoesNotExist() {
        // Arrange
        int nonExistentId = 999;
        when(sprintService.getSprintById(nonExistentId)).thenReturn(null);

        // Act
        ResponseEntity<Sprint> response = sprintController.getSprintById(nonExistentId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(sprintService, times(1)).getSprintById(nonExistentId);
    }

    @Test
    public void addSprint_ShouldCreateNewSprintAndReturnLocationHeader() {
        // Arrange
        Sprint newSprint = createTestSprint(0, "New Sprint");
        Sprint createdSprint = createTestSprint(1, "New Sprint");
        
        when(sprintService.addSprint(newSprint)).thenReturn(createdSprint);

        // Act
        ResponseEntity<Sprint> response = sprintController.addSprint(newSprint);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(createdSprint, response.getBody());
        
        HttpHeaders headers = response.getHeaders();
        assertNotNull(headers);
        assertEquals("/api/sprints/1", headers.getFirst("location"));
        assertEquals("location", headers.getFirst("Access-Control-Expose-Headers"));
        
        verify(sprintService, times(1)).addSprint(newSprint);
    }

    @Test
    public void updateSprint_ShouldUpdateExistingSprint() {
        // Arrange
        int sprintId = 1;
        Sprint updatedSprint = createTestSprint(sprintId, "Updated Sprint");
        when(sprintService.updateSprint(sprintId, updatedSprint)).thenReturn(updatedSprint);

        // Act
        ResponseEntity<Sprint> response = sprintController.updateSprint(sprintId, updatedSprint);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedSprint, response.getBody());
        verify(sprintService, times(1)).updateSprint(sprintId, updatedSprint);
    }

    @Test
    public void updateSprint_ShouldReturnNotFoundWhenSprintDoesNotExist() {
        // Arrange
        int nonExistentId = 999;
        Sprint sprintToUpdate = createTestSprint(nonExistentId, "Non-existent Sprint");
        when(sprintService.updateSprint(nonExistentId, sprintToUpdate)).thenReturn(null);

        // Act
        ResponseEntity<Sprint> response = sprintController.updateSprint(nonExistentId, sprintToUpdate);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(sprintService, times(1)).updateSprint(nonExistentId, sprintToUpdate);
    }

    @Test
    public void deleteSprint_ShouldReturnNoContentWhenSprintExists() {
        // Arrange
        int sprintId = 1;
        when(sprintService.deleteSprint(sprintId)).thenReturn(true);

        // Act
        ResponseEntity<Void> response = sprintController.deleteSprint(sprintId);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(sprintService, times(1)).deleteSprint(sprintId);
    }

    @Test
    public void deleteSprint_ShouldReturnNotFoundWhenSprintDoesNotExist() {
        // Arrange
        int nonExistentId = 999;
        when(sprintService.deleteSprint(nonExistentId)).thenReturn(false);

        // Act
        ResponseEntity<Void> response = sprintController.deleteSprint(nonExistentId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(sprintService, times(1)).deleteSprint(nonExistentId);
    }
}