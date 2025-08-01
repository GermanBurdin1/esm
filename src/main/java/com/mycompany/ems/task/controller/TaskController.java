package com.mycompany.ems.task.controller;

import com.mycompany.ems.task.entity.TaskEntity;
import com.mycompany.ems.task.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Task Management", description = "API pour la gestion des tâches")
public class TaskController {
    
    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Obtenir toutes les tâches")
    public ResponseEntity<List<TaskEntity>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/column/{columnId}")
    @Operation(summary = "Obtenir les tâches par colonne")
    public ResponseEntity<List<TaskEntity>> getTasksByColumn(
            @Parameter(description = "ID de la colonne") @PathVariable Long columnId) {
        return ResponseEntity.ok(taskService.getTasksByColumnId(columnId));
    }

    @GetMapping("/assignee/{assigneeId}")
    @Operation(summary = "Obtenir les tâches par assigné")
    public ResponseEntity<List<TaskEntity>> getTasksByAssignee(
            @Parameter(description = "ID de l'assigné") @PathVariable Long assigneeId) {
        return ResponseEntity.ok(taskService.getTasksByAssignee(assigneeId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir la tâche par ID")
    public ResponseEntity<TaskEntity> getTaskById(
            @Parameter(description = "ID de la tâche") @PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(task -> ResponseEntity.ok(task))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Créer une nouvelle tâche")
    public ResponseEntity<TaskEntity> createTask(@Valid @RequestBody TaskEntity task) {
        TaskEntity createdTask = taskService.createTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour la tâche")
    public ResponseEntity<TaskEntity> updateTask(
            @Parameter(description = "ID de la tâche") @PathVariable Long id,
            @Valid @RequestBody TaskEntity taskDetails) {
        try {
            TaskEntity updatedTask = taskService.updateTask(id, taskDetails);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/move")
    @Operation(summary = "Déplacer la tâche (drag & drop)")
    public ResponseEntity<TaskEntity> moveTask(
            @Parameter(description = "ID de la tâche") @PathVariable Long id,
            @RequestBody Map<String, Object> moveRequest) {
        
        Long newColumnId = Long.valueOf(moveRequest.get("columnId").toString());
        Integer newPosition = Integer.valueOf(moveRequest.get("position").toString());
        
        try {
            TaskEntity movedTask = taskService.moveTask(id, newColumnId, newPosition);
            return ResponseEntity.ok(movedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer la tâche")
    public ResponseEntity<Void> deleteTask(
            @Parameter(description = "ID de la tâche") @PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Recherche des tâches par nom")
    public ResponseEntity<List<TaskEntity>> searchTasks(
            @Parameter(description = "Requête de recherche") @RequestParam String q) {
        return ResponseEntity.ok(taskService.searchTasks(q));
    }
}