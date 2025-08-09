package com.mycompany.ems.config;

import com.mycompany.ems.task.entity.*;
import com.mycompany.ems.task.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

/**
 * Seeder pour remplir la base de données avec des données de test
 * S'exécute seulement en mode développement (@Profile("dev"))
 */
@Component
@RequiredArgsConstructor
@Slf4j
@Profile({"dev", "docker"}) // Active en dev local ET en docker
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final WorkspaceRepository workspaceRepository;
    private final BoardRepository boardRepository;
    private final ColumnRepository boardColumnRepository;
    private final TaskEntityRepository taskRepository;
    private final TaskCommentRepository commentRepository;
    private final TaskLabelRepository labelRepository;
    private final TaskLabelRelationRepository labelRelationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            log.info("🌱 Début du seeding complet des données de test...");
            seedAllData();
            return;
        }
        
        if (taskRepository.count() == 0) {
            log.info("🌱 Utilisateurs présents mais pas de tâches. Création des tâches...");
            seedTasksOnly();
            return;
        }
        
        log.info("🔍 Données déjà présentes, seeder skippé");
    }

    private void seedAllData() {
        log.info("🌱 Début du seeding des données de test...");

        // 1. Créer les utilisateurs
        User adminUser = createUser("admin", "admin@company.com", User.Role.ADMIN);
        User johnUser = createUser("john_doe", "john@company.com", User.Role.USER);
        User janeUser = createUser("jane_smith", "jane@company.com", User.Role.USER);
        User bobUser = createUser("bob_wilson", "bob@company.com", User.Role.USER);

        log.info("✅ Utilisateurs créés: {}", userRepository.count());

        // 2. Créer les workspaces
        Workspace devWorkspace = createWorkspace("Développement", "Espace pour les projets de dev", adminUser.getId());
        Workspace marketingWorkspace = createWorkspace("Marketing", "Campagnes et stratégies marketing", johnUser.getId());
        Workspace hrWorkspace = createWorkspace("Ressources Humaines", "Gestion du personnel", janeUser.getId());

        log.info("✅ Workspaces créés: {}", workspaceRepository.count());

        // 3. Créer les boards avec colonnes
        Board sprintBoard = createBoardWithColumns("Sprint Planning", "Board pour la planification des sprints", devWorkspace.getId());
        Board bugBoard = createBoardWithColumns("Bug Tracking", "Suivi des bugs critiques", devWorkspace.getId());
        Board campaignBoard = createBoardWithColumns("Campagnes 2024", "Planification des campagnes", marketingWorkspace.getId());

        log.info("✅ Boards créés: {}", boardRepository.count());
        log.info("✅ Colonnes créées: {}", boardColumnRepository.count());

        // 4. Récupérer les colonnes
        List<BoardColumn> sprintColumns = boardColumnRepository.findByBoardIdOrderByPosition(sprintBoard.getId());
        List<BoardColumn> bugColumns = boardColumnRepository.findByBoardIdOrderByPosition(bugBoard.getId());
        List<BoardColumn> campaignColumns = boardColumnRepository.findByBoardIdOrderByPosition(campaignBoard.getId());

        // 5. Créer les tâches
        createTasksForSprint(sprintColumns, johnUser, janeUser, bobUser);
        createTasksForBugs(bugColumns, johnUser, bobUser);
        createTasksForCampaign(campaignColumns, janeUser, bobUser);

        log.info("✅ Tâches créées: {}", taskRepository.count());

        // 6. Créer les labels
        createLabels(sprintBoard, bugBoard, campaignBoard);

        log.info("✅ Labels créés: {}", labelRepository.count());

        // 7. Créer les commentaires
        createComments();

        log.info("✅ Commentaires créés: {}", commentRepository.count());

        log.info("🎉 Seeding terminé avec succès! Données de test prêtes.");
        log.info("🔗 Swagger UI: http://localhost:8080/swagger-ui.html");
        log.info("🏥 Health Check: http://localhost:8080/api/public/health");
    }

    private void seedTasksOnly() {
        log.info("🌱 Création des tâches pour les utilisateurs existants...");

        // Récupérer les utilisateurs existants ou les créer
        List<User> users = userRepository.findAll();
        
        User adminUser, johnUser, janeUser, bobUser;
        
        if (users.isEmpty()) {
            // Créer tous les utilisateurs
            log.info("🔧 Aucun utilisateur trouvé, création des utilisateurs...");
            adminUser = createUser("admin", "admin@company.com", User.Role.ADMIN);
            johnUser = createUser("john_doe", "john@company.com", User.Role.USER);
            janeUser = createUser("jane_smith", "jane@company.com", User.Role.USER);
            bobUser = createUser("bob_wilson", "bob@company.com", User.Role.USER);
        } else {
            // Utiliser les utilisateurs existants et créer les manquants
            adminUser = users.stream().filter(u -> u.getRole() == User.Role.ADMIN).findFirst().orElse(users.get(0));
            
            if (users.size() >= 2) {
                johnUser = users.get(1);
            } else {
                log.info("🔧 Création de l'utilisateur john_doe...");
                johnUser = createUser("john_doe", "john@company.com", User.Role.USER);
            }
            
            if (users.size() >= 3) {
                janeUser = users.get(2);
            } else {
                log.info("🔧 Création de l'utilisateur jane_smith...");
                janeUser = createUser("jane_smith", "jane@company.com", User.Role.USER);
            }
            
            if (users.size() >= 4) {
                bobUser = users.get(3);
            } else {
                log.info("🔧 Création de l'utilisateur bob_wilson...");
                bobUser = createUser("bob_wilson", "bob@company.com", User.Role.USER);
            }
        }

        // Créer workspaces et boards si nécessaire
        Workspace devWorkspace;
        if (workspaceRepository.count() == 0) {
            devWorkspace = createWorkspace("Développement", "Espace pour les projets de dev", adminUser.getId());
        } else {
            devWorkspace = workspaceRepository.findAll().get(0);
        }

        // Créer boards avec colonnes
        Board sprintBoard;
        if (boardRepository.count() == 0) {
            sprintBoard = createBoardWithColumns("Sprint Planning", "Board pour la planification des sprints", devWorkspace.getId());
        } else {
            sprintBoard = boardRepository.findAll().get(0);
        }

        // Récupérer ou créer les colonnes
        List<BoardColumn> sprintColumns = boardColumnRepository.findByBoardIdOrderByPosition(sprintBoard.getId());
        if (sprintColumns.isEmpty()) {
            createColumn(sprintBoard.getId(), "To Do", 0);
            createColumn(sprintBoard.getId(), "In Progress", 1);
            createColumn(sprintBoard.getId(), "Review", 2);
            createColumn(sprintBoard.getId(), "Done", 3);
            sprintColumns = boardColumnRepository.findByBoardIdOrderByPosition(sprintBoard.getId());
        }

        // Créer 5 tâches avec différentes priorités
        if (sprintColumns.size() >= 4) {
            createTask("🔐 Implementer l'authentification JWT", 
                      "Ajouter un système d'authentification avec tokens JWT pour sécuriser l'API", 
                      sprintColumns.get(0).getId(), adminUser.getId(), TaskEntity.Priority.HIGH, 0);
                      
            createTask("📊 Dashboard Analytics", 
                      "Créer un dashboard avec des graphiques pour visualiser les métriques", 
                      sprintColumns.get(0).getId(), johnUser.getId(), TaskEntity.Priority.MEDIUM, 1);
                      
            createTask("🎨 Améliorer l'UI/UX", 
                      "Refactoriser l'interface utilisateur pour une meilleure expérience", 
                      sprintColumns.get(1).getId(), janeUser.getId(), TaskEntity.Priority.LOW, 0);
                      
            createTask("🐛 Corriger le bug de performance", 
                      "Optimiser les requêtes database qui causent des ralentissements", 
                      sprintColumns.get(1).getId(), bobUser.getId(), TaskEntity.Priority.HIGH, 1);
                      
            createTask("📱 Version mobile responsive", 
                      "Adapter l'application pour les appareils mobiles et tablettes", 
                      sprintColumns.get(2).getId(), adminUser.getId(), TaskEntity.Priority.MEDIUM, 0);
        }

        log.info("✅ Tâches créées: {}", taskRepository.count());
        log.info("🎉 Création des tâches terminée avec succès!");
    }

    private User createUser(String username, String email, User.Role role) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode("password123")); // Encoder le mot de passe
        user.setRole(role);
        return userRepository.save(user);
    }

    private Workspace createWorkspace(String name, String description, Long ownerId) {
        Workspace workspace = new Workspace();
        workspace.setName(name);
        workspace.setDescription(description);
        workspace.setOwnerId(ownerId);
        return workspaceRepository.save(workspace);
    }

    private Board createBoardWithColumns(String name, String description, Long workspaceId) {
        Board board = new Board();
        board.setName(name);
        // Board n'a pas de champ description, juste le nom
        board.setWorkspaceId(workspaceId);
        Board savedBoard = boardRepository.save(board);

        // Créer les colonnes par défaut
        createColumn(savedBoard.getId(), "To Do", 0);
        createColumn(savedBoard.getId(), "In Progress", 1);
        createColumn(savedBoard.getId(), "Review", 2);
        createColumn(savedBoard.getId(), "Done", 3);

        return savedBoard;
    }

    private BoardColumn createColumn(Long boardId, String name, int position) {
        BoardColumn column = new BoardColumn();
        column.setBoardId(boardId);
        column.setName(name);
        column.setPosition(position);
        return boardColumnRepository.save(column);
    }

    private void createTasksForSprint(List<BoardColumn> columns, User... users) {
        // To Do
        createTask("Implement User Authentication", "Add JWT-based auth system", 
                  columns.get(0).getId(), users[0].getId(), TaskEntity.Priority.HIGH, 0);
        createTask("Setup CI/CD Pipeline", "Configure GitHub Actions", 
                  columns.get(0).getId(), users[1].getId(), TaskEntity.Priority.MEDIUM, 1);
        
        // In Progress  
        createTask("Database Migration", "Update schema for new features", 
                  columns.get(1).getId(), users[0].getId(), TaskEntity.Priority.HIGH, 0);
        
        // Review
        createTask("API Documentation", "Complete Swagger docs", 
                  columns.get(2).getId(), users[2].getId(), TaskEntity.Priority.LOW, 0);
        
        // Done
        createTask("Project Setup", "Initial Spring Boot setup", 
                  columns.get(3).getId(), users[0].getId(), TaskEntity.Priority.MEDIUM, 0);
    }

    private void createTasksForBugs(List<BoardColumn> columns, User... users) {
        createTask("Fix Password Encoding Bug", "BCrypt not working correctly", 
                  columns.get(0).getId(), users[0].getId(), TaskEntity.Priority.HIGH, 0);
        createTask("Memory Leak Investigation", "High memory usage in production", 
                  columns.get(1).getId(), users[1].getId(), TaskEntity.Priority.HIGH, 0);
        createTask("UI Responsiveness", "Mobile view broken on login page", 
                  columns.get(2).getId(), users[0].getId(), TaskEntity.Priority.MEDIUM, 0);
    }

    private void createTasksForCampaign(List<BoardColumn> columns, User... users) {
        createTask("Q1 Social Media Campaign", "Instagram & Facebook ads", 
                  columns.get(0).getId(), users[0].getId(), TaskEntity.Priority.MEDIUM, 0);
        createTask("Email Newsletter", "Monthly company updates", 
                  columns.get(1).getId(), users[1].getId(), TaskEntity.Priority.LOW, 0);
        createTask("Website Redesign", "Modern UI/UX improvements", 
                  columns.get(2).getId(), users[0].getId(), TaskEntity.Priority.HIGH, 0);
    }

    private TaskEntity createTask(String title, String description, Long columnId, 
                                Long assigneeId, TaskEntity.Priority priority, int position) {
        TaskEntity task = new TaskEntity();
        task.setTitle(title);
        task.setDescription(description);
        task.setColumnId(columnId);
        task.setAssigneeId(assigneeId);
        task.setPriority(priority);
        task.setPosition(position);
        task.setDueDate(LocalDate.now().plusDays(7)); // Due dans 7 jours
        return taskRepository.save(task);
    }

    private void createLabels(Board... boards) {
        // Labels pour le board de développement
        createLabel("urgent", "#FF5733", boards[0].getId());
        createLabel("bug", "#E74C3C", boards[0].getId());
        createLabel("feature", "#3498DB", boards[0].getId());
        createLabel("enhancement", "#2ECC71", boards[0].getId());
        
        // Labels pour les bugs
        createLabel("critical", "#8E44AD", boards[1].getId());
        createLabel("investigation", "#F39C12", boards[1].getId());
        
        // Labels pour marketing
        createLabel("social-media", "#E91E63", boards[2].getId());
        createLabel("email", "#009688", boards[2].getId());
        createLabel("design", "#FF9800", boards[2].getId());
    }

    private TaskLabel createLabel(String name, String color, Long boardId) {
        TaskLabel label = new TaskLabel();
        label.setName(name);
        label.setColor(color);
        label.setBoardId(boardId);
        return labelRepository.save(label);
    }

    private void createComments() {
        List<TaskEntity> tasks = taskRepository.findAll();
        List<User> users = userRepository.findAll();
        
        if (!tasks.isEmpty() && !users.isEmpty()) {
            // Quelques commentaires sur différentes tâches
            createComment(tasks.get(0).getId(), users.get(0).getId(), 
                         "J'ai commencé à travailler sur cette tâche. Estimation: 3 jours.");
            createComment(tasks.get(0).getId(), users.get(1).getId(), 
                         "N'oublie pas de tester sur mobile aussi!");
            createComment(tasks.get(1).getId(), users.get(1).getId(), 
                         "Configuration en cours, GitHub Actions presque prêt.");
            createComment(tasks.get(2).getId(), users.get(2).getId(), 
                         "Migration terminée, tests en cours.");
        }
    }

    private TaskComment createComment(Long taskId, Long authorId, String text) {
        TaskComment comment = new TaskComment();
        comment.setTaskId(taskId);
        comment.setAuthorId(authorId);
        comment.setText(text);
        return commentRepository.save(comment);
    }
}