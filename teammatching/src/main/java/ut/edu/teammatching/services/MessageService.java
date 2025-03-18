package ut.edu.teammatching.services;

import org.springframework.stereotype.Service;
import ut.edu.teammatching.models.Message;
import ut.edu.teammatching.models.Team;
import ut.edu.teammatching.models.User;
import ut.edu.teammatching.repositories.MessageRepository;

import java.util.List;

@Service
public class MessageService {
    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    public List<Message> getMessagesForUser(User user) {
        return messageRepository.findByReceiver(user);
    }

    public List<Message> getMessagesForTeam(Team team) {
        return messageRepository.findByTeam(team);
    }
}
