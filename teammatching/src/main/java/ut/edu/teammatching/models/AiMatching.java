package ut.edu.teammatching.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "AI_Matching")
@Getter
@Setter
public class AiMatching {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "matchId", nullable = false)
    private Long id;

    @OneToMany(mappedBy = "aiMatching", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AiMatchingUser> aiMatchingUsers = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "suggestedTeamId", nullable = false)
    private Team suggestedTeam;

    @Column(name = "matchScore", nullable = false)
    private Float matchScore;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "createdAt")
    private Instant createdAt;
}