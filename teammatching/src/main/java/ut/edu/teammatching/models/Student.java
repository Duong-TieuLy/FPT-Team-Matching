package ut.edu.teammatching.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import ut.edu.teammatching.enums.Gender;
import ut.edu.teammatching.enums.Role;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name="student")
@AllArgsConstructor
public class Student extends User {
    @Column(name = "major")
    private String major;

    @Column(name = "term")
    private Integer term;

    @ManyToMany
    @JoinTable(
            name = "student_team",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "team_id")
    )
    private List<Team> teams = new ArrayList<>();

    @OneToMany(mappedBy = "assignedToStudent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> assignedTasks = new ArrayList<>();

    @OneToMany(mappedBy = "ratedStudent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> receivedRatings = new ArrayList<>();

    @OneToMany(mappedBy = "givenByStudent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> givenRatings = new ArrayList<>();

    @OneToMany(mappedBy = "leader", cascade =  CascadeType.ALL, orphanRemoval = true)
    private List<Team> leaders = new ArrayList<>();

    public Student() {
        this.setRole(Role.STUDENT);
    }
}
