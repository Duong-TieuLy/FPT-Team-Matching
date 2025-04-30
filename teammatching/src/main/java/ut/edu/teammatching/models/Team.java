package ut.edu.teammatching.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import ut.edu.teammatching.enums.JoinRequestStatus;
import ut.edu.teammatching.enums.TeamType;

import java.util.*;

@Getter
@Setter
@Entity
@Table(name = "teams")
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
    private String description;

    //Lưu người tạo team
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    @JsonBackReference
    private User createdBy;

    @ManyToMany
    @JoinTable(
            name = "student_team",
            joinColumns = @JoinColumn(name = "team_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    @JsonBackReference
    private List<Student> students = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lecturer_id")
    @JsonIgnoreProperties({"supervisedTeams", "givenRatings", "receivedRatings", "sentMessages"})
    private Lecturer lecturer;

    @OneToMany(mappedBy = "team", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Task> tasks = new ArrayList<>();

    // Team Leader - Người tạo nhóm
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "leader_id")
    private Student leader;

    @ElementCollection
    @CollectionTable(name = "team_roles", joinColumns = @JoinColumn(name = "team_id"))
    @MapKeyColumn(name = "user_id") // Lưu ID của User
    @Column(name = "role")
    private Map<Long, String> roles = new HashMap<>();

    @ElementCollection
    @CollectionTable(name = "join_requests", joinColumns = @JoinColumn(name = "team_id"))
    @MapKeyJoinColumn(name = "student_id")
    @Column(name = "status")
    private Map<Student, JoinRequestStatus> joinRequests = new HashMap<>();

    // Đảm bảo chỉ có một leader duy nhất
    public void setLeader(Student newLeader) {
        if (newLeader == null || !students.contains(newLeader)) {
            throw new IllegalStateException("Leader phải là một thành viên của team!");
        }
        this.leader = newLeader;
    }

    /**
     * 🔥 Kiểm tra ràng buộc: Nếu team là Academic thì phải có giảng viên
     */
    @PrePersist
    private void prePersist() {
        // Nếu không có leader → kiểm tra xem creator có phải là giảng viên không
        if (this.leader == null && !(this.createdBy instanceof Lecturer)) {
            throw new IllegalStateException("Team phải có leader hoặc được tạo bởi giảng viên!");
        }

        // Kiểm tra nếu leader không phải là thành viên của team
        if (this.leader != null && !students.contains(this.leader)) {
            throw new IllegalStateException("Leader phải là thành viên của team!");
        }
    }

    @PreUpdate
    private void preUpdate() {
        if (this.teamType == TeamType.ACADEMIC && this.lecturer == null) {
            throw new IllegalStateException("Academic Team phải có giảng viên!");
        }

        // Kiểm tra nếu leader không phải là thành viên của team
        if (this.leader != null && students.stream().noneMatch(student -> student.getId().equals(this.leader.getId()))) {
            throw new IllegalStateException("Leader phải là thành viên trong team!");
        }
    }

    public void addMember(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User không được null!");
        }

        // Kiểm tra nếu là Student
        if (user instanceof Student student) {
            // Kiểm tra xem student đã là thành viên trong team chưa
            if (!students.contains(student)) {
                students.add(student);
            }

            // Chỉ gán leader nếu team là Academic hoặc Non-Academic, và leader đang null
            if (this.leader == null && !students.isEmpty()) {
                this.leader = students.get(0); // Gán leader là sinh viên đầu tiên trong team
            }

            // Kiểm tra lại nếu leader không phải là thành viên, throw lỗi
            if (this.leader != null && !students.contains(this.leader)) {
                throw new IllegalStateException("Leader phải là thành viên của team!");
            }

        } else if (user instanceof Lecturer lecturer) {
            if (this.teamType == TeamType.ACADEMIC) {
                if (this.lecturer != null) {
                    throw new IllegalStateException("Team đã có giảng viên rồi!");
                }
                this.lecturer = lecturer;  // Gán giảng viên vào team
            } else {
                throw new IllegalStateException("Chỉ team Academic mới có giảng viên!");
            }
        } else {
            throw new IllegalArgumentException("Chỉ có thể thêm Student hoặc Lecturer!");
        }
    }

}