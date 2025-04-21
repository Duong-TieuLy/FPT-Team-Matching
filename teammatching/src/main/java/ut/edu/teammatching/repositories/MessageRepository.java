package ut.edu.teammatching.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ut.edu.teammatching.models.Message;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Get private chat history between two users
    List<Message> findBySenderIdAndReceiverIdOrderBySentAtAsc(Long senderId, Long receiverId);

    // Get team chat history by team ID
    List<Message> findByTeamIdOrderBySentAtAsc(Long teamId);
}
