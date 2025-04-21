package ut.edu.teammatching.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import ut.edu.teammatching.models.Like;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByPostIdAndUserId(Long postId, Long userId);
    void deleteByPostIdAndUserId(Long postId, Long userId);
}
