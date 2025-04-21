package ut.edu.teammatching.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ut.edu.teammatching.models.Message.MessageType;
import ut.edu.teammatching.models.Team;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {

    private Long id;
    private Long senderId;
    private String content;
    private Instant timestamp;
    private Long receiverId;  // For private messages, the receiver will be set
    private Long teamId;      // For group messages, the team will be set
    private MessageType messageType;
}
