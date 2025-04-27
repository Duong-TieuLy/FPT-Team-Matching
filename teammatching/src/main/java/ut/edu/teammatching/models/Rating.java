package ut.edu.teammatching.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonManagedReference; // Add this import

@Getter
@Setter

@Entity
@Table(name="ratings")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id", nullable = false)
    private Long id;

    @Column(name = "rating", nullable = false)
    private Float rating;

    @Lob
    @Column(name = "feedback")
    private String feedback;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "teamId", nullable = false)
    @JsonManagedReference // Add this
    private Team team;

    @ManyToOne
    @JoinColumn(name = "rated_student_id", nullable = true)
    @JsonBackReference("ratedStudentReference") // Đổi tên lại
    private Student ratedStudent;

    @ManyToOne
    @JoinColumn(name = "given_by_student_id", nullable = true)
    @JsonBackReference("givenByStudentReference") // Đổi tên lại
    private Student givenByStudent;

    @ManyToOne
    @JoinColumn(name = "rated_lecturer_id", nullable = true)
    @JsonBackReference("ratedLecturerReference") // Đổi tên lại
    private Lecturer ratedLecturer;

    @ManyToOne
    @JoinColumn(name = "given_by_lecturer_id", nullable = true)
    @JsonBackReference("givenByLecturerReference") // Đổi tên lại
    private Lecturer givenByLecturer;
}
