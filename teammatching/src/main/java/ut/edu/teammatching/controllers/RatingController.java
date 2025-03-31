package ut.edu.teammatching.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ut.edu.teammatching.services.RatingService;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    /**
     * API để giảng viên thêm/cập nhật đánh giá
     */
    @PostMapping("/create")
    public ResponseEntity<?> createRating(
            @RequestParam Long userId,
            @RequestParam Long studentId,
            @RequestParam Float ratingValue,
            @RequestParam String feedback) {
        try {
            ratingService.createOrUpdateRating(userId, studentId, ratingValue, feedback);
            return ResponseEntity.ok("Đánh giá đã được thêm hoặc cập nhật thành công!");
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}