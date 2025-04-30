package ut.edu.teammatching.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ut.edu.teammatching.dto.MessageDTO;
import ut.edu.teammatching.services.MessageService;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;

    @MessageMapping("/chat.private")
    public void handlePrivateMessage(@Payload MessageDTO messageDTO) {
        // Log thông tin tin nhắn
        System.out.println("Received message: " + messageDTO);

        // Lưu và nhận lại DTO đã convert (có id, sentAt)
        MessageDTO saved = messageService.sendMessage(messageDTO);
        System.out.println("save message: " + saved);

        // Kiểm tra thông tin của saved
        if (saved == null) {
            System.out.println("Message was not saved correctly.");
            return;
        }

        // Sử dụng `saved` để lấy senderId & receiverId
        Long senderId = saved.getSenderId();
        Long receiverId = saved.getReceiverId();

        // Đảm bảo senderId < receiverId
        Long user1 = Math.min(senderId, receiverId);
        Long user2 = Math.max(senderId, receiverId);

        // Tạo kênh chung cho 2 người dùng
        String channel = "/topic/private/" + user1 + "-" + user2;
        System.out.println("Sending message to channel: " + channel);

        // Gửi DTO đã convert
        messagingTemplate.convertAndSend(channel, saved);
    }



    @MessageMapping("/chat.team.{teamId}")
    public void handleTeamMessage(@DestinationVariable Long teamId, @Payload MessageDTO messageDTO) {
        MessageDTO saved = messageService.sendMessage(messageDTO);
        messagingTemplate.convertAndSend("/topic/team." + teamId, saved);
    }
}