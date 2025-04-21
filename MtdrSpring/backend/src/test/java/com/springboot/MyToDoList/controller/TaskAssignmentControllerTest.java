/* package com.springboot.MyToDoList.controller;


import com.springboot.MyTodoList.controller.TeamController;
import com.springboot.MyTodoList.model.Team;
import com.springboot.MyTodoList.service.TeamService;

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
public class TeamControllerTest {

    @Mock
    private TeamService teamService;

    @InjectMocks
    private TeamController teamController;

    private Team createTestTeam(Integer id, String name) {
        return new Team(id, name, "Test Description", OffsetDateTime.now());
    }

    @Test
    public void getAllTeams_ShouldReturnAllTeams() {
        Team team1 = createTestTeam(1, "Team 1");
        Team team2 = createTestTeam(2, "Team 2");
        List<Team> expectedTeams = Arrays.asList(team1, team2);

        when(teamService.findAll()).thenReturn(expectedTeams);

        ResponseEntity<List<Team>> response = teamController.getAllTeams(); // ✅ Correct

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedTeams, response.getBody());
        verify(teamService, times(1)).findAll();
    }

    @Test
    public void getTeamById_ShouldReturnTeamWhenExists() {
        Integer teamId = 1;
        Team expectedTeam = createTestTeam(teamId, "Dev Team");
        when(teamService.getTeamById(teamId)).thenReturn(expectedTeam);

        ResponseEntity<Team> response = teamController.getTeamById(teamId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedTeam, response.getBody());
        verify(teamService, times(1)).getTeamById(teamId);
    }

    @Test
    public void getTeamById_ShouldReturnNotFoundWhenTeamDoesNotExist() {
        Integer nonExistentId = 999;
        when(teamService.getTeamById(nonExistentId)).thenReturn(null);

        ResponseEntity<Team> response = teamController.getTeamById(nonExistentId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(teamService, times(1)).getTeamById(nonExistentId);
    }

    @Test
    public void addTeam_ShouldCreateNewTeamAndReturnLocationHeader() {
        Team newTeam = createTestTeam(null, "New Team");
        Team createdTeam = createTestTeam(1, "New Team");

        when(teamService.addTeam(newTeam)).thenReturn(createdTeam);

        ResponseEntity<Team> response = teamController.addTeam(newTeam);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(createdTeam, response.getBody());

        HttpHeaders headers = response.getHeaders();
        assertNotNull(headers);
        assertEquals("/api/teams/1", headers.getFirst("location"));
        assertEquals("location", headers.getFirst("Access-Control-Expose-Headers"));

        verify(teamService, times(1)).addTeam(newTeam);
    }

    @Test
    public void updateTeam_ShouldUpdateExistingTeam() {
        Integer teamId = 1;
        Team updatedTeam = createTestTeam(teamId, "Updated Team");
        when(teamService.updateTeam(teamId, updatedTeam)).thenReturn(updatedTeam);

        ResponseEntity<Team> response = teamController.updateTeam(teamId, updatedTeam);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedTeam, response.getBody());
        verify(teamService, times(1)).updateTeam(teamId, updatedTeam);
    }

    @Test
    public void updateTeam_ShouldReturnNotFoundWhenTeamDoesNotExist() {
        Integer nonExistentId = 999;
        Team teamToUpdate = createTestTeam(nonExistentId, "Non-existent Team");
        when(teamService.updateTeam(nonExistentId, teamToUpdate)).thenReturn(null);

        ResponseEntity<Team> response = teamController.updateTeam(nonExistentId, teamToUpdate);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(teamService, times(1)).updateTeam(nonExistentId, teamToUpdate);
    }

    @Test
    public void deleteTeam_ShouldReturnNoContentWhenTeamExists() {
        Integer teamId = 1;
        when(teamService.deleteTeam(teamId)).thenReturn(true);

        ResponseEntity<Void> response = teamController.deleteTeam(teamId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(teamService, times(1)).deleteTeam(teamId);
    }

    @Test
    public void deleteTeam_ShouldReturnNotFoundWhenTeamDoesNotExist() {
        Integer nonExistentId = 999;
        when(teamService.deleteTeam(nonExistentId)).thenReturn(false);

        ResponseEntity<Void> response = teamController.deleteTeam(nonExistentId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(teamService, times(1)).deleteTeam(nonExistentId);
    }
}
*/
package com.springboot.MyToDoList.controller;

import com.springboot.MyTodoList.controller.TaskAssignmentController;
import com.springboot.MyTodoList.model.TaskAssignment;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.service.TaskAssignmentService;
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
public class TaskAssignmentControllerTest {

    @Mock
    private TaskAssignmentService taskAssignmentService;

    @InjectMocks
    private TaskAssignmentController taskAssignmentController;

    private TaskAssignment createTestAssignment(Long id, ToDoItem task, User user) {
        TaskAssignment assignment = new TaskAssignment();
        assignment.setId(id);
        assignment.setTask(task);
        assignment.setUser(user);
        return assignment;
    }

    @Test
    public void getAssignmentsForUser_ShouldReturnAssignments() {
        // Arrange
        Long userId = 1L;
        ToDoItem task1 = new ToDoItem();
        task1.setId(1);
        User user1 = new User();
        //user1.setId(userId);
        
        List<TaskAssignment> expectedAssignments = Arrays.asList(
            createTestAssignment(1L, task1, user1)
        );
        
        when(taskAssignmentService.getAssignmentsForUser(userId)).thenReturn(expectedAssignments);

        // Act
        ResponseEntity<List<TaskAssignment>> response = taskAssignmentController.getAssignmentsForUser(userId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedAssignments, response.getBody());
        verify(taskAssignmentService, times(1)).getAssignmentsForUser(userId);
    }

    @Test
    public void getAssignmentsForTask_ShouldReturnAssignments() {
        // Arrange
        Long taskId = 1L;
        ToDoItem task = new ToDoItem();
        User user1 = new User();
        //user1.setId(1L);
        
        List<TaskAssignment> expectedAssignments = Arrays.asList(
            createTestAssignment(1L, task, user1)
        );
        
        when(taskAssignmentService.getAssignmentsForTask(taskId)).thenReturn(expectedAssignments);

        // Act
        ResponseEntity<List<TaskAssignment>> response = taskAssignmentController.getAssignmentsForTask(taskId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedAssignments, response.getBody());
        verify(taskAssignmentService, times(1)).getAssignmentsForTask(taskId);
    }

    @Test
    public void createAssignment_ShouldCreateNewAssignment() {
        // Arrange
        Long taskId = 1L;
        Long userId = 1L;
        TaskAssignment newAssignment = new TaskAssignment();
        newAssignment.setId(1L);
        
        when(taskAssignmentService.createAssignment(taskId, userId)).thenReturn(newAssignment);

        // Act
        ResponseEntity<TaskAssignment> response = taskAssignmentController.createAssignment(taskId, userId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(newAssignment, response.getBody());
        verify(taskAssignmentService, times(1)).createAssignment(taskId, userId);
    }

    @Test
    public void getAssignmentsForUser_ShouldReturnEmptyListWhenNoAssignments() {
        // Arrange
        Long userId = 999L;
        when(taskAssignmentService.getAssignmentsForUser(userId)).thenReturn(List.of());

        // Act
        ResponseEntity<List<TaskAssignment>> response = taskAssignmentController.getAssignmentsForUser(userId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
        verify(taskAssignmentService, times(1)).getAssignmentsForUser(userId);
    }

    @Test
    public void getAssignmentsForTask_ShouldReturnEmptyListWhenNoAssignments() {
        // Arrange
        Long taskId = 999L;
        when(taskAssignmentService.getAssignmentsForTask(taskId)).thenReturn(List.of());

        // Act
        ResponseEntity<List<TaskAssignment>> response = taskAssignmentController.getAssignmentsForTask(taskId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
        verify(taskAssignmentService, times(1)).getAssignmentsForTask(taskId);
    }
}