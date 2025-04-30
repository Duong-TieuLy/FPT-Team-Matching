package ut.edu.teammatching.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import ut.edu.teammatching.dto.team.TeamDTO;
import ut.edu.teammatching.dto.team.TeamMemberDTO;
import ut.edu.teammatching.enums.JoinRequestStatus;
import ut.edu.teammatching.enums.TeamType;
import ut.edu.teammatching.exceptions.AccessDeniedException;
import ut.edu.teammatching.models.Lecturer;
import ut.edu.teammatching.models.Student;
import ut.edu.teammatching.models.Team;
import ut.edu.teammatching.models.User;
import ut.edu.teammatching.repositories.TeamRepository;
import ut.edu.teammatching.repositories.StudentRepository;
import ut.edu.teammatching.repositories.LecturerRepository;
import org.springframework.security.core.Authentication;
import ut.edu.teammatching.repositories.UserRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TeamService {
    private final TeamRepository teamRepository;
    private final StudentRepository studentRepository;
    private final LecturerRepository lecturerRepository;
    private final UserRepository userRepository;

    // Constructor sẽ được Spring tự động gọi khi tạo instance của TeamService
    public TeamService(TeamRepository teamRepository, StudentRepository studentRepository,
                       LecturerRepository lecturerRepository, UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.studentRepository = studentRepository;
        this.lecturerRepository = lecturerRepository;
        this.userRepository = userRepository; // Inject UserRepository vào constructor
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @Transactional
    public void handleJoinRequest(Long teamId, Long studentId, boolean accept, Long userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        // Kiểm tra nếu người dùng hiện tại là leader hoặc lecturer
        boolean isLeader = team.getLeader() != null && team.getLeader().getId().equals(userId);
        boolean isLecturer = team.getLecturer() != null && team.getLecturer().getId().equals(userId);

        if (!isLeader && !isLecturer) {
            throw new RuntimeException("Chỉ leader hoặc giảng viên mới có quyền xử lý yêu cầu");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        JoinRequestStatus status = team.getJoinRequests().get(student);
        if (status == null) {
            throw new RuntimeException("Không tìm thấy yêu cầu gia nhập của sinh viên này");
        }

        if (status == JoinRequestStatus.ACCEPTED) {
            throw new RuntimeException("Yêu cầu đã được chấp nhận trước đó");
        }

        if (accept) {
            if (!team.getStudents().contains(student)) {
                team.addMember(student); // ✅ thêm thành viên vào nhóm
            }
            team.getJoinRequests().put(student, JoinRequestStatus.ACCEPTED);
        } else {
            team.getJoinRequests().put(student, JoinRequestStatus.REJECTED);
        }
        teamRepository.save(team);
    }


    public List<TeamDTO> getCommunityAvailableTeams(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        return teamRepository.findAll().stream()
                .filter(team -> !team.getStudents().contains(user))
                .map(TeamDTO::fromTeam)  // chuyển thành DTO
                .collect(Collectors.toList());
    }

    public List<TeamDTO> getTeamsOfUser(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) throw new RuntimeException("Không tìm thấy người dùng");

        User user = userOpt.get();

        // Nếu là Student => lấy danh sách team tham gia + team đang làm leader
        if (user instanceof Student student) {
            // Lấy danh sách team mà student tham gia bằng ID của team
            List<Team> joinedTeams = teamRepository.findAllByStudentsContains(student);
            List<Team> leadTeams = teamRepository.findAllByLeader(student);

            // Kết hợp các team đã tham gia và team làm leader
            Set<Team> combined = new HashSet<>();
            combined.addAll(joinedTeams);
            combined.addAll(leadTeams);

            // Chuyển đổi từ List<Team> thành List<TeamDTO>
            return convertToTeamDTOList(combined);
        }

        // Nếu là Lecturer => lấy danh sách team hướng dẫn
        if (user instanceof Lecturer lecturer) {
            List<Team> teams = teamRepository.findAllByLecturer(lecturer);
            return convertToTeamDTOList(teams);
        }

        return Collections.emptyList(); // nếu là user khác thì trả về rỗng
    }

    // Phương thức chuyển đổi từ List<Team> thành List<TeamDTO>
    private List<TeamDTO> convertToTeamDTOList(Collection<Team> teams) {
        return teams.stream()
                .map(TeamDTO::fromTeam) // Chuyển đổi từng Team thành TeamDTO
                .collect(Collectors.toList());
    }


    public void sendJoinRequest(Long teamId, Long studentId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        // Nếu sinh viên đã là thành viên
        if (team.getStudents().contains(student)) {
            throw new RuntimeException("Sinh viên đã là thành viên của nhóm!");
        }

        // Nếu sinh viên đã gửi yêu cầu rồi
        if (team.getJoinRequests().containsKey(student)) {
            JoinRequestStatus status = team.getJoinRequests().get(student);
            if (status == JoinRequestStatus.PENDING) {
                throw new RuntimeException("Yêu cầu tham gia nhóm của sinh viên đang chờ xử lý!");
            } else if (status == JoinRequestStatus.ACCEPTED) {
                throw new RuntimeException("Yêu cầu đã được chấp nhận!");
            }
        }

        // Thêm vào danh sách yêu cầu
        team.getJoinRequests().put(student, JoinRequestStatus.PENDING);
        teamRepository.save(team);
    }

    @Transactional
    public Team createTeam(String teamName, String description, TeamType teamType, String teamPicture, Authentication authentication) {
        // Lấy thông tin người dùng từ JWT token
        String username = authentication.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Không tìm thấy người dùng!");
        }

        User creator = userOpt.get();

        // Tạo team mới
        Team team = new Team();
        team.setTeamName(teamName);
        team.setDescription(description);
        team.setTeamType(teamType);
        team.setTeamPicture(teamPicture);
        team.setCreatedBy(creator);  // luôn nên gán createdBy

        // Kiểm tra xem creator là giảng viên hay sinh viên và xử lý tương ứng
        if (creator instanceof Lecturer) {
            Lecturer lecturer = (Lecturer) creator;
            team.setLecturer(lecturer);
        } else if (creator instanceof Student) {
            Student student = (Student) creator;
            if (!team.getStudents().contains(student)) {
                team.getStudents().add(student);   // Thêm vào team trước
            }
            team.setLeader(student);           // Rồi mới set leader
        }

        // Lưu team vào cơ sở dữ liệu
        return teamRepository.save(team);
    }

    public Team updateTeam(Long id, Team teamDetails) {
        return teamRepository.findById(id).map(team -> {
            team.setTeamName(teamDetails.getTeamName());
            team.setTeamType(teamDetails.getTeamType());
            team.setDescription(teamDetails.getDescription());
            team.setTeamPicture(teamDetails.getTeamPicture());
            return teamRepository.save(team);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy team!"));
    }

    // Xóa team (chỉ Leader có thể xóa)
    @Transactional
    public void deleteTeam(Long leaderId, Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        if (!team.getLeader().getId().equals(leaderId)) {
            throw new RuntimeException("Only the team leader can delete the team");
        }
        teamRepository.delete(team);
    }

    /**
     * Thiết lập leader mới cho team.
     */
    @Transactional
    public void changeLeader(Long teamId, Long currentUserId, Long newLeaderId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy team."));

        // Check xem current user có quyền đổi leader không
        boolean isCurrentLeader = team.getLeader() != null && team.getLeader().getId().equals(currentUserId);
        boolean isLecturer = team.getLecturer() != null && team.getLecturer().getId().equals(currentUserId);

        if (!isCurrentLeader && !isLecturer) {
            throw new SecurityException("Bạn không có quyền thay đổi leader.");
        }

        // Check xem newLeader có trong team chưa
        boolean isMember = team.getStudents().stream()
                .anyMatch(student -> student.getId().equals(newLeaderId));

        if (!isMember) {
            throw new IllegalArgumentException("Leader mới phải là thành viên của team.");
        }

        Student newLeader = studentRepository.findById(newLeaderId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sinh viên mới."));

        team.setLeader(newLeader);
        teamRepository.save(team);
    }

    //Rời team
    @Transactional
    public void leaveTeam(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhóm với ID: " + teamId));

        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với ID: " + userId));

        if (team.getLeader() != null && team.getLeader().equals(currentUser)) {
            throw new IllegalStateException("Leader không thể rời nhóm!");
        }

        if (currentUser instanceof Student) {
            Student student = (Student) currentUser;

            if (!team.getStudents().contains(student)) {
                throw new IllegalStateException("Sinh viên không phải là thành viên của nhóm!");
            }

            team.getStudents().remove(student);
        }

        if (currentUser instanceof Lecturer) {
            if (team.getTeamType() == TeamType.ACADEMIC && team.getLecturer().equals(currentUser)) {
                team.setLecturer(null);
            } else {
                throw new IllegalStateException("Giảng viên không phải là thành viên của nhóm này!");
            }
        }

        teamRepository.save(team);
    }


    /**
     * Xóa một sinh viên khỏi team.
     */
    @Transactional
    public void removeStudent(Long teamId, Long studentIdToRemove, Long requesterId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy team!"));

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người yêu cầu!"));

        Student studentToRemove = studentRepository.findById(studentIdToRemove)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên cần xóa!"));

        // Chỉ leader hoặc giảng viên mới được xóa thành viên
        boolean isLeader = requester.equals(team.getLeader());
        boolean isLecturer = team.getLecturer() != null && requester.equals(team.getLecturer());

        if (!isLeader && !isLecturer) {
            throw new IllegalStateException("Chỉ leader hoặc giảng viên mới có quyền xóa thành viên khỏi team!");
        }

        if (studentToRemove.equals(team.getLeader())) {
            throw new IllegalStateException("Không thể xóa leader khỏi team! Hãy chuyển leader trước.");
        }

        team.getStudents().remove(studentToRemove);
        teamRepository.save(team);
    }

    @Transactional
    public void addMember(Long teamId, Long userIdToAdd, Long requesterId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy team!"));

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người yêu cầu!"));

        User userToAdd = userRepository.findById(userIdToAdd)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người cần thêm!"));

        if (userToAdd instanceof Student studentToAdd) {

            boolean isLeader = requester instanceof Student && requester.equals(team.getLeader());
            boolean isLecturer = requester instanceof Lecturer && requester.equals(team.getLecturer());

            if (!isLeader && !isLecturer) {
                throw new IllegalStateException("Chỉ leader hoặc giảng viên mới có quyền thêm thành viên!");
            }

            if (team.getStudents().contains(studentToAdd)) {
                throw new IllegalStateException("Sinh viên này đã là thành viên của team!");
            }

            team.addMember(studentToAdd);
        }

        else if (userToAdd instanceof Lecturer lecturerToAdd) {

            if (team.getTeamType() != TeamType.ACADEMIC) {
                throw new IllegalStateException("Chỉ team Academic mới có giảng viên!");
            }

            if (team.getLecturer() != null) {
                throw new IllegalStateException("Team đã có giảng viên rồi!");
            }

            team.addMember(lecturerToAdd);
        }

        else {
            throw new IllegalArgumentException("Chỉ có thể thêm Student hoặc Lecturer!");
        }

        teamRepository.save(team);
    }

    //Phân công vai trò trong team
    @Transactional
    public Team assignRole(Long leaderId, Long teamId, Long memberId, String role) {
        // Tìm team
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy team!"));

        // Kiểm tra người gọi có phải là leader không
        if (!team.getLeader().getId().equals(leaderId)) {
            throw new RuntimeException("Chỉ có Leader mới được phân công vai trò");
        }

        // Kiểm tra xem member có trong team không
        Student member = studentRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên!"));
        if (!team.getStudents().contains(member)) {
            throw new RuntimeException("Thành viên không có trong team");
        }

        // Gán vai trò
        team.getRoles().put(memberId, role);
        return teamRepository.save(team);
    }

    public List<TeamDTO> searchTeams(String keyword) {
        return teamRepository.searchTeam(keyword).stream()
                .map(TeamDTO::fromTeam)
                .collect(Collectors.toList());
    }

    public List<TeamMemberDTO> getMembersByTeamId(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        // Tạo một danh sách thành viên bao gồm cả sinh viên và giảng viên
        List<User> members = new ArrayList<>(team.getStudents());
        if (team.getLecturer() != null) {
            members.add(team.getLecturer());
        }

        // Chuyển đổi các thành viên thành TeamMemberDTO và trả về
        return members.stream()
                .map(user -> new TeamMemberDTO(user, team)) // Truyền vào cả team để xác định vai trò
                .collect(Collectors.toList());
    }
    public int countMembers(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy team!"));

        // Kiểm tra nếu students là null để tránh NullPointerException
        return (team.getStudents() != null) ? team.getStudents().size() : 0;
    }

    public TeamDTO getTeamDtoById(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy team với ID: " + teamId));

        return TeamDTO.fromTeam(team);  // Chuyển đổi từ Team sang TeamDTO
    }

    public List<TeamMemberDTO> getMembersTask(Team team) {
        List<Student> students = team.getStudents();

        if (students == null || students.isEmpty()) {
            return Collections.emptyList();
        }

        return students.stream()
                .filter(student -> team.getLeader() == null || !student.getId().equals(team.getLeader().getId()))
                .map(student -> new TeamMemberDTO(student, team))
                .toList();
    }

    public Team getTeamById(Long teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm với ID: " + teamId));
    }

    // Phương thức lấy danh sách yêu cầu gia nhập nhóm
    public List<TeamMemberDTO> getJoinRequests(Long teamId) {
        // Lấy thông tin nhóm bằng phương thức getTeamById
        Team team = getTeamById(teamId);

        Map<Student, JoinRequestStatus> joinRequests = team.getJoinRequests();

        return joinRequests.entrySet().stream()
                .filter(entry -> entry.getValue() == JoinRequestStatus.PENDING) // Chỉ lấy yêu cầu PENDING
                .map(entry -> {
                    // Chuyển đổi Student thành TeamMemberDTO
                    return new TeamMemberDTO(entry.getKey(), team);
                })
                .collect(Collectors.toList());
    }

}
