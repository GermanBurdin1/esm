package com.mycompany.ems.task.service;

import com.mycompany.ems.task.entity.TaskLabel;
import com.mycompany.ems.task.entity.TaskLabelRelation;
import com.mycompany.ems.task.repository.TaskLabelRepository;
import com.mycompany.ems.task.repository.TaskLabelRelationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class LabelService {
    
    private final TaskLabelRepository labelRepository;
    private final TaskLabelRelationRepository labelRelationRepository;

    public List<TaskLabel> getLabelsByBoard(Long boardId) {
        return labelRepository.findByBoardIdOrderByName(boardId);
    }

    public Optional<TaskLabel> getLabelById(Long id) {
        return labelRepository.findById(id);
    }

    public TaskLabel createLabel(TaskLabel label) {
        return labelRepository.save(label);
    }

    public TaskLabel updateLabel(Long id, TaskLabel labelDetails) {
        return labelRepository.findById(id)
            .map(label -> {
                label.setName(labelDetails.getName());
                label.setColor(labelDetails.getColor());
                return labelRepository.save(label);
            })
            .orElseThrow(() -> new RuntimeException("Label not found with id: " + id));
    }

    public void deleteLabel(Long id) {
        labelRepository.deleteById(id);
    }

    public List<TaskLabelRelation> getTaskLabels(Long taskId) {
        return labelRelationRepository.findByTaskId(taskId);
    }

    public TaskLabelRelation addLabelToTask(Long taskId, Long labelId) {
        // Check if relation already exists
        TaskLabelRelation existing = labelRelationRepository.findByTaskIdAndLabelId(taskId, labelId);
        if (existing != null) {
            return existing;
        }

        TaskLabelRelation relation = new TaskLabelRelation();
        relation.setTaskId(taskId);
        relation.setLabelId(labelId);
        return labelRelationRepository.save(relation);
    }

    public void removeLabelFromTask(Long taskId, Long labelId) {
        labelRelationRepository.deleteByTaskIdAndLabelId(taskId, labelId);
    }

    public Long getLabelUsageCount(Long labelId) {
        return labelRelationRepository.countByLabelId(labelId);
    }
}