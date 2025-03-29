package ut.edu.teammatching.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ut.edu.teammatching.models.Comment;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByBlogId(Long blogId);
}