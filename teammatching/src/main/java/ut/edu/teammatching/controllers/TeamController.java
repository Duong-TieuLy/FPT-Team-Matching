package ut.edu.teammatching.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // Import cho MultipartFile
import ut.edu.teammatching.dto.AssignRoleRequest;
import ut.edu.teammatching.dto.CreateTeamDTO;
import ut.edu.teammatching.models.Student;
import ut.edu.teammatching.models.Team;
import ut.edu.teammatching.models.User;
import ut.edu.teammatching.repositories.UserRepository;
import ut.edu.teammatching.services.TeamService;

import java.io.File; // Import cho File
import java.io.IOException; // Import cho IOException
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {
    private final TeamService teamService;
    private final UserRepository userRepository;

    @GetMapping
    public List<Team> getAllTeams() {
        return teamService.getAllTeams();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable Long id) {
        Optional<Team> team = teamService.getTeamById(id);
        return team.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createTeam(@RequestBody CreateTeamDTO request, Authentication authentication) {
        try {
            Team created = teamService.createTeam(
                    request.getTeamName(),
                    request.getDescription(),
                    request.getTeamType(),
                    request.getTeamPicture(),
                    authentication
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    // Endpoint upload ảnh
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file, Authentication authentication) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
        }

        try {
            String uploadDir = "teammatching/src/main/resources/static/imagespost/";
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File destination = new File(uploadDir + fileName);
            file.transferTo(destination);
            String fileUrl = "/imagespost/" + fileName;
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading file: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable Long id, @RequestBody Team team) {
        return ResponseEntity.ok(teamService.updateTeam(id, team));
    }

    @DeleteMapping("/{teamId}")
    public ResponseEntity<String> deleteTeam(@RequestParam Long leaderId,
                                             @PathVariable Long teamId) {
        teamService.deleteTeam(leaderId, teamId);
        return ResponseEntity.ok("Team deleted successfully");
    }

    @PostMapping("/{teamId}/leave")
    public ResponseEntity<String> leaveTeam(@PathVariable Long teamId, @RequestParam Long userId) {
        try {
            teamService.leaveTeam(teamId, userId);
            return ResponseEntity.ok("User has left the team successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to leave team.");
        }
    }

    @PutMapping("/{id}/leader/{studentId}")
    public ResponseEntity<Team> setLeader(@PathVariable Long id, @PathVariable Long studentId) {
        return ResponseEntity.ok(teamService.setLeader(id, studentId));
    }

    @DeleteMapping("/{id}/remove-student/{studentId}")
    public ResponseEntity<Void> removeStudent(@PathVariable Long id, @PathVariable Long studentId) {
        teamService.removeStudent(id, studentId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{teamId}/add-student")
    public ResponseEntity<?> addStudentToTeam(
            @PathVariable Long teamId,
            @RequestParam Long studentIdToAdd,
            Authentication authentication
    ) {
        String username = authentication.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Người dùng không hợp lệ");
        }

        User currentUser = userOpt.get();
        if (!(currentUser instanceof Student currentStudent)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Chỉ sinh viên mới có thể thêm thành viên vào team");
        }

        try {
            teamService.addStudent(teamId, studentIdToAdd, currentStudent.getId());
            return ResponseEntity.ok("Đã thêm sinh viên vào team");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{teamId}/assign-lecturer")
    public ResponseEntity<Team> assignLecturer(@RequestParam Long leaderId,
                                               @PathVariable Long teamId,
                                               @RequestParam Long lecturerId) {
        Team team = teamService.assignLecturer(leaderId, teamId, lecturerId);
        return ResponseEntity.ok(team);
    }

    @PostMapping("/{teamId}/assign-role")
    public ResponseEntity<?> assignRole(@RequestBody AssignRoleRequest request) {
        Team updatedTeam = teamService.assignRole(request.getLeaderId(), request.getTeamId(), request.getMemberId(), request.getRole());
        return ResponseEntity.ok(updatedTeam);
    }
}