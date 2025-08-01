package com.mycompany.ems.task.entity;

import jakarta.persistence.*;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "task_label_relations", schema = "task")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskLabelRelation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "task_id", nullable = false)
    private Long taskId;

    @Column(name = "label_id", nullable = false)
    private Long labelId;

    // Les liaisons (ici c'est les relations, lol)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", insertable = false, updatable = false)
    private TaskEntity task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "label_id", insertable = false, updatable = false)
    private TaskLabel label;

    // Clé composé pour l'unicité du pair task-label
    @Table(uniqueConstraints = @UniqueConstraint(columnNames = {"task_id", "label_id"}))
    public static class TaskLabelKey {
        // La clé composite peut être fait avec @IdClass si tu veux
    }
}