package com.mycompany.ems.task.repository;

import com.mycompany.ems.task.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskEntityRepository extends JpaRepository<TaskEntity, Long> {
    
    List<TaskEntity> findByColumnId(Long columnId);
    
    @Query("SELECT t FROM TaskEntity t WHERE t.columnId = :columnId ORDER BY t.position ASC")
    List<TaskEntity> findByColumnIdOrderByPosition(@Param("columnId") Long columnId);
    
    List<TaskEntity> findByAssigneeId(Long assigneeId);
    
    @Query("SELECT t FROM TaskEntity t WHERE t.assigneeId = :assigneeId AND t.dueDate <= :date")
    List<TaskEntity> findByAssigneeIdAndDueDateBefore(@Param("assigneeId") Long assigneeId, @Param("date") LocalDate date);
    
    @Query("SELECT t FROM TaskEntity t WHERE t.priority = :priority")
    List<TaskEntity> findByPriority(@Param("priority") TaskEntity.Priority priority);
    
    @Query("SELECT MAX(t.position) FROM TaskEntity t WHERE t.columnId = :columnId")
    Integer findMaxPositionByColumnId(@Param("columnId") Long columnId);
    
    @Query("SELECT t FROM TaskEntity t WHERE t.title LIKE %:title%")
    List<TaskEntity> findByTitleContaining(@Param("title") String title);
}