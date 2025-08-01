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

    // Связи
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", insertable = false, updatable = false)
    private TaskEntity task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "label_id", insertable = false, updatable = false)
    private TaskLabel label;

    // Составной ключ для уникальности пары task-label
    @Table(uniqueConstraints = @UniqueConstraint(columnNames = {"task_id", "label_id"}))
    public static class TaskLabelKey {
        // Композитный ключ можно реализовать через @IdClass если нужно
    }
}