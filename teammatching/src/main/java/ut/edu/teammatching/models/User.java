package ut.edu.teammatching.models;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table (name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false)
    private String userName;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private String fullName;

    @Lob
    private String skills;

    @Lob
    private String interests;

    @OneToMany(mappedBy = "leader", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Team> teamsLed;

    @ManyToMany(mappedBy = "members")
    private Set<Team> teamsJoined;

    public User() {}

    public User(Long userId, String userName, String password, String email, String fullName, String skills, String interests) {
        this.userId = userId;
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.fullName = fullName;
        this.skills = skills;
        this.interests = interests;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getInterests() {
        return interests;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }

    public Set<Team> getTeamsLed() {
        return teamsLed;
    }

    public void setTeamsLed(Set<Team> teamsLed) {
        this.teamsLed = teamsLed;
    }

    public Set<Team> getTeamsJoined() {
        return teamsJoined;
    }

    public void setTeamsJoined(Set<Team> teamsJoined) {
        this.teamsJoined = teamsJoined;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public enum Role {
        STUDENT, LECTURER, ADMIN;
    }
}
