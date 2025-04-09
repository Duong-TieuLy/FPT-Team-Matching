package ut.edu.teammatching.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ut.edu.teammatching.repositories.UserRepository;
import ut.edu.teammatching.models.User;
import ut.edu.teammatching.models.Student;
import ut.edu.teammatching.models.Lecturer;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    // Lấy danh sách tất cả users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Lấy thông tin user theo id
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Lấy thông tin user theo username
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Tìm kiếm user theo từ khóa
    public List<User> searchUsers(String keyword) {
        return userRepository.searchUsers(keyword);
    }

    // Tạo mới user
    public User createUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        return userRepository.save(user);
    }

    // Cập nhật thông tin user (chung)
    public User updateUser(Long id, User newUserData) {
        validateRequiredFields(newUserData); // Kiểm tra thông tin bắt buộc
        validateUniqueUserData(newUserData); // Kiểm tra trùng lặp
        return userRepository.findById(id).map(user -> {
            user.setUsername(newUserData.getUsername());
            user.setEmail(newUserData.getEmail());
            user.setSkills(newUserData.getSkills());
            user.setHobbies(newUserData.getHobbies());
            if (newUserData.getPassword() != null && !newUserData.getPassword().isEmpty()) {
                user.setPassword(newUserData.getPassword()); // Nên mã hóa password trước khi lưu
            }
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Cập nhật thông tin Student
    public Student updateStudent(Long id, Student newStudentData) {
        validateStudentData(newStudentData); // Gọi validate để kiểm tra dữ liệu đầu vào
        return userRepository.findById(id).map(user -> {
            if (user instanceof Student student) {
                student.setMajor(newStudentData.getMajor());
                student.setTerm(newStudentData.getTerm());
                return userRepository.save(student);
            } else {
                throw new RuntimeException("User is not a Student");
            }
        }).orElseThrow(() -> new RuntimeException("Student not found"));
    }

    // Cập nhật thông tin Lecturer
    public Lecturer updateLecturer(Long id, Lecturer newLecturerData) {
        validateLecturerData(newLecturerData); // Gọi validate để kiểm tra dữ liệu đầu vào
        return userRepository.findById(id).map(user -> {
            if (user instanceof Lecturer lecturer) {
                lecturer.setDepartment(newLecturerData.getDepartment());
                lecturer.setResearchAreas(newLecturerData.getResearchAreas());
                return userRepository.save(lecturer);
            } else {
                throw new RuntimeException("User is not a Lecturer");
            }
        }).orElseThrow(() -> new RuntimeException("Lecturer not found"));
    }

    // Xóa user theo id
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    // Validate thông tin duy nhất
    public void validateUniqueUserData(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
    }

    // Validate thông tin bắt buộc
    public void validateRequiredFields(User user) {
        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            throw new RuntimeException("Username is required");
        }
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (user.getRole() == null) {
            throw new RuntimeException("Role is required");
        }
    }

    // Validate thông tin Student
    public void validateStudentData(Student student) {
        if (student.getMajor() == null || student.getMajor().isEmpty()) {
            throw new RuntimeException("Major is required");
        }
        if (student.getTerm() == null || student.getTerm() <= 0) {
            throw new RuntimeException("Term must be a positive integer");
        }
    }

    // Validate thông tin Lecturer
    public void validateLecturerData(Lecturer lecturer) {
        if (lecturer.getDepartment() == null || lecturer.getDepartment().isEmpty()) {
            throw new RuntimeException("Department is required");
        }
        if (lecturer.getResearchAreas() != null && lecturer.getResearchAreas().length() > 500) {
            throw new RuntimeException("Research areas is too long");
        }
    }
}