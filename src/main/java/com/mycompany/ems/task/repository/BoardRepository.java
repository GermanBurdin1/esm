package com.mycompany.ems.task.repository;

import com.mycompany.ems.task.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    
    List<Board> findByWorkspaceId(Long workspaceId);
    
    @Query("SELECT b FROM Board b WHERE b.workspaceId = :workspaceId ORDER BY b.createdAt DESC")
    List<Board> findByWorkspaceIdOrderByCreatedAtDesc(@Param("workspaceId") Long workspaceId);
    
    @Query("SELECT b FROM Board b WHERE b.name LIKE %:name% AND b.workspaceId = :workspaceId")
    List<Board> findByNameContainingAndWorkspaceId(@Param("name") String name, @Param("workspaceId") Long workspaceId);
}