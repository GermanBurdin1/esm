package com.mycompany.ems.task.repository;

import com.mycompany.ems.task.entity.BoardColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ColumnRepository extends JpaRepository<BoardColumn, Long> {
    
        List<BoardColumn> findByBoardId(Long boardId);

    @Query("SELECT c FROM BoardColumn c WHERE c.boardId = :boardId ORDER BY c.position ASC")
    List<BoardColumn> findByBoardIdOrderByPosition(@Param("boardId") Long boardId);

    @Query("SELECT MAX(c.position) FROM BoardColumn c WHERE c.boardId = :boardId")
    Integer findMaxPositionByBoardId(@Param("boardId") Long boardId);
}