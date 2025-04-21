package ut.edu.teammatching.dto;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ut.edu.teammatching.models.Lecturer;
import ut.edu.teammatching.models.Student;
import ut.edu.teammatching.models.User;
import ut.edu.teammatching.dto.LecturerDetailDTO;
import ut.edu.teammatching.dto.StudentDetailDTO;

import java.util.List;

@Data
@Getter
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String role; // Dùng String để nhận "STUDENT" hoặc "LECTURER"
    private String gender;
    private String profilePicture;
    private String phoneNumber;
    private List<String> skills;
    private List<String> hobbies;
    private List<String> projects;

    private Object userID; // 👈 đổi sang Object để linh hoạt


    public UserDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = user.getRole().name();
        this.gender = String.valueOf(user.getGender());
        this.fullName = user.getFullName();
        this.phoneNumber = user.getPhoneNumber();
        this.profilePicture = user.getProfilePicture();
        this.skills = user.getSkills();
        this.hobbies = user.getHobbies();
        this.projects = user.getProjects();

        if (user instanceof Student student) {
            this.userID = new StudentDetailDTO(student);
        } else if (user instanceof Lecturer lecturer) {
            this.userID = new LecturerDetailDTO(lecturer);
        }
    }

    public static UserDTO fromUser(User user) {
        return new UserDTO(user);
    }
    public UserDTO(Long id, String fullName) {
        this.id = id;
        this.fullName = fullName;
    }
} 