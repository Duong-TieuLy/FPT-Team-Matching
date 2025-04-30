package ut.edu.teammatching.dto.team;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ut.edu.teammatching.enums.TaskStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskStatusRequest {
    private TaskStatus newStatus;
    private Long leaderId;  // ID của leader
}