package ut.edu.teammatching.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ut.edu.teammatching.models.Notification;
import ut.edu.teammatching.services.NotificationService;
import ut.edu.teammatching.services.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    // Lấy thông báo chưa đọc
    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@RequestParam Long userId) {
        User recipient = userService.getUserById(userId);
        List<Notification> notifications = notificationService.getUnreadNotifications(recipient);
        return ResponseEntity.ok(notifications);
    }

    // Lấy tất cả thông báo
    @GetMapping("/all")
    public ResponseEntity<List<Notification>> getAllNotifications(@RequestParam Long userId) {
        User recipient = userService.getUserById(userId);
        List<Notification> notifications = notificationService.getAllNotifications(recipient);
        return ResponseEntity.ok(notifications);
    }

    // Đánh dấu thông báo là đã đọc
    @PostMapping("/mark-as-read/{id}")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}