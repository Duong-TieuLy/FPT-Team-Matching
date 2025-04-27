package ut.edu.teammatching.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import ut.edu.teammatching.enums.Role;
import ut.edu.teammatching.enums.Gender;
import com.fasterxml.jackson.annotation.JsonTypeName;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "lecturers")
@AllArgsConstructor
@JsonTypeName("LECTURER")
@PrimaryKeyJoinColumn(name = "user_id")
public class Lecturer extends User {
    @Column(name = "department", nullable = true)
    private String department;

    @Lob
    @Column(name = "research_areas")
    private String researchAreas;

    @OneToMany(mappedBy = "lecturer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Team> supervisedTeams = new ArrayList<>();

    @OneToMany(mappedBy = "ratedLecturer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> receivedRatings = new ArrayList<>();

    @OneToMany(mappedBy = "givenByLecturer", cascade = CascadeType.ALL, orphanRemoval = true)

    private List<Rating> givenRatings = new ArrayList<>();

    // ✅ Constructor đầy đủ thông tin
    public Lecturer(String username, String fullName, String email, String password,
                    Role role, Gender gender, String profilePicture, List<String> skills,
                    List<String> hobbies, List<String> projects, String phoneNumber,
                    String department, String researchAreas) {
        super(username, fullName, email, password, role, gender, profilePicture, skills, hobbies, projects, phoneNumber);
        this.department = department;
        this.researchAreas = researchAreas;
    }

    // ✅ Constructor mặc định (không có tham số)
    public Lecturer() {
        this.setRole(Role.LECTURER);
    }
}
