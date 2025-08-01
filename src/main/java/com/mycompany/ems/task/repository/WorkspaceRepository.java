package com.mycompany.ems.task.repository;

import com.mycompany.ems.task.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    
    List<Workspace> findByOwnerId(Long ownerId);
    
    @Query("SELECT w FROM Workspace w WHERE w.ownerId = :ownerId ORDER BY w.createdAt DESC")
    List<Workspace> findByOwnerIdOrderByCreatedAtDesc(@Param("ownerId") Long ownerId);
    
    @Query("SELECT w FROM Workspace w WHERE w.name LIKE %:name%")
    List<Workspace> findByNameContaining(@Param("name") String name);
}