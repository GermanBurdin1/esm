package com.mycompany.ems.task.service;

import com.mycompany.ems.task.entity.Workspace;
import com.mycompany.ems.task.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class WorkspaceService {
    
    private final WorkspaceRepository workspaceRepository;

    public List<Workspace> getAllWorkspaces() {
        return workspaceRepository.findAll();
    }

    public List<Workspace> getWorkspacesByOwner(Long ownerId) {
        return workspaceRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId);
    }

    public Optional<Workspace> getWorkspaceById(Long id) {
        return workspaceRepository.findById(id);
    }

    public Workspace createWorkspace(Workspace workspace) {
        return workspaceRepository.save(workspace);
    }

    public Workspace updateWorkspace(Long id, Workspace workspaceDetails) {
        return workspaceRepository.findById(id)
            .map(workspace -> {
                workspace.setName(workspaceDetails.getName());
                workspace.setDescription(workspaceDetails.getDescription());
                return workspaceRepository.save(workspace);
            })
            .orElseThrow(() -> new RuntimeException("Workspace not found with id: " + id));
    }

    public void deleteWorkspace(Long id) {
        workspaceRepository.deleteById(id);
    }

    public List<Workspace> searchWorkspaces(String name) {
        return workspaceRepository.findByNameContaining(name);
    }
}