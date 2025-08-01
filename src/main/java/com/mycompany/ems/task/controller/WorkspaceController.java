package com.mycompany.ems.task.controller;

import com.mycompany.ems.task.entity.Workspace;
import com.mycompany.ems.task.service.WorkspaceService;
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
@RequestMapping("/api/workspaces")
@RequiredArgsConstructor
@Tag(name = "Workspace Management", description = "API pour la gestion des espaces de travail")
public class WorkspaceController {
    
    private final WorkspaceService workspaceService;

    @GetMapping
    @Operation(summary = "Obtenir tous les espaces de travail")
    public ResponseEntity<List<Workspace>> getAllWorkspaces() {
        return ResponseEntity.ok(workspaceService.getAllWorkspaces());
    }

    @GetMapping("/owner/{ownerId}")
    @Operation(summary = "Obtenir les espaces de travail de l'utilisateur")
    public ResponseEntity<List<Workspace>> getWorkspacesByOwner(
            @Parameter(description = "ID du propriétaire") @PathVariable Long ownerId) {
        return ResponseEntity.ok(workspaceService.getWorkspacesByOwner(ownerId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir l'espace de travail par ID")
    public ResponseEntity<Workspace> getWorkspaceById(
            @Parameter(description = "ID de l'espace de travail") @PathVariable Long id) {
        return workspaceService.getWorkspaceById(id)
                .map(workspace -> ResponseEntity.ok(workspace))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Créer un nouvel espace de travail")
    public ResponseEntity<Workspace> createWorkspace(@Valid @RequestBody Workspace workspace) {
        Workspace createdWorkspace = workspaceService.createWorkspace(workspace);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdWorkspace);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour l'espace de travail")
    public ResponseEntity<Workspace> updateWorkspace(
            @Parameter(description = "ID de l'espace de travail") @PathVariable Long id,
            @Valid @RequestBody Workspace workspaceDetails) {
        try {
            Workspace updatedWorkspace = workspaceService.updateWorkspace(id, workspaceDetails);
            return ResponseEntity.ok(updatedWorkspace);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer l'espace de travail")
    public ResponseEntity<Void> deleteWorkspace(
            @Parameter(description = "ID de l'espace de travail") @PathVariable Long id) {
        workspaceService.deleteWorkspace(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Recherche des espaces de travail par nom")
    public ResponseEntity<List<Workspace>> searchWorkspaces(
            @Parameter(description = "Requête de recherche") @RequestParam String q) {
        return ResponseEntity.ok(workspaceService.searchWorkspaces(q));
    }
}