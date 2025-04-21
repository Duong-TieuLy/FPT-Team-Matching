package ut.edu.teammatching.dto;

import lombok.Data;

@Data
public class LikeUpdateMessage {
    private Long postId;
    private int likeCount;
}