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
        MessageDTO saved = messageService.sendMessage(messageDTO);
        System.out.println("Received message: " + messageDTO);

        // Vì receiverId là Long, không cần getId()
        messagingTemplate.convertAndSendToUser(
                saved.getReceiverId().toString(),
                "/queue/messages",
                saved
        );
    }

    @MessageMapping("/chat.team.{teamId}")
    public void handleTeamMessage(@DestinationVariable Long teamId, @Payload MessageDTO messageDTO) {
        MessageDTO saved = messageService.sendMessage(messageDTO);
        messagingTemplate.convertAndSend("/topic/team." + teamId, saved);
    }
}
