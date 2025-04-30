package ut.edu.teammatching.dto.team;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ut.edu.teammatching.enums.TaskStatus;
import ut.edu.teammatching.models.Task;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private Long id;
    private String taskName;
    private String description;
    private TaskStatus status;
    private LocalDate deadline;
    private Long assignedStudentId;
    private String assignedStudentName;
    private Long leaderId;
    private Long teamId;
    private String teamName;

    public static TaskDTO fromTask(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTaskName(task.getTaskName());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setDeadline(task.getDeadline());

        if (task.getAssignedToStudent() != null) {
            dto.setAssignedStudentId(task.getAssignedToStudent().getId());
            dto.setAssignedStudentName(task.getAssignedToStudent().getFullName());
        }

        if (task.getTeam() != null) {
            dto.setTeamId(task.getTeam().getId());
            dto.setTeamName(task.getTeam().getTeamName());
            dto.setLeaderId(task.getTeam().getLeader().getId());
        }

        return dto;
    }
}
