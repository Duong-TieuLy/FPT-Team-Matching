package ut.edu.teammatching.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import ut.edu.teammatching.models.Blog;
import ut.edu.teammatching.repositories.BlogRepository;
import ut.edu.teammatching.repositories.UserRepository;
import java.util.List;

@RestController
@RequestMapping("/blog")
@CrossOrigin(origins = "*")
public class BlogController {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    @Autowired
    public BlogController(BlogRepository blogRepository, UserRepository userRepository) {
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        try {
            List<Blog> blogs = blogRepository.findAll();
            return ResponseEntity.ok(blogs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching posts: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        try {
            return blogRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching blog: " + e.getMessage());
        }
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createPost(@RequestBody Blog blog, @RequestParam Long userId) {
        try {
            return userRepository.findById(userId)
                    .map(user -> {
                        blog.setAuthor(user);
                        blog.setLikeCount(0); // Ensure likeCount starts at 0
                        Blog savedBlog = blogRepository.save(blog);
                        return ResponseEntity.ok(savedBlog);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating blog: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updatePost(@PathVariable Long id, @RequestBody Blog updatedBlog) {
        try {
            return blogRepository.findById(id)
                    .map(blog -> {
                        blog.setContent(updatedBlog.getContent());
                        blog.setImages(updatedBlog.getImages());
                        if (updatedBlog.getLikeCount() != null) {
                            blog.setLikeCount(updatedBlog.getLikeCount());
                        }
                        Blog savedBlog = blogRepository.save(blog);
                        return ResponseEntity.ok(savedBlog);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating blog: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        try {
            return blogRepository.findById(id)
                    .map(blog -> {
                        blogRepository.delete(blog);
                        return ResponseEntity.ok().build();
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting blog: " + e.getMessage());
        }
    }
}
