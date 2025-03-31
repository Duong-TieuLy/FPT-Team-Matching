package ut.edu.teammatching.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ut.edu.teammatching.models.Team;
import ut.edu.teammatching.repositories.TeamRepository;
import ut.edu.teammatching.services.TeamService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {
    private final TeamService teamService;

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
    public ResponseEntity<Team> createTeam(@RequestBody Team team) {
        return ResponseEntity.ok(teamService.createTeam(team));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable Long id, @RequestBody Team team) {
        return ResponseEntity.ok(teamService.updateTeam(id, team));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Team> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.ok().build();
    }
}
