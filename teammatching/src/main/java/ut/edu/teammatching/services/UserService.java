package ut.edu.teammatching.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ut.edu.teammatching.repositories.UserRepository;
import ut.edu.teammatching.models.User;
import java.util.List;
import ut.edu.teammatching.enums.Role;
import ut.edu.teammatching.models.Student;
import ut.edu.teammatching.models.Lecturer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ut.edu.teammatching.exceptions.ResourceNotFoundException;
import ut.edu.teammatching.dto.UserDTO;

@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final PasswordEncoder passwordEncoder;


    //lay dnah sach tat ca users
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::new)
                .toList(); // or .collect(Collectors.toList()) if you use older Java
    }
    public static UserDTO convertToDTO(User user) {
        return new UserDTO(user);
    }
    //lay thong tin user theo id
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(()     -> new ResourceNotFoundException("User not found with id: " + id));
    }

    //lay thong tin user theo username
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Tìm kiếm user theo từ khóa
    public List<User> searchUsers(String keyword) {
        return userRepository.searchUsers(keyword);
    }

    //tao moi user
    public User createUser(User user) {

        logger.info("📌 Received request to create user: {}", user);

        User newUser;

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        if (user.getRole() == Role.STUDENT) {
            if (!(user instanceof Student student)) {
                throw new RuntimeException("Invalid user data for student");
            }
            if (student.getMajor() == null || student.getMajor().isEmpty()) {
                throw new RuntimeException("Major is required for students");
            }

            newUser = new Student(
                    student.getUsername(), student.getFullName(), student.getEmail(), student.getPassword(),
                    student.getRole(), student.getGender(), student.getProfilePicture(),
                    student.getSkills(), student.getHobbies(), student.getProjects(), student.getPhoneNumber(),
                    student.getMajor(), student.getTerm()
            );
        } else if (user.getRole() == Role.LECTURER) {
            Lecturer lecturer = (Lecturer) user; // Ép kiểu User thành Lecturer
            newUser = new Lecturer(lecturer.getUsername(), lecturer.getFullName(), lecturer.getEmail(), lecturer.getPassword(),
                    lecturer.getRole(), lecturer.getGender(), lecturer.getProfilePicture(),
                    lecturer.getSkills(), lecturer.getHobbies(), lecturer.getProjects(), lecturer.getPhoneNumber(),
                    lecturer.getDepartment(), lecturer.getResearchAreas());
        } else {
            throw new IllegalArgumentException("Invalid role: " + user.getRole());
        }

        return userRepository.save(user);
    }
    //cap nhat thong tin user
    public User updateUser(Long id, User newUserData) {
        User user = getUserById(id);
        user.setUsername(newUserData.getUsername());
        user.setEmail(newUserData.getEmail());
        user.setSkills(newUserData.getSkills());
        user.setHobbies(newUserData.getHobbies());
        if (newUserData.getPassword() != null && !newUserData.getPassword().isEmpty()) {
            user.setPassword(newUserData.getPassword());
        }
        return userRepository.save(user);
    }

    //xoa user theo id
    public void deleteUser(Long id) {
        if(!userRepository.existsById(id)){
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }

}
