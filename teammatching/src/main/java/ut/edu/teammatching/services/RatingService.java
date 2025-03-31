package ut.edu.teammatching.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ut.edu.teammatching.models.Rating;
import ut.edu.teammatching.models.Student;
import ut.edu.teammatching.models.User;
import ut.edu.teammatching.enums.Role;
import ut.edu.teammatching.repositories.RatingRepository;
import ut.edu.teammatching.repositories.UserRepository;

import java.util.List;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Tạo hoặc cập nhật đánh giá
     */
    public void createOrUpdateRating(Long userId, Long studentId, Float ratingValue, String feedback) {
        // Kiểm tra xem người dùng có phải là giảng viên không
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại!"));

        if (user.getRole() != Role.LECTURER) {
            throw new SecurityException("Chỉ giảng viên mới có quyền thực hiện đánh giá!");
        }

        // Tìm sinh viên được đánh giá
        Student student = (Student) userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Sinh viên không tồn tại!"));

        // Tạo hoặc cập nhật đánh giá
        Rating rating = new Rating();
        rating.setRating(ratingValue);
        rating.setFeedback(feedback);
        rating.setRatedStudent(student);
        rating.setGivenByLecturer((ut.edu.teammatching.models.Lecturer) user);

        ratingRepository.save(rating);
    }

    /**
     * Lấy danh sách đánh giá của sinh viên
     */
    public List<Rating> getRatingsForStudent(Long studentId) {
        return ratingRepository.findByRatedStudentId(studentId);
    }
}