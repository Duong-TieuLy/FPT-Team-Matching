package ut.edu.teammatching.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ut.edu.teammatching.models.Team;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
}
