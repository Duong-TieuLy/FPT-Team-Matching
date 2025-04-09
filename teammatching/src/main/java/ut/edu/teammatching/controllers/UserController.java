package ut.edu.teammatching.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ut.edu.teammatching.models.Lecturer;
import ut.edu.teammatching.models.Student;
import ut.edu.teammatching.models.User;
import ut.edu.teammatching.services.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // Lấy danh sách tất cả users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Lấy thông tin user theo ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // Lấy thông tin theo username
    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    // Tìm kiếm user theo keyword
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String keyword) {
        return ResponseEntity.ok(userService.searchUsers(keyword));
    }

    // Tạo mới user
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    // Cập nhật thông tin user (gộp cả logic cập nhật Student và Lecturer)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
        if (user instanceof Student) {
            return ResponseEntity.ok(userService.updateStudent(id, (Student) user));
        } else if (user instanceof Lecturer) {
            return ResponseEntity.ok(userService.updateLecturer(id, (Lecturer) user));
        } else {
            return ResponseEntity.ok(userService.updateUser(id, user));
        }
    }

    // Xóa user theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Cập nhật riêng Student
    @PutMapping("/student/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student student) {
        return ResponseEntity.ok(userService.updateStudent(id, student));
    }

    // Cập nhật riêng Lecturer
    @PutMapping("/lecturer/{id}")
    public ResponseEntity<Lecturer> updateLecturer(@PathVariable Long id, @RequestBody Lecturer lecturer) {
        return ResponseEntity.ok(userService.updateLecturer(id, lecturer));
    }
}