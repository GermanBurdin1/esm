-- Create task schema if not exists
CREATE SCHEMA IF NOT EXISTS task;

-- Create users table
CREATE TABLE task.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create workspaces table
CREATE TABLE task.workspaces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    owner_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_workspace_owner FOREIGN KEY (owner_id) REFERENCES task.users(id) ON DELETE CASCADE
);

-- Create boards table
CREATE TABLE task.boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    workspace_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_board_workspace FOREIGN KEY (workspace_id) REFERENCES task.workspaces(id) ON DELETE CASCADE
);

-- Create columns table
CREATE TABLE task.columns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    board_id BIGINT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT fk_column_board FOREIGN KEY (board_id) REFERENCES task.boards(id) ON DELETE CASCADE
);

-- Create tasks table
CREATE TABLE task.tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    column_id BIGINT NOT NULL,
    assignee_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date DATE,
    position INTEGER NOT NULL DEFAULT 0,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    CONSTRAINT fk_task_column FOREIGN KEY (column_id) REFERENCES task.columns(id) ON DELETE CASCADE,
    CONSTRAINT fk_task_assignee FOREIGN KEY (assignee_id) REFERENCES task.users(id) ON DELETE SET NULL
);

-- Create task_comments table
CREATE TABLE task.task_comments (
    id SERIAL PRIMARY KEY,
    task_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    text VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment_task FOREIGN KEY (task_id) REFERENCES task.tasks(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_author FOREIGN KEY (author_id) REFERENCES task.users(id) ON DELETE CASCADE
);

-- Create task_attachments table
CREATE TABLE task.task_attachments (
    id SERIAL PRIMARY KEY,
    task_id BIGINT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500),
    original_filename VARCHAR(255),
    file_size BIGINT,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attachment_task FOREIGN KEY (task_id) REFERENCES task.tasks(id) ON DELETE CASCADE
);

-- Create task_labels table
CREATE TABLE task.task_labels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) DEFAULT '#808080',
    board_id BIGINT NOT NULL,
    CONSTRAINT fk_label_board FOREIGN KEY (board_id) REFERENCES task.boards(id) ON DELETE CASCADE
);

-- Create task_label_relations table (Many-to-Many)
CREATE TABLE task.task_label_relations (
    id SERIAL PRIMARY KEY,
    task_id BIGINT NOT NULL,
    label_id BIGINT NOT NULL,
    CONSTRAINT fk_relation_task FOREIGN KEY (task_id) REFERENCES task.tasks(id) ON DELETE CASCADE,
    CONSTRAINT fk_relation_label FOREIGN KEY (label_id) REFERENCES task.task_labels(id) ON DELETE CASCADE,
    CONSTRAINT uk_task_label UNIQUE (task_id, label_id)
);

-- Create indexes for performance
CREATE INDEX idx_workspaces_owner_id ON task.workspaces(owner_id);
CREATE INDEX idx_boards_workspace_id ON task.boards(workspace_id);
CREATE INDEX idx_columns_board_id ON task.columns(board_id);
CREATE INDEX idx_columns_position ON task.columns(board_id, position);
CREATE INDEX idx_tasks_column_id ON task.tasks(column_id);
CREATE INDEX idx_tasks_assignee_id ON task.tasks(assignee_id);
CREATE INDEX idx_tasks_position ON task.tasks(column_id, position);
CREATE INDEX idx_task_comments_task_id ON task.task_comments(task_id);
CREATE INDEX idx_task_attachments_task_id ON task.task_attachments(task_id);
CREATE INDEX idx_task_labels_board_id ON task.task_labels(board_id);
CREATE INDEX idx_task_label_relations_task_id ON task.task_label_relations(task_id);
CREATE INDEX idx_task_label_relations_label_id ON task.task_label_relations(label_id);