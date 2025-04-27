package ut.edu.teammatching.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RatingRequestDTO {

    @JsonProperty("feedback")
    private String feedback;

    @JsonProperty("given_by_lecturer_id")
    private Long givenByLecturerId;

    @JsonProperty("given_by_student_id")
    private Long givenByStudentId;

    @JsonProperty("rated_lecturer_id")
    private Long ratedLecturerId;

    @JsonProperty("rated_student_id")
    private Long ratedStudentId;

    @JsonProperty("rating")
    private Long rating;

    @JsonProperty("team_id")
    private Long teamId;
}
