package com.mycompany.ems.task.repository;

import com.mycompany.ems.task.entity.TaskComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskCommentRepository extends JpaRepository<TaskComment, Long> {
    
    List<TaskComment> findByTaskId(Long taskId);
    
    @Query("SELECT tc FROM TaskComment tc WHERE tc.taskId = :taskId ORDER BY tc.createdAt ASC")
    List<TaskComment> findByTaskIdOrderByCreatedAt(@Param("taskId") Long taskId);
    
    List<TaskComment> findByAuthorId(Long authorId);
    
    @Query("SELECT COUNT(tc) FROM TaskComment tc WHERE tc.taskId = :taskId")
    Long countByTaskId(@Param("taskId") Long taskId);
}