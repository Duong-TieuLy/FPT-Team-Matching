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
@Table(name = "ai_matching")
@Getter
@Setter
public class AiMatching {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_id", nullable = false)
    private Long id;

    @OneToMany(mappedBy = "aiMatching", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AiMatchingUser> aiMatchingUsers = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "suggested_team_id", nullable = false)
    private Team suggestedTeam;

    @Column(name = "match_score", nullable = false)
    private Float matchScore;

    @Column(name = "created_at")
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
