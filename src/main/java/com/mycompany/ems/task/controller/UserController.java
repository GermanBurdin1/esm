package com.mycompany.ems.task.controller;

import com.mycompany.ems.task.entity.User;
import com.mycompany.ems.task.service.UserService;
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
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "API pour la gestion des utilisateurs")
public class UserController {
    
    private final UserService userService;

    @GetMapping
    @Operation(summary = "Obtenir tous les utilisateurs")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir l'utilisateur par ID")
    public ResponseEntity<User> getUserById(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    @Operation(summary = "Obtenir l'utilisateur par nom")
    public ResponseEntity<User> getUserByUsername(
            @Parameter(description = "Nom d'utilisateur") @PathVariable String username) {
        return userService.getUserByUsername(username)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Créer un nouvel utilisateur")
    public ResponseEntity<?> createUser(@Valid @RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            // Don't return password in response
            createdUser.setPasswordHash(null);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour l'utilisateur")
    public ResponseEntity<User> updateUser(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long id,
            @Valid @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            // Don't return password in response
            updatedUser.setPasswordHash(null);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer l'utilisateur")
    public ResponseEntity<Void> deleteUser(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/validate")
    @Operation(summary = "Vérifier les identifiants de l'utilisateur")
    public ResponseEntity<Map<String, Boolean>> validateCredentials(
            @RequestBody Map<String, String> credentials) {
        String usernameOrEmail = credentials.get("usernameOrEmail");
        String password = credentials.get("password");
        
        boolean isValid = userService.validateCredentials(usernameOrEmail, password);
        return ResponseEntity.ok(Map.of("valid", isValid));
    }
}