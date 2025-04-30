package ut.edu.teammatching.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ut.edu.teammatching.dto.team.TaskDTO;
import ut.edu.teammatching.dto.team.TaskStatusRequest;
import ut.edu.teammatching.models.Task;
import ut.edu.teammatching.services.TaskService;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * API: Lấy thông tin một task dựa trên ID.
     */
    @GetMapping("/{taskId}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.getTaskById(taskId));
    }

    @GetMapping("/team/{teamId}")
    public List<TaskDTO> getTasksByTeam(@PathVariable Long teamId) {
        return taskService.getTasksByTeam(teamId);  // Trả về danh sách TaskDTO
    }

    /**
     * API: Xóa một task.
     */
    @DeleteMapping("/{taskId}")
    public ResponseEntity<String> deleteTask(@PathVariable Long taskId, @RequestParam Long userId) {
        try {
            taskService.deleteTask(taskId, userId);  // Pass userId to the service
            return ResponseEntity.ok("Task đã được xóa thành công!");
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());  // Unauthorized deletion attempt
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error deleting task: " + e.getMessage());
        }
    }

    /**
     * API: Chỉ leader của team mới có thể giao task cho thành viên.
     */
    @PostMapping("/{teamId}/create")
    public ResponseEntity<TaskDTO> createTask(
            @PathVariable Long teamId,
            @RequestParam Long leaderId,
            @RequestBody TaskDTO taskDTO) {

        Task task = taskService.createTask(
                leaderId,
                teamId,
                taskDTO.getTaskName(),
                taskDTO.getDescription(),
                taskDTO.getDeadline(),
                taskDTO.getAssignedStudentId()
        );
        return ResponseEntity.ok(TaskDTO.fromTask(task));
    }

    @PutMapping("/{taskId}/status")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long taskId, @RequestParam Long leaderId, @RequestBody TaskStatusRequest request) {
        try {
            Task updatedTask = taskService.updateTaskStatus(taskId, request.getNewStatus(), leaderId);

            TaskDTO taskDTO = TaskDTO.fromTask(updatedTask);
            return ResponseEntity.ok(taskDTO);

        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error updating task status: " + e.getMessage());
        }
    }
}
