package com.mycompany.ems.task.controller;

import com.mycompany.ems.task.entity.TaskLabel;
import com.mycompany.ems.task.entity.TaskLabelRelation;
import com.mycompany.ems.task.service.LabelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labels")
@RequiredArgsConstructor
@Tag(name = "Label Management", description = "API pour la gestion des étiquettes")
public class LabelController {
    
    private final LabelService labelService;

    @GetMapping("/board/{boardId}")
    @Operation(summary = "Obtenir les étiquettes du board")
    public ResponseEntity<List<TaskLabel>> getLabelsByBoard(
            @Parameter(description = "ID du board") @PathVariable Long boardId) {
        return ResponseEntity.ok(labelService.getLabelsByBoard(boardId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir l'étiquette par ID")
    public ResponseEntity<TaskLabel> getLabelById(
            @Parameter(description = "ID de l'étiquette") @PathVariable Long id) {
        return labelService.getLabelById(id)
                .map(label -> ResponseEntity.ok(label))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Créer une nouvelle étiquette")
    public ResponseEntity<TaskLabel> createLabel(@Valid @RequestBody TaskLabel label) {
        TaskLabel createdLabel = labelService.createLabel(label);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLabel);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour l'étiquette")
    public ResponseEntity<TaskLabel> updateLabel(
            @Parameter(description = "ID de l'étiquette") @PathVariable Long id,
            @Valid @RequestBody TaskLabel labelDetails) {
        try {
            TaskLabel updatedLabel = labelService.updateLabel(id, labelDetails);
            return ResponseEntity.ok(updatedLabel);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer l'étiquette")
    public ResponseEntity<Void> deleteLabel(
            @Parameter(description = "ID de l'étiquette") @PathVariable Long id) {
        labelService.deleteLabel(id);
        return ResponseEntity.noContent().build();
    }

    // Task-Label relationship endpoints
    @GetMapping("/task/{taskId}")
    @Operation(summary = "Obtenir les étiquettes de la tâche")
    public ResponseEntity<List<TaskLabelRelation>> getTaskLabels(
            @Parameter(description = "ID de la tâche") @PathVariable Long taskId) {
        return ResponseEntity.ok(labelService.getTaskLabels(taskId));
    }

    @PostMapping("/task/{taskId}/label/{labelId}")
    @Operation(summary = "Ajouter une étiquette à la tâche")
    public ResponseEntity<TaskLabelRelation> addLabelToTask(
            @Parameter(description = "ID de la tâche") @PathVariable Long taskId,
            @Parameter(description = "ID de l'étiquette") @PathVariable Long labelId) {
        TaskLabelRelation relation = labelService.addLabelToTask(taskId, labelId);
        return ResponseEntity.status(HttpStatus.CREATED).body(relation);
    }

    @DeleteMapping("/task/{taskId}/label/{labelId}")
    @Operation(summary = "Supprimer l'étiquette de la tâche")
    public ResponseEntity<Void> removeLabelFromTask(
            @Parameter(description = "ID de la tâche") @PathVariable Long taskId,
            @Parameter(description = "ID de l'étiquette") @PathVariable Long labelId) {
        labelService.removeLabelFromTask(taskId, labelId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{labelId}/usage")
    @Operation(summary = "Obtenir le nombre d'utilisations de l'étiquette")
    public ResponseEntity<Long> getLabelUsageCount(
            @Parameter(description = "ID de l'étiquette") @PathVariable Long labelId) {
        return ResponseEntity.ok(labelService.getLabelUsageCount(labelId));
    }
}