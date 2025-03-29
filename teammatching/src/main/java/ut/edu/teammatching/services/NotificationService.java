package ut.edu.teammatching.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ut.edu.teammatching.enums.NotificationType;
import ut.edu.teammatching.models.Notification;
import ut.edu.teammatching.repositories.NotificationRepository;
import ut.edu.teammatching.models.User;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // Tạo thông báo mới
    public Notification createNotification(User sender, User recipient, String content, NotificationType type) {
        Notification notification = new Notification();
        notification.setSender(sender);
        notification.setRecipient(recipient);
        notification.setContent(content);
        notification.setType(type);
        notification.setIsRead(false);
        return notificationRepository.save(notification);
    }

    // Lấy danh sách thông báo chưa đọc
    public List<Notification> getUnreadNotifications(User recipient) {
        return notificationRepository.findByRecipientAndIsReadFalse(recipient);
    }

    // Lấy tất cả thông báo của người nhận
    public List<Notification> getAllNotifications(User recipient) {
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(recipient);
    }

    // Đánh dấu thông báo là đã đọc
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
}