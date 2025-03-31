package ut.edu.teammatching.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ut.edu.teammatching.models.Team;
import ut.edu.teammatching.repositories.TeamRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeamService {
    private final TeamRepository teamRepository;

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Optional<Team> getTeamById(Long id) {
        return teamRepository.findById(id);
    }

    public Team createTeam(Team team) {
        return teamRepository.save(team);
    }

    public Team updateTeam(Long id, Team teamDetails) {
        return teamRepository.findById(id).map(team -> {
            team.setTeamName(teamDetails.getTeamName());
            team.setTeamType(teamDetails.getTeamType());
            team.setDescription(teamDetails.getDescription());
            return teamRepository.save(team);
        }).orElseThrow(() -> new RuntimeException("Team not found"));
    }
    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }
}
