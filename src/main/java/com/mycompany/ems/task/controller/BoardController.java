package com.mycompany.ems.task.controller;

import com.mycompany.ems.task.entity.Board;
import com.mycompany.ems.task.entity.BoardColumn;
import com.mycompany.ems.task.service.BoardService;
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
@RequestMapping("/api/boards")
@RequiredArgsConstructor
@Tag(name = "Board Management", description = "API pour la gestion des boards")
public class BoardController {
    
    private final BoardService boardService;

    @GetMapping
    @Operation(summary = "Obtenir tous les boards")
    public ResponseEntity<List<Board>> getAllBoards() {
        return ResponseEntity.ok(boardService.getAllBoards());
    }

    @GetMapping("/workspace/{workspaceId}")
    @Operation(summary = "Obtenir les boards par workspace")
    public ResponseEntity<List<Board>> getBoardsByWorkspace(
            @Parameter(description = "ID du workspace") @PathVariable Long workspaceId) {
        return ResponseEntity.ok(boardService.getBoardsByWorkspace(workspaceId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir le board par ID")
    public ResponseEntity<Board> getBoardById(
            @Parameter(description = "ID") @PathVariable Long id) {
        return boardService.getBoardById(id)
                .map(board -> ResponseEntity.ok(board))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Créer un nouveau board")
    public ResponseEntity<Board> createBoard(@Valid @RequestBody Board board) {
        Board createdBoard = boardService.createBoard(board);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBoard);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour le board")
    public ResponseEntity<Board> updateBoard(
            @Parameter(description = "ID") @PathVariable Long id,
            @Valid @RequestBody Board boardDetails) {
        try {
            Board updatedBoard = boardService.updateBoard(id, boardDetails);
            return ResponseEntity.ok(updatedBoard);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer le board")
    public ResponseEntity<Void> deleteBoard(
            @Parameter(description = "ID") @PathVariable Long id) {
        boardService.deleteBoard(id);
        return ResponseEntity.noContent().build();
    }

    // Column management endpoints
    @GetMapping("/{boardId}/columns")
    @Operation(summary = "Obtenir les colonnes du board")
    public ResponseEntity<List<BoardColumn>> getColumnsByBoard(
            @Parameter(description = "ID du board") @PathVariable Long boardId) {
        return ResponseEntity.ok(boardService.getColumnsByBoard(boardId));
    }

    @PostMapping("/{boardId}/columns")
    @Operation(summary = "Créer une nouvelle colonne")
    public ResponseEntity<BoardColumn> createColumn(
            @Parameter(description = "ID du board") @PathVariable Long boardId,
            @Valid @RequestBody BoardColumn column) {
        column.setBoardId(boardId);
        BoardColumn createdColumn = boardService.createColumn(column);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdColumn);
    }

    @PutMapping("/columns/{id}")
    @Operation(summary = "Mettre à jour la colonne")
    public ResponseEntity<BoardColumn> updateColumn(
            @Parameter(description = "ID de la colonne") @PathVariable Long id,
            @Valid @RequestBody BoardColumn columnDetails) {
        try {
            BoardColumn updatedColumn = boardService.updateColumn(id, columnDetails);
            return ResponseEntity.ok(updatedColumn);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/columns/{id}")
    @Operation(summary = "Supprimer la colonne")
    public ResponseEntity<Void> deleteColumn(
            @Parameter(description = "ID de la colonne") @PathVariable Long id) {
        boardService.deleteColumn(id);
        return ResponseEntity.noContent().build();
    }
}