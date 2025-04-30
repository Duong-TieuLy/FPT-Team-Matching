package ut.edu.teammatching.services;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import ut.edu.teammatching.dto.team.TaskDTO;
import ut.edu.teammatching.enums.TaskStatus;
import ut.edu.teammatching.models.Student;
import ut.edu.teammatching.models.Task;
import ut.edu.teammatching.models.Team;
import ut.edu.teammatching.repositories.StudentRepository;
import ut.edu.teammatching.repositories.TaskRepository;
import ut.edu.teammatching.repositories.TeamRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final TeamRepository teamRepository;
    private final StudentRepository studentRepository;

    public TaskService(TaskRepository taskRepository, TeamRepository teamRepository, StudentRepository studentRepository) {
        this.taskRepository = taskRepository;
        this.teamRepository = teamRepository;
        this.studentRepository = studentRepository;
    }

    /**
     * Lấy thông tin một task dựa trên ID.
     */
    public Task getTaskById(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy task!"));
    }

    public List<TaskDTO> getTasksByTeam(Long teamId) {
        List<Task> tasks = taskRepository.findByTeamId(teamId);  // Lấy danh sách task từ DB
        return tasks.stream()
                .map(TaskDTO::fromTask)  // Chuyển đổi từ Task sang TaskDTO
                .collect(Collectors.toList());  // Thu thập vào List<TaskDTO>
    }


    public Task updateTaskStatus(Long taskId, TaskStatus newStatus, Long leaderId) throws Exception {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new Exception("Task not found"));

        // Kiểm tra quyền của leader
        if (task.getTeam().getLeader() == null || !task.getTeam().getLeader().getId().equals(leaderId)) {
            throw new SecurityException("You are not authorized to update the status of this task.");
        }

        // Cập nhật trạng thái task
        task.setStatus(newStatus);
        return taskRepository.save(task);
    }

    /**
     * Xóa một task khỏi hệ thống.
     */
    @Transactional
    public void deleteTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy task để xóa!"));

        Team team = task.getTeam();  // Assuming the task has a reference to the Team entity
        if (team == null || !team.getLeader().getId().equals(userId)) {
            throw new SecurityException("Bạn không có quyền xóa task này!");
        }

        taskRepository.deleteById(taskId);
    }

    /**
     * Chỉ leader của team mới có thể giao task cho thành viên.
     */
    @Transactional
    public Task createTask(Long leaderId, Long teamId, String taskName, String description
                            , LocalDate deadline, Long assignedStudentId) {
        // 1. Kiểm tra team có tồn tại không
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy team!"));

        // 2. Kiểm tra leader có hợp lệ không
        if (!team.getLeader().getId().equals(leaderId)) {
            throw new IllegalStateException("Chỉ leader của team mới có thể tạo task!");
        }

        // 3. Nếu có chỉ định student được giao, kiểm tra student có thuộc team không
        Student assignedStudent = null;
        if (assignedStudentId != null) {
            assignedStudent = studentRepository.findById(assignedStudentId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên!"));

            if (!team.getStudents().contains(assignedStudent)) {
                throw new IllegalStateException("Sinh viên không thuộc team này!");
            }
        }

        // 4. Tạo task
        Task task = new Task();
        task.setTaskName(taskName);
        task.setDescription(description);
        task.setStatus(TaskStatus.IN_PROGRESS);
        task.setDeadline(deadline);
        task.setAssignedToStudent(assignedStudent);
        task.setTeam(team);

        return taskRepository.save(task);
    }
}
