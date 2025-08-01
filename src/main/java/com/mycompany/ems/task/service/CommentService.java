package com.mycompany.ems.task.service;

import com.mycompany.ems.task.entity.TaskComment;
import com.mycompany.ems.task.repository.TaskCommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {
    
    private final TaskCommentRepository commentRepository;

    public List<TaskComment> getCommentsByTask(Long taskId) {
        return commentRepository.findByTaskIdOrderByCreatedAt(taskId);
    }

    public Optional<TaskComment> getCommentById(Long id) {
        return commentRepository.findById(id);
    }

    public TaskComment createComment(TaskComment comment) {
        return commentRepository.save(comment);
    }

    public TaskComment updateComment(Long id, TaskComment commentDetails) {
        return commentRepository.findById(id)
            .map(comment -> {
                comment.setText(commentDetails.getText());
                return commentRepository.save(comment);
            })
            .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }

    public Long getCommentCount(Long taskId) {
        return commentRepository.countByTaskId(taskId);
    }
}