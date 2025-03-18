package ut.edu.teammatching.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name="lecturers")
public class Lecturer extends User {
    @Column(name = "department", nullable = false)
    private String department;

    @Lob
    @Column(name = "research_areas")
    private String researchAreas;

    @OneToMany(mappedBy = "lecturer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Team> supervisedTeams = new ArrayList<>();

    @OneToMany(mappedBy = "ratedLecturer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> receivedRatings = new ArrayList<>();

    @OneToMany(mappedBy = "givenByLecturer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> givenRatings = new ArrayList<>();
}