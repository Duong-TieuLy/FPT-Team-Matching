package ut.edu.teammatching.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import ut.edu.teammatching.enums.Role;
import ut.edu.teammatching.enums.Gender;
import com.fasterxml.jackson.annotation.JsonTypeName;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "student")
@DiscriminatorValue("STUDENT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonTypeName("STUDENT")
@PrimaryKeyJoinColumn(name = "user_id")
public class Student extends User {
    @Column(nullable = false)
    private String major;

    @Column(nullable = false)
    private Integer term;

    @ManyToMany
    @JoinTable(
            name = "student_team",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "team_id")
    )
    @JsonManagedReference
    private List<Team> teams = new ArrayList<>();

    @OneToMany(mappedBy = "assignedToStudent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> assignedTasks = new ArrayList<>();

    @OneToMany(mappedBy = "ratedStudent", cascade = CascadeType.ALL, orphanRemoval = true)
//    @JsonManagedReference("ratedStudentReference") // Đổi tên
    private List<Rating> receivedRatings = new ArrayList<>();

    @OneToMany(mappedBy = "givenByStudent", cascade = CascadeType.ALL, orphanRemoval = true)
//    @JsonManagedReference("givenByStudentReference") // Đổi tên
    private List<Rating> givenRatings = new ArrayList<>();

    @OneToMany(mappedBy = "leader", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Team> leaders = new ArrayList<>();

    // ✅ Constructor đầy đủ
    public Student(String username, String fullName, String email, String password, Role role, Gender gender,
                   String profilePicture, List<String> skills, List<String> hobbies, List<String> projects,
                   String phoneNumber, String major, Integer term) {
        super(username, fullName, email, password, role, gender, profilePicture, skills, hobbies, projects, phoneNumber);
        this.major = major;
        this.term = term;
    }
}
