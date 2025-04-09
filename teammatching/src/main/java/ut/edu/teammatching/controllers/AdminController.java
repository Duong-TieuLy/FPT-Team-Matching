package ut.edu.teammatching.controllers;

import ut.edu.teammatching.enums.Role;
import ut.edu.teammatching.models.*;
import ut.edu.teammatching.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String keyword) {
        return ResponseEntity.ok(adminService.searchUsers(keyword));
    }

    @GetMapping("/users/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable Role role) {
        return ResponseEntity.ok(adminService.getUsersByRole(role));
    }

    @PostMapping("/users/{userId}/lock")
    public ResponseEntity<?> lockUser(@PathVariable Long userId) {
        adminService.lockUser(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{userId}/unlock")
    public ResponseEntity<?> unlockUser(@PathVariable Long userId) {
        adminService.unlockUser(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }

    // Team Management
    @GetMapping("/teams")
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(adminService.getAllTeams());
    }

    // Blog Management
    @GetMapping("/blogs")
    public ResponseEntity<List<Blog>> getAllBlogs() {
        return ResponseEntity.ok(adminService.getAllBlogs());
    }

    @DeleteMapping("/blogs/{blogId}")
    public ResponseEntity<?> deleteBlog(@PathVariable Long blogId) {
        adminService.deleteBlog(blogId);
        return ResponseEntity.ok().build();
    }
}