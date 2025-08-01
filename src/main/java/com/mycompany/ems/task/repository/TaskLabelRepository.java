package com.mycompany.ems.task.repository;

import com.mycompany.ems.task.entity.TaskLabel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskLabelRepository extends JpaRepository<TaskLabel, Long> {
    
    List<TaskLabel> findByBoardId(Long boardId);
    
    @Query("SELECT tl FROM TaskLabel tl WHERE tl.boardId = :boardId ORDER BY tl.name ASC")
    List<TaskLabel> findByBoardIdOrderByName(@Param("boardId") Long boardId);
    
    @Query("SELECT tl FROM TaskLabel tl WHERE tl.name LIKE %:name% AND tl.boardId = :boardId")
    List<TaskLabel> findByNameContainingAndBoardId(@Param("name") String name, @Param("boardId") Long boardId);
}