package ut.edu.teammatching.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import ut.edu.teammatching.enums.TeamType;
import ut.edu.teammatching.models.User;
import java.util.ArrayList;
import java.util.List;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name="teams")
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_id", nullable = false)
    private Long id;

    @Column(name = "team_name", nullable = false)
    private String teamName;

    @Enumerated(EnumType.STRING)
    @Column(name = "team_type", nullable = false)
    private TeamType teamType;

    @Lob
    private String  description;

    @ManyToMany(mappedBy = "teams", fetch = FetchType.LAZY)
    private List<Student> students = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lecturer_id")
    private Lecturer lecturer;

    @OneToMany(mappedBy = "team", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks = new ArrayList<>();

    // Team Leader - Người tạo nhóm
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leader_id", nullable = false)
    private Student leader;

    @OneToMany(mappedBy = "team", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message>  messages = new ArrayList<>();
    /** 🔥 Kiểm tra ràng buộc: Nếu team là Academic thì phải có giảng viên */
    @PrePersist
    @PreUpdate
    private void validateTeam() {
        if (this.teamType == TeamType.ACADEMIC && this.lecturer == null) {
            throw new IllegalStateException("Academic Team phải có giảng viên!");
        }
        if (this.leader == null) {
            throw new IllegalStateException("Mỗi Team phải có một Team Leader!");
        }
    }
}