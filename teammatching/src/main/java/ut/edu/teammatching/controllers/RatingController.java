package ut.edu.teammatching.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ut.edu.teammatching.models.Rating;
import ut.edu.teammatching.services.RatingService;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @PostMapping("/student-to-student")
    public ResponseEntity<Rating> createStudentToStudentRating(
            @RequestParam Long givenByStudentId,
            @RequestParam Long ratedStudentId,
            @RequestParam Long teamId,
            @RequestParam Float rating,
            @RequestParam(required = false) String feedback) {
        Rating ratingObj = ratingService.createStudentToStudentRating(givenByStudentId, ratedStudentId, teamId, rating, feedback);
        return ResponseEntity.ok(ratingObj);
    }

    @PostMapping("/lecturer-to-student")
    public ResponseEntity<Rating> createLecturerToStudentRating(
            @RequestParam Long givenByLecturerId,
            @RequestParam Long ratedStudentId,
            @RequestParam Long teamId,
            @RequestParam Float rating,
            @RequestParam(required = false) String feedback) {
        Rating ratingObj = ratingService.createLecturerToStudentRating(givenByLecturerId, ratedStudentId, teamId, rating, feedback);
        return ResponseEntity.ok(ratingObj);
    }

    @PostMapping("/student-to-lecturer")
    public ResponseEntity<Rating> createStudentToLecturerRating(
            @RequestParam Long givenByStudentId,
            @RequestParam Long ratedLecturerId,
            @RequestParam Long teamId,
            @RequestParam Float rating,
            @RequestParam(required = false) String feedback) {
        Rating ratingObj = ratingService.createStudentToLecturerRating(givenByStudentId, ratedLecturerId, teamId, rating, feedback);
        return ResponseEntity.ok(ratingObj);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Rating>> getStudentRatings(@PathVariable Long studentId) {
        List<Rating> ratings = ratingService.getStudentRatings(studentId);
        return ResponseEntity.ok(ratings);
    }

    @GetMapping("/lecturer/{lecturerId}")
    public ResponseEntity<List<Rating>> getLecturerRatings(@PathVariable Long lecturerId) {
        List<Rating> ratings = ratingService.getLecturerRatings(lecturerId);
        return ResponseEntity.ok(ratings);
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<Rating>> getTeamRatings(@PathVariable Long teamId) {
        List<Rating> ratings = ratingService.getTeamRatings(teamId);
        return ResponseEntity.ok(ratings);
    }
}