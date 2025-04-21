package ut.edu.teammatching.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import ut.edu.teammatching.dto.BlogCreateRequest;
import ut.edu.teammatching.dto.BlogDTO;
import ut.edu.teammatching.dto.LikeRequest;
import ut.edu.teammatching.models.Blog;
import ut.edu.teammatching.models.Like;
import ut.edu.teammatching.models.User;
import ut.edu.teammatching.repositories.BlogRepository;
import ut.edu.teammatching.repositories.LikeRepository;
import ut.edu.teammatching.repositories.UserRepository;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "*")
public class BlogController {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    @Value("${file.upload-dir:uploads/imagespost}")
    private String uploadDir;

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
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getBlogsByUserId(@PathVariable Long userId) {
        try {
            List<Blog> blogs = blogRepository.findByAuthor_Id(userId);
            List<BlogDTO> blogDTOs = blogs.stream()
                    .map(blog -> new BlogDTO(blog)) // Chuyển đối tượng Blog thành BlogDTO
                    .collect(Collectors.toList());
            return ResponseEntity.ok(blogDTOs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching blogs: " + e.getMessage());
        }
    }
    @PostMapping
    public ResponseEntity<?> createBlog(@RequestBody BlogCreateRequest request) {
        // Validate request
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Content cannot be empty");
        }

        // Create new Blog entity
        Blog blog = new Blog();
        blog.setContent(request.getContent());

        // Tùy chọn: nếu bạn vẫn muốn gán userId từ request (không lấy từ token nữa)
        if (request.getUserId() != null) {
            User author = userRepository.findById(request.getUserId())
                    .orElse(null);
            blog.setAuthor(author);
        }

        // Handle image if provided
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            try {
                String base64 = String.valueOf(request.getImages());
                if (base64.contains(",")) {
                    base64 = base64.split(",")[1];
                }

                byte[] imageBytes = Base64.getDecoder().decode(base64);
                BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
                if (image == null) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid image format");
                }

                String fileName = UUID.randomUUID() + ".png";
                Path uploadPath = Paths.get(uploadDir);
                Path filePath = uploadPath.resolve(fileName);

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                Files.write(filePath, imageBytes);

                String fullUrl = "http://localhost:8080/imagespost/" + fileName;
                blog.setImages(fullUrl);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid base64 string");
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save image");
            }
        }

        Blog savedBlog = blogRepository.save(blog);
        return ResponseEntity.ok(savedBlog);
    }
    @Autowired
    private LikeRepository likeRepository;

    @PostMapping("/like")
    public ResponseEntity<?> toggleLike(@RequestBody LikeRequest likeRequest) {
        Long postId = likeRequest.getPostId();
        Long userId = likeRequest.getUserId();

        if (postId == null || userId == null) {
            return ResponseEntity.badRequest().body("Post ID and User ID are required.");
        }

        Blog blog = blogRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Blog not found"));

        Optional<Like> existingLike = likeRepository.findByPostIdAndUserId(postId, userId);
        if (existingLike.isPresent()) {
            // Đã like → unlike
            likeRepository.delete(existingLike.get());
            blog.setLikeCount(blog.getLikeCount() - 1);
        } else {
            // Chưa like → like
            Like newLike = new Like();
            newLike.setPostId(postId);
            newLike.setUserId(userId);
            likeRepository.save(newLike);
            blog.setLikeCount(blog.getLikeCount() + 1);
        }

        blogRepository.save(blog);
        return ResponseEntity.ok(blog);
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
