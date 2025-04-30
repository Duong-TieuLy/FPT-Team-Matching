package ut.edu.teammatching.models;
import ut.edu.teammatching.enums.TaskStatus;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name="tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id", nullable = false)
    private Long id;

    @Column(name = "task_name", nullable = false)
    private String taskName;

    @Lob
    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TaskStatus status = TaskStatus.IN_PROGRESS;

    @Column(name = "deadline")
    private LocalDate deadline;

    // Liên kết với Student (người được giao task)
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "student_id")
    private Student assignedToStudent;

    // Liên kết với Team (nhóm chứa task)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @PrePersist
    @PreUpdate
    public void validateDeadline() {
        if (this.deadline != null && this.deadline.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Deadline cannot be in the past");
        }
    }
}