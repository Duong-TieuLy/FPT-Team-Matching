package ut.edu.teammatching.models;

import jakarta.persistence.*;
import lombok.*;
import ut.edu.teammatching.enums.TeamType;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @Column(name = "team_picture")
    private String teamPicture; // Lưu đường dẫn ảnh đại diện

    @Lob
    private String  description;

    @ManyToMany
    @JoinTable(
            name = "student_team",
            joinColumns = @JoinColumn(name = "team_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
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

    // Đảm bảo chỉ có một leader duy nhất
    public void setLeader(Student newLeader) {
        if (newLeader == null || !students.contains(newLeader)) {
            throw new IllegalStateException("Leader phải là một thành viên của team!");
        }
        this.leader = newLeader;
    }

    // Kiểm tra nếu leader rời khỏi team
    public void removeStudent(Student student) {
        if (student.equals(this.leader)) {
            throw new IllegalStateException("Leader không thể rời team! Hãy chỉ định leader mới trước.");
        }
        students.remove(student);
        roles.remove(student);
    }

    @ElementCollection
    @CollectionTable(name = "team_roles", joinColumns = @JoinColumn(name = "team_id"))
    @MapKeyJoinColumn(name = "user_id")
    @Column(name = "role")
    private Map<User, String> roles = new HashMap<>();

    /** 🔥 Kiểm tra ràng buộc: Nếu team là Academic thì phải có giảng viên */
    @PrePersist
    @PreUpdate
    private void validateTeam() {
        if (this.teamType == TeamType.ACADEMIC && this.lecturer == null) {
            throw new IllegalStateException("Academic Team phải có giảng viên!");
        }
        if (this.leader == null || !students.contains(this.leader)) {
            throw new IllegalStateException("Mỗi team phải có một leader và leader phải là thành viên trong team!");
        }
    }
}