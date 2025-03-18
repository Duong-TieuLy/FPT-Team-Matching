package ut.edu.teammatching.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ut.edu.teammatching.models.Message;
import ut.edu.teammatching.models.User;
import ut.edu.teammatching.repositories.UserRepository;
import ut.edu.teammatching.services.MessageService;

@Controller
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final UserRepository userRepository;

    public ChatController(SimpMessagingTemplate messagingTemplate, MessageService messageService, UserRepository userRepository) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
        this.userRepository = userRepository;
    }

    @MessageMapping("/chat")
    public void sendMessage(Message message) {
        // Lưu tin nhắn vào database
        messageService.saveMessage(message);

        // Gửi tin nhắn đến người nhận (user-to-user)
        if (message.getReceiver() != null) {
            messagingTemplate.convertAndSend("/topic/chat/user/" + message.getReceiver().getId(), message);
        }

        // Gửi tin nhắn đến team chat (user-to-team)
        if (message.getTeam() != null) {
            messagingTemplate.convertAndSend("/topic/chat/team/" + message.getTeam().getId(), message);
        }
    }
}
