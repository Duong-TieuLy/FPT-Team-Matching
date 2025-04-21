package ut.edu.teammatching.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ut.edu.teammatching.dto.MessageDTO;
import ut.edu.teammatching.models.Message;
import ut.edu.teammatching.models.Message.MessageType;
import ut.edu.teammatching.models.Team;
import ut.edu.teammatching.models.User;
import ut.edu.teammatching.repositories.MessageRepository;
import ut.edu.teammatching.repositories.TeamRepository;
import ut.edu.teammatching.repositories.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    // Convert Message entity to MessageDTO
    private MessageDTO convertToDTO(Message message) {
        return new MessageDTO(
                message.getId(),
                message.getSender().getId(),
                message.getContent(),
                message.getSentAt(),
                message.getReceiver() != null ? message.getReceiver().getId() : null,
                message.getTeam() != null ? message.getTeam().getId() : null,
                message.getType()
        );
    }

    // Get private chat history between two users
    public List<MessageDTO> getPrivateChatHistory(Long user1, Long user2) {
        List<Message> messages = messageRepository.findBySenderIdAndReceiverIdOrderBySentAtAsc(user1, user2);
        return messages.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Get team chat history by team ID
    public List<MessageDTO> getTeamChatHistory(Long teamId) {
        List<Message> messages = messageRepository.findByTeamIdOrderBySentAtAsc(teamId);
        return messages.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Send message (both private and team messages)

    public MessageDTO sendMessage(MessageDTO messageDTO) {
        // Retrieve sender
        User sender = userRepository.findById(messageDTO.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        // Determine if the message is private or team
        Message message = new Message();
        message.setSender(sender);
        message.setContent(messageDTO.getContent());

        if (messageDTO.getMessageType() == MessageType.PRIVATE) {
            // If it's a private message, retrieve receiver
            User receiver = userRepository.findById(messageDTO.getReceiverId())
                    .orElseThrow(() -> new RuntimeException("Receiver not found"));
            message.setReceiver(receiver);
            message.setType(MessageType.PRIVATE);
        } else if (messageDTO.getMessageType() == MessageType.TEAM) {
            // If it's a team message, retrieve team
            Team team = teamRepository.findById(messageDTO.getTeamId())
                    .orElseThrow(() -> new RuntimeException("Team not found"));
            message.setTeam(team);
            message.setType(MessageType.TEAM);
        } else {
            throw new IllegalArgumentException("Invalid message type");
        }

        // Save the message to the database
        messageRepository.save(message);

        // Return the saved message as a DTO
        return convertToDTO(message);
    }
}
