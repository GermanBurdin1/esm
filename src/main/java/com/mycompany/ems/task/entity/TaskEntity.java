package com.mycompany.ems.task.entity;

import jakarta.persistence.*;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tasks", schema = "task")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Task title is required")
    @Size(min = 1, max = 200, message = "Task title must be between 1 and 200 characters")
    @Column(name = "title", nullable = false)
    private String title;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    @Column(name = "description")
    private String description;

    @Column(name = "column_id", nullable = false)
    private Long columnId;

    @Column(name = "assignee_id")
    private Long assigneeId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "position", nullable = false)
    private Integer position = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private Priority priority = Priority.MEDIUM;

    // Les liaisons (ici c'est les relations, lol)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "column_id", insertable = false, updatable = false)
    @JsonIgnore
    private BoardColumn column;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id", insertable = false, updatable = false)
    @JsonIgnore
    private User assignee;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<TaskComment> comments;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<TaskAttachment> attachments;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<TaskLabelRelation> labelRelations;

    public enum Priority {
        LOW, MEDIUM, HIGH
    }
}