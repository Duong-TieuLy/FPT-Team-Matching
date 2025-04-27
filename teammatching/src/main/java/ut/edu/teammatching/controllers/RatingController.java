package ut.edu.teammatching.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ut.edu.teammatching.dto.RatingRequestDTO;
import ut.edu.teammatching.models.Lecturer;
import ut.edu.teammatching.models.Rating;
import ut.edu.teammatching.models.Student;
import ut.edu.teammatching.models.Team;
import ut.edu.teammatching.repositories.LecturerRepository;
import ut.edu.teammatching.repositories.RatingRepository;
import ut.edu.teammatching.repositories.StudentRepository;
import ut.edu.teammatching.repositories.TeamRepository;
import ut.edu.teammatching.services.RatingService;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private LecturerRepository lecturerRepository;

    // Tạo đánh giá mới
    @PostMapping
    public ResponseEntity<?> createRating(@RequestBody Rating rating) {
        System.out.println("Received rating: " + rating);

        // Kiểm tra nếu rating hoặc rating.rating là null
        if (rating == null || rating.getRating() == null) {
            return ResponseEntity.badRequest().body("Rating is required.");
        }

        // Đảm bảo feedback không null, có thể đặt giá trị mặc định nếu cần
        if (rating.getFeedback() == null) {
            rating.setFeedback("");  // Hoặc có thể là giá trị mặc định khác
        }

        // Map team
        Team team = teamRepository.findById(rating.getTeam().getId())
                .orElseThrow(() -> new RuntimeException("Team not found"));
        rating.setTeam(team);

        // Map ratedStudent nếu có
        if (rating.getRatedStudent() != null) {
            Student ratedStudent = studentRepository.findById(rating.getRatedStudent().getId())
                    .orElseThrow(() -> new RuntimeException("Rated student not found"));
            rating.setRatedStudent(ratedStudent);
        }

        // Map givenByStudent nếu có
        if (rating.getGivenByStudent() != null) {
            Student givenByStudent = studentRepository.findById(rating.getGivenByStudent().getId())
                    .orElseThrow(() -> new RuntimeException("Given-by student not found"));
            rating.setGivenByStudent(givenByStudent);
        }

        // Map ratedLecturer nếu có
        if (rating.getRatedLecturer() != null) {
            Lecturer ratedLecturer = lecturerRepository.findById(rating.getRatedLecturer().getId())
                    .orElseThrow(() -> new RuntimeException("Rated lecturer not found"));
            rating.setRatedLecturer(ratedLecturer);
        }

        // Map givenByLecturer nếu có
        if (rating.getGivenByLecturer() != null) {
            Lecturer givenByLecturer = lecturerRepository.findById(rating.getGivenByLecturer().getId())
                    .orElseThrow(() -> new RuntimeException("Given-by lecturer not found"));
            rating.setGivenByLecturer(givenByLecturer);
        }

        // Save rating
        ratingRepository.save(rating);
        return ResponseEntity.ok("Rating created successfully!");
    }

    // Các endpoint khác sẽ giống như trước
}
