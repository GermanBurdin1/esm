package com.mycompany.ems.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@Tag(name = "Health Check", description = "Health check endpoints")
public class HealthController {

    @GetMapping("/health")
    @Operation(summary = "Check application health", description = "Returns application health status")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = Map.of(
            "status", "UP",
            "timestamp", LocalDateTime.now(),
            "application", "Enterprise Management System (EMS)",
            "version", "1.0.0",
            "modules", "auth, task, crm, hrm, analytics",
            "api_endpoints", Map.of(
                "users", "/api/users",
                "workspaces", "/api/workspaces", 
                "boards", "/api/boards",
                "tasks", "/api/tasks",
                "comments", "/api/comments",
                "labels", "/api/labels",
                "swagger", "/swagger-ui.html"
            )
        );
        return ResponseEntity.ok(response);
    }
}