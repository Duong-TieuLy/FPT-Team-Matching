package ut.edu.teammatching.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ut.edu.teammatching.models.Rating;
import ut.edu.teammatching.models.Student;
import ut.edu.teammatching.models.Lecturer;
import ut.edu.teammatching.models.Team;
import ut.edu.teammatching.repositories.RatingRepository;

import java.util.List;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private TeamService teamService;

    public Rating createStudentToStudentRating(Long givenByStudentId, Long ratedStudentId, Long teamId, Float rating, String feedback) {
        Student givenByStudent = (Student) userService.getUserById(givenByStudentId);
        Student ratedStudent = (Student) userService.getUserById(ratedStudentId);
        Team team = teamService.getTeamById(teamId).orElseThrow(() -> new RuntimeException("Team not found"));

        Rating ratingObj = new Rating();
        ratingObj.setGivenByStudent(givenByStudent);
        ratingObj.setRatedStudent(ratedStudent);
        ratingObj.setTeam(team);
        ratingObj.setRating(rating);
        ratingObj.setFeedback(feedback);
        return ratingRepository.save(ratingObj);
    }

    public Rating createLecturerToStudentRating(Long givenByLecturerId, Long ratedStudentId, Long teamId, Float rating, String feedback) {
        Lecturer givenByLecturer = (Lecturer) userService.getUserById(givenByLecturerId);
        Student ratedStudent = (Student) userService.getUserById(ratedStudentId);
        Team team = teamService.getTeamById(teamId).orElseThrow(() -> new RuntimeException("Team not found"));

        Rating ratingObj = new Rating();
        ratingObj.setGivenByLecturer(givenByLecturer);
        ratingObj.setRatedStudent(ratedStudent);
        ratingObj.setTeam(team);
        ratingObj.setRating(rating);
        ratingObj.setFeedback(feedback);
        return ratingRepository.save(ratingObj);
    }

    public Rating createStudentToLecturerRating(Long givenByStudentId, Long ratedLecturerId, Long teamId, Float rating, String feedback) {
        Student givenByStudent = (Student) userService.getUserById(givenByStudentId);
        Lecturer ratedLecturer = (Lecturer) userService.getUserById(ratedLecturerId);
        Team team = teamService.getTeamById(teamId).orElseThrow(() -> new RuntimeException("Team not found"));

        Rating ratingObj = new Rating();
        ratingObj.setGivenByStudent(givenByStudent);
        ratingObj.setRatedLecturer(ratedLecturer);
        ratingObj.setTeam(team);
        ratingObj.setRating(rating);
        ratingObj.setFeedback(feedback);
        return ratingRepository.save(ratingObj);
    }

    public List<Rating> getStudentRatings(Long studentId) {
        Student ratedStudent = (Student) userService.getUserById(studentId);
        return ratingRepository.findByRatedStudent(ratedStudent);
    }

    public List<Rating> getLecturerRatings(Long lecturerId) {
        Lecturer ratedLecturer = (Lecturer) userService.getUserById(lecturerId);
        return ratingRepository.findByRatedLecturer(ratedLecturer);
    }

    public List<Rating> getTeamRatings(Long teamId) {
        Team team = teamService.getTeamById(teamId).orElseThrow(() -> new RuntimeException("Team not found"));
        return ratingRepository.findByTeam(team);
    }
}