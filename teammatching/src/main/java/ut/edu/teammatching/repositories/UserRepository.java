package ut.edu.teammatching.repositories;

import lombok.NonNull;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ut.edu.teammatching.models.User;
import ut.edu.teammatching.enums.Role;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @EntityGraph(attributePaths = {
        "blogs"
    })
    Optional<User> findByUsername(String username);
    Optional<User> findById(long id);
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
    boolean existsByUsername(String username);
    long countByRole(Role role);

    // Kiểm tra username đã tồn tại chưa
//    boolean existsByUsername(String username);

    // Tìm user và load danh sách bài blog (dùng EntityGraph để Eager Fetch)
    @EntityGraph(attributePaths = {"blogs"})
    @NonNull
    Optional<User> findById(@NonNull Long id);

    // Tìm kiếm user theo keyword (JPQL thay vì nativeQuery)
    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<User> searchUsers(String keyword);
}