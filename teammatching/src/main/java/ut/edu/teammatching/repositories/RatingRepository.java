package ut.edu.teammatching.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ut.edu.teammatching.models.Rating;
import ut.edu.teammatching.models.Student;
import ut.edu.teammatching.models.Lecturer;
import ut.edu.teammatching.models.Team;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByTeam(Team team);
    List<Rating> findByRatedStudent(Student ratedStudent);
    List<Rating> findByGivenByStudent(Student givenByStudent);
    List<Rating> findByRatedLecturer(Lecturer ratedLecturer);
    List<Rating> findByGivenByLecturer(Lecturer givenByLecturer);
}