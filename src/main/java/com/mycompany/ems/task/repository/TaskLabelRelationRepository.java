package com.mycompany.ems.task.repository;

import com.mycompany.ems.task.entity.TaskLabelRelation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskLabelRelationRepository extends JpaRepository<TaskLabelRelation, Long> {
    
    List<TaskLabelRelation> findByTaskId(Long taskId);
    
    List<TaskLabelRelation> findByLabelId(Long labelId);
    
    @Query("SELECT tlr FROM TaskLabelRelation tlr WHERE tlr.taskId = :taskId AND tlr.labelId = :labelId")
    TaskLabelRelation findByTaskIdAndLabelId(@Param("taskId") Long taskId, @Param("labelId") Long labelId);
    
    @Query("SELECT COUNT(tlr) FROM TaskLabelRelation tlr WHERE tlr.labelId = :labelId")
    Long countByLabelId(@Param("labelId") Long labelId);
    
    void deleteByTaskIdAndLabelId(Long taskId, Long labelId);
}