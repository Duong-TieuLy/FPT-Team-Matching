package ut.edu.teammatching.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ut.edu.teammatching.repositories.UserRepository;
import ut.edu.teammatching.models.User;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    //lay dnah sach tat ca users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    //lay thong tin user theo id
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    //lay thong tin user theo username
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }
    //tao moi user
    public User createUser(User user) {
        if(userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        return userRepository.save(user);
    }
    //cap nhat thong tin user
    public User updateUser(Long id, User newUserData) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(newUserData.getUsername());
            user.setEmail(newUserData.getEmail());
            user.setPassword(newUserData.getPassword());
            user.setSkills(newUserData.getSkills());
            user.setHobbies(newUserData.getHobbies());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    //xoa user theo id
    public void deleteUser(Long id) {
        if(!userRepository.existsById(id)){
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }
}
