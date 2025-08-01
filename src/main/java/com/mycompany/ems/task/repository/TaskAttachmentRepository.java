package com.mycompany.ems.task.repository;

import com.mycompany.ems.task.entity.TaskAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskAttachmentRepository extends JpaRepository<TaskAttachment, Long> {
    
    List<TaskAttachment> findByTaskId(Long taskId);
    
    @Query("SELECT ta FROM TaskAttachment ta WHERE ta.taskId = :taskId ORDER BY ta.uploadedAt DESC")
    List<TaskAttachment> findByTaskIdOrderByUploadedAt(@Param("taskId") Long taskId);
    
    @Query("SELECT COUNT(ta) FROM TaskAttachment ta WHERE ta.taskId = :taskId")
    Long countByTaskId(@Param("taskId") Long taskId);
    
    @Query("SELECT SUM(ta.fileSize) FROM TaskAttachment ta WHERE ta.taskId = :taskId")
    Long getTotalFileSizeByTaskId(@Param("taskId") Long taskId);
}