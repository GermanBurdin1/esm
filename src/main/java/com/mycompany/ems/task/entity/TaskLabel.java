package com.mycompany.ems.task.entity;

import jakarta.persistence.*;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "task_labels", schema = "task")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskLabel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Label name is required")
    @Size(min = 1, max = 50, message = "Label name must be between 1 and 50 characters")
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "color", length = 7) // Pour les couleurs hex genre #FF5733
    private String color = "#808080";

    @Column(name = "board_id", nullable = false)
    private Long boardId;

    // Les liaisons (ici c'est les relations, lol)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", insertable = false, updatable = false)
    private Board board;

    @OneToMany(mappedBy = "label", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TaskLabelRelation> labelRelations;
}