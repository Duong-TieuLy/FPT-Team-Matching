package ut.edu.teammatching.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // Import cho MultipartFile
import ut.edu.teammatching.dto.*;
import ut.edu.teammatching.dto.team.CreateTeamDTO;
import ut.edu.teammatching.dto.team.JoinRequestResponse;
import ut.edu.teammatching.dto.team.TeamDTO;
import ut.edu.teammatching.dto.team.TeamMemberDTO;
import ut.edu.teammatching.exceptions.AccessDeniedException;
import ut.edu.teammatching.models.Team;
import ut.edu.teammatching.models.User;
import ut.edu.teammatching.repositories.TeamRepository;
import ut.edu.teammatching.repositories.UserRepository;
import ut.edu.teammatching.services.TeamService;

import java.io.File; // Import cho File
import java.io.IOException; // Import cho IOException
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {
    private final TeamService teamService;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    @GetMapping
    public List<Team> getAllTeams() {
        return teamService.getAllTeams();
    }

    /**
     * ✅ Endpoint cho leader chấp nhận hoặc từ chối yêu cầu tham gia nhóm
     */
    @PostMapping("/{teamId}/join-requests/{studentId}/handle")
    public ResponseEntity<?> handleStudentJoinRequest(
            @PathVariable Long teamId,
            @PathVariable Long studentId,
            @RequestParam boolean accept,
            Authentication authentication
    ) {
        String username = authentication.getName(); // Lấy username từ JWT token

        // Kiểm tra nếu user hợp lệ
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Người dùng không hợp lệ");
        }

        Long userId = userOpt.get().getId();  // Lấy userId từ User object

        try {
            teamService.handleJoinRequest(teamId, studentId, accept, userId);
            String message = accept ? "Đã chấp nhận yêu cầu gia nhập nhóm." : "Đã từ chối yêu cầu gia nhập nhóm.";
            return ResponseEntity.ok(message);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/community-available")
    public ResponseEntity<List<TeamDTO>> getCommunityAvailableTeams(Authentication authentication) {
        String username = authentication.getName();
        List<TeamDTO> availableTeams = teamService.getCommunityAvailableTeams(username);
        return ResponseEntity.ok(availableTeams);
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<TeamDTO>> getTeamsOfUser(@PathVariable String username) {
        List<TeamDTO> teamDTOs = teamService.getTeamsOfUser(username);
        if (teamDTOs.isEmpty()) {
            return ResponseEntity.noContent().build(); // Nếu không tìm thấy đội nhóm
        }
        return ResponseEntity.ok(teamDTOs); // Trả về danh sách đội nhóm
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

    @DeleteMapping("/{teamId}/leave")
    public ResponseEntity<String> leaveTeam(@PathVariable Long teamId, @RequestParam Long userId) {
        try {
            teamService.leaveTeam(teamId, userId);
            return ResponseEntity.ok("User has left the team successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to leave team.");
        }
    }

    @PutMapping("/{teamId}/change-leader")
    public ResponseEntity<String> changeLeader(
            @PathVariable Long teamId,
            @RequestParam Long currentUserId,
            @RequestParam Long newLeaderId) {

        teamService.changeLeader(teamId, currentUserId, newLeaderId);
        return ResponseEntity.ok("Đã đổi leader thành công.");
    }

    @DeleteMapping("/{teamId}/remove-student")
    public ResponseEntity<String> removeStudentFromTeam(
            @PathVariable Long teamId,
            @RequestParam Long studentIdToRemove,
            Authentication authentication) {

        String username = authentication.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Người dùng không hợp lệ");
        }

        User currentUser = userOpt.get();

        try {
            teamService.removeStudent(teamId, studentIdToRemove, currentUser.getId());
            return ResponseEntity.ok("Đã xóa sinh viên khỏi team.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{teamId}/add-student")
    public ResponseEntity<String> addStudentToTeam(
            @PathVariable Long teamId,
            @RequestParam Long studentIdToAdd,
            Authentication authentication) {

        String username = authentication.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Người dùng không hợp lệ");
        }

        User currentUser = userOpt.get();

        try {
            teamService.addMember(teamId, studentIdToAdd, currentUser.getId());
            return ResponseEntity.ok("Đã thêm sinh viên vào team.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{teamId}/assign-role")
    public ResponseEntity<?> assignRole(@RequestBody AssignRoleRequest request) {
        Team updatedTeam = teamService.assignRole(request.getLeaderId(), request.getTeamId(), request.getMemberId(), request.getRole());
        return ResponseEntity.ok(updatedTeam);
    }

    @PostMapping("/teams/{teamId}/join")
    public ResponseEntity<JoinRequestResponse> sendJoinRequest(
            @PathVariable Long teamId,
            @RequestParam Long studentId) {

        try {
            teamService.sendJoinRequest(teamId, studentId);
            return ResponseEntity.ok(new JoinRequestResponse(true, "Yêu cầu tham gia nhóm đã được gửi!"));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(new JoinRequestResponse(false, ex.getMessage()));
        }
    }

    // Lấy danh sách sinh viên đã gửi yêu cầu vào nhóm
    @GetMapping("/{teamId}/join-requests")
    public ResponseEntity<List<TeamMemberDTO>> getJoinRequests(@PathVariable Long teamId) {
        try {
            List<TeamMemberDTO> joinRequests = teamService.getJoinRequests(teamId);
            return ResponseEntity.ok(joinRequests);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Trả về lỗi nếu không tìm thấy nhóm
        }
    }

    @GetMapping("/{teamId}/members")
    public ResponseEntity<List<TeamMemberDTO>> getMembersByTeamId(@PathVariable Long teamId) {
        try {
            List<TeamMemberDTO> members = teamService.getMembersByTeamId(teamId);
            return ResponseEntity.ok(members);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null);
        }
    }
    @GetMapping("/{teamId}/members/count")
    public int countMembers(@PathVariable Long teamId) {
        return teamService.countMembers(teamId);
    }

    @GetMapping("/{teamId}")
    public ResponseEntity<TeamDTO> getTeamDtoById(@PathVariable Long teamId) {
        try {
            TeamDTO teamDTO = teamService.getTeamDtoById(teamId);  // Gọi phương thức để lấy TeamDTO
            return ResponseEntity.ok(teamDTO);  // Trả về TeamDTO nếu tìm thấy
        } catch (RuntimeException e) {
            // Nếu không tìm thấy team, trả về lỗi 404
            return ResponseEntity.status(404).body(null);
        }
    }

    @GetMapping("/{teamId}/members/task")
    public ResponseEntity<List<TeamMemberDTO>> getMembersExcludingLeaderAndLecturer(@PathVariable Long teamId) {
        Team team = teamService.getTeamById(teamId); // 🔥 Lấy team từ service

        List<TeamMemberDTO> members = teamService.getMembersTask(team);

        return ResponseEntity.ok(members);
    }
}
