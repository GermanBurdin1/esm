package com.mycompany.ems.task.service;

import com.mycompany.ems.task.entity.TaskEntity;
import com.mycompany.ems.task.repository.TaskEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {
    
    private final TaskEntityRepository taskRepository;

    public List<TaskEntity> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<TaskEntity> getTasksByColumnId(Long columnId) {
        return taskRepository.findByColumnIdOrderByPosition(columnId);
    }

    public List<TaskEntity> getTasksByAssignee(Long assigneeId) {
        return taskRepository.findByAssigneeId(assigneeId);
    }

    public Optional<TaskEntity> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public TaskEntity createTask(TaskEntity task) {
        // Set position to the end of the column
        Integer maxPosition = taskRepository.findMaxPositionByColumnId(task.getColumnId());
        task.setPosition(maxPosition != null ? maxPosition + 1 : 0);
        return taskRepository.save(task);
    }

    public TaskEntity updateTask(Long id, TaskEntity taskDetails) {
        return taskRepository.findById(id)
            .map(task -> {
                task.setTitle(taskDetails.getTitle());
                task.setDescription(taskDetails.getDescription());
                task.setAssigneeId(taskDetails.getAssigneeId());
                task.setDueDate(taskDetails.getDueDate());
                task.setPriority(taskDetails.getPriority());
                return taskRepository.save(task);
            })
            .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    public TaskEntity moveTask(Long taskId, Long newColumnId, Integer newPosition) {
        return taskRepository.findById(taskId)
            .map(task -> {
                Long oldColumnId = task.getColumnId();
                
                // If moving to a different column
                if (!oldColumnId.equals(newColumnId)) {
                    task.setColumnId(newColumnId);
                }
                
                // Update position
                task.setPosition(newPosition);
                return taskRepository.save(task);
            })
            .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public List<TaskEntity> searchTasks(String title) {
        return taskRepository.findByTitleContaining(title);
    }
}