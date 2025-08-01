package com.mycompany.ems.task.service;

import com.mycompany.ems.task.entity.Board;
import com.mycompany.ems.task.entity.BoardColumn;
import com.mycompany.ems.task.repository.BoardRepository;
import com.mycompany.ems.task.repository.ColumnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardService {
    
    private final BoardRepository boardRepository;
    private final ColumnRepository columnRepository;

    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }

    public List<Board> getBoardsByWorkspace(Long workspaceId) {
        return boardRepository.findByWorkspaceIdOrderByCreatedAtDesc(workspaceId);
    }

    public Optional<Board> getBoardById(Long id) {
        return boardRepository.findById(id);
    }

    public Board createBoard(Board board) {
        Board savedBoard = boardRepository.save(board);
        
        // Create default columns for new board
        createDefaultColumns(savedBoard.getId());
        
        return savedBoard;
    }

    public Board updateBoard(Long id, Board boardDetails) {
        return boardRepository.findById(id)
            .map(board -> {
                board.setName(boardDetails.getName());
                return boardRepository.save(board);
            })
            .orElseThrow(() -> new RuntimeException("Board not found with id: " + id));
    }

    public void deleteBoard(Long id) {
        boardRepository.deleteById(id);
    }

    public List<BoardColumn> getColumnsByBoard(Long boardId) {
        return columnRepository.findByBoardIdOrderByPosition(boardId);
    }

    public BoardColumn createColumn(BoardColumn column) {
        // Set position to the end
        Integer maxPosition = columnRepository.findMaxPositionByBoardId(column.getBoardId());
        column.setPosition(maxPosition != null ? maxPosition + 1 : 0);
        return columnRepository.save(column);
    }

    public BoardColumn updateColumn(Long id, BoardColumn columnDetails) {
        return columnRepository.findById(id)
            .map(column -> {
                column.setName(columnDetails.getName());
                return columnRepository.save(column);
            })
            .orElseThrow(() -> new RuntimeException("Column not found with id: " + id));
    }

    public void deleteColumn(Long id) {
        columnRepository.deleteById(id);
    }

    private void createDefaultColumns(Long boardId) {
        String[] defaultColumns = {"To Do", "In Progress", "Done"};
        
        for (int i = 0; i < defaultColumns.length; i++) {
            BoardColumn column = new BoardColumn();
            column.setBoardId(boardId);
            column.setName(defaultColumns[i]);
            column.setPosition(i);
            columnRepository.save(column);
        }
    }
}