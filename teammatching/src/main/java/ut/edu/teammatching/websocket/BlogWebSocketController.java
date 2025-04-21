package ut.edu.teammatching.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ut.edu.teammatching.dto.LikeUpdateMessage;

@Controller
@RequiredArgsConstructor
public class BlogWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/like") // tương ứng với "/app/like"
    public void sendLikeUpdate(LikeUpdateMessage message) {
        // Gửi thông báo tới tất cả client
        messagingTemplate.convertAndSend("/topic/likeUpdated", message);
    }
}