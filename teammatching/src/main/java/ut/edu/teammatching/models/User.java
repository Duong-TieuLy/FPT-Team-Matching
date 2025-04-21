package ut.edu.teammatching.models;

import com.fasterxml.jackson.annotation.*;
import ut.edu.teammatching.enums.Gender;
import ut.edu.teammatching.enums.Role;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = Student.class, name = "STUDENT"),
        @JsonSubTypes.Type(value = Lecturer.class, name = "LECTURER")
})
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Inheritance(strategy = InheritanceType.JOINED) // Kế thừa với bảng riêng cho từng subclass
@Table(name="users")

public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long id;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    @JsonIgnore // Luôn ignore password
    private String password;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    @JsonProperty("role") // 🔥 Đảm bảo Spring Boot hiểu đúng key JSON
    private Role role;

    @Column(name = "fullName")
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "email", unique = true)
    private String email;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "user_skills", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "skill")
    @BatchSize(size = 10) // Hạn chế số lượng join
    private List<String> skills = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "user_hobbies", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "hobby")
    @BatchSize(size = 10)
    private List<String> hobbies = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "user_projects", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "project")
    @BatchSize(size = 10)
    private List<String> projects = new ArrayList<>();

    @Column(name = "phoneNumber", length = 20, unique = true )
    private String phoneNumber;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("author")
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("author")
    private List<Blog> blogs = new ArrayList<>();

    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"recipient", "sender"})
    private List<Notification> receivedNotifications;

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"recipient", "sender"})
    private List<Notification> sentNotifications;

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"sender", "receiver"})
    private List<Message> sentMessages = new ArrayList<>();

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"sender", "receiver"})
    private List<Message> receivedMessages = new ArrayList<>();

    @OneToMany(mappedBy = "requester")
    @JsonManagedReference
    private Set<Friend> sentFriendRequests;

    @OneToMany(mappedBy = "receiver")
    @JsonManagedReference
    private Set<Friend> receivedFriendRequests;

    public User(String username, String fullName, String email, String password, Role role, Gender gender,
                String profilePicture, List<String> skills,
                List<String> hobbies, List<String> projects, String phoneNumber) {
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.gender = gender;
        this.profilePicture = profilePicture;

        this.skills = skills;
        this.hobbies = hobbies;
        this.projects = projects;

        // Nếu phoneNumber là null hoặc rỗng, có thể để null hoặc giá trị mặc định
        this.phoneNumber = (phoneNumber == null || phoneNumber.isBlank())
                ? null
                : phoneNumber;
    }
}