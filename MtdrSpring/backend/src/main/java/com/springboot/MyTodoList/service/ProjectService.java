package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public ResponseEntity<Project> getProjectById(Long id) {
        if (id <= 0) {
            return ResponseEntity.badRequest().build();
        }
        return projectRepository.findById(id)
                .map(project -> ResponseEntity.ok(project))
                .orElse(ResponseEntity.notFound().build());
    }
    
    public Project addProject(Project project) {
        if (project == null) {
            throw new IllegalArgumentException("Project cannot be null");
        }
        if (project.getProjectName() == null || project.getProjectName().trim().isEmpty()) {
            throw new IllegalArgumentException("Project name cannot be empty");
        }
        return projectRepository.save(project);
    }

    public boolean deleteProject(Long id) {
        if (id <= 0) {
            return false;
        }
        if (!projectRepository.existsById(id)) {
            return false;
        }
        projectRepository.deleteById(id);
        return true;
    }

    public Project updateProject(Long id, Project project) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID must be positive");
        }
        if (project == null) {
            throw new IllegalArgumentException("Project cannot be null");
        }
        return projectRepository.findById(id)
                .map(existingProject -> {
                    existingProject.setProjectName(project.getProjectName());
                    existingProject.setDescription(project.getDescription());
                    existingProject.setStatus(project.getStatus());
                    existingProject.setStartDate(project.getStartDate());
                    existingProject.setEstimatedTime(project.getEstimatedTime());
                    existingProject.setFinishDate(project.getFinishDate());
                    return projectRepository.save(existingProject);
                })
                .orElse(null);
    }
}