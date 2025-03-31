package ut.edu.teammatching.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import ut.edu.teammatching.enums.Role;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "lecturers") // Khớp với bảng lecturers trong cơ sở dữ liệu
@AllArgsConstructor
public class Lecturer extends User { // Kế thừa từ lớp cha User

    @Column(name = "department", nullable = false)
    private String department; // Khoa của giảng viên

    @Lob
    @Column(name = "research_areas")
    private String researchAreas; // Lĩnh vực nghiên cứu của giảng viên

    // Danh sách các nhóm được giảng viên giám sát
    @OneToMany(mappedBy = "lecturer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Team> supervisedTeams = new ArrayList<>();

    // Danh sách các đánh giá mà giảng viên nhận được
    @OneToMany(mappedBy = "lecturerBeingRated", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> receivedRatings = new ArrayList<>(); // Đổi tên từ ratedLecturer thành lecturerBeingRated

    // Danh sách các đánh giá do giảng viên thực hiện
    @OneToMany(mappedBy = "lecturerReviewer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> givenRatings = new ArrayList<>(); // Đổi tên từ givenByLecturer thành lecturerReviewer

    // Constructor không tham số
    public Lecturer() {
        this.setRole(Role.LECTURER); // Đặt vai trò mặc định là giảng viên
    }
}