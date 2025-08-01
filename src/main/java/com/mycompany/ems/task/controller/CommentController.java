package com.mycompany.ems.task.controller;

import com.mycompany.ems.task.entity.TaskComment;
import com.mycompany.ems.task.service.CommentService;
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
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@Tag(name = "Comment Management", description = "API pour la gestion des commentaires")
public class CommentController {
    
    private final CommentService commentService;

    @GetMapping("/task/{taskId}")
    @Operation(summary = "Obtenir les commentaires de la tâche")
    public ResponseEntity<List<TaskComment>> getCommentsByTask(
            @Parameter(description = "ID de la tâche") @PathVariable Long taskId) {
        return ResponseEntity.ok(commentService.getCommentsByTask(taskId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir le commentaire par ID")
    public ResponseEntity<TaskComment> getCommentById(
            @Parameter(description = "ID du commentaire") @PathVariable Long id) {
        return commentService.getCommentById(id)
                .map(comment -> ResponseEntity.ok(comment))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Créer un nouveau commentaire")
    public ResponseEntity<TaskComment> createComment(@Valid @RequestBody TaskComment comment) {
        TaskComment createdComment = commentService.createComment(comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour le commentaire")
    public ResponseEntity<TaskComment> updateComment(
            @Parameter(description = "ID du commentaire") @PathVariable Long id,
            @Valid @RequestBody TaskComment commentDetails) {
        try {
            TaskComment updatedComment = commentService.updateComment(id, commentDetails);
            return ResponseEntity.ok(updatedComment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer le commentaire")
    public ResponseEntity<Void> deleteComment(
            @Parameter(description = "ID du commentaire") @PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/task/{taskId}/count")
    @Operation(summary = "Obtenir le nombre de commentaires de la tâche")
    public ResponseEntity<Long> getCommentCount(
            @Parameter(description = "ID de la tâche") @PathVariable Long taskId) {
        return ResponseEntity.ok(commentService.getCommentCount(taskId));
    }
}