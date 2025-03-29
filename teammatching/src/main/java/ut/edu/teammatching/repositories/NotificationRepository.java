package ut.edu.teammatching.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ut.edu.teammatching.models.Notification;
import ut.edu.teammatching.models.User;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientAndIsReadFalse(User recipient);
    List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);
}