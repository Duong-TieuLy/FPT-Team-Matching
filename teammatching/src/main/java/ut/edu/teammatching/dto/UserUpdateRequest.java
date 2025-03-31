package ut.edu.teammatching.dto;

import lombok.Data;
import ut.edu.teammatching.enums.Gender;

@Data
public class UserUpdateRequest {
    private String fullName;
    private Gender gender;
    private String profilePictureUrl;
    private String email;
    private String skills;
    private String hobby;
    private String projects;
    private String phoneNumber;
} 