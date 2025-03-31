package ut.edu.teammatching.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import ut.edu.teammatching.enums.Role;
import ut.edu.teammatching.enums.Gender;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "student")
@DiscriminatorValue("STUDENT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Student extends User {
    @Id
    @Column(name = "user_id")
    private Long id;

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
    private List<Team> teams = new ArrayList<>();

    @OneToMany(mappedBy = "assignedToStudent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> assignedTasks = new ArrayList<>();

    @OneToMany(mappedBy = "ratedStudent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> receivedRatings = new ArrayList<>();

    @OneToMany(mappedBy = "givenByStudent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> givenRatings = new ArrayList<>();

    @OneToMany(mappedBy = "leader", cascade =  CascadeType.ALL, orphanRemoval = true)
    private List<Team> leaders = new ArrayList<>();
}
