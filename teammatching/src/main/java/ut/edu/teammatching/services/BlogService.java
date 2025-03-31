package ut.edu.teammatching.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ut.edu.teammatching.models.Blog;
//import ut.edu.teammatching.models.User;
import ut.edu.teammatching.repositories.BlogRepository;
import ut.edu.teammatching.repositories.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class BlogService {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    @Autowired
    public BlogService(BlogRepository blogRepository, UserRepository userRepository) {
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
    }

    // Lấy tất cả posts
    public List<Blog> getAllPosts() {
        return blogRepository.findAll();
    }

    // Lấy post theo ID
    public Optional<Blog> getPostById(Long id) {
        return blogRepository.findById(id);
    }

    // Tạo post mới
    @Transactional
    public Optional<Blog> createPost(Blog blog, Long userId) {
        return userRepository.findById(userId).map(user -> {
            blog.setAuthor(user);
            blog.setLikeCount(0);
            return blogRepository.save(blog);
        });
    }

    // Cập nhật post
    @Transactional
    public Optional<Blog> updateBlog(Long id, Blog updatedBlog) {
        return blogRepository.findById(id).map(blog -> {
            blog.setContent(updatedBlog.getContent());
            blog.setImages(updatedBlog.getImages());
            if (updatedBlog.getLikeCount() != null) {
                blog.setLikeCount(updatedBlog.getLikeCount());
            }
            return blogRepository.save(blog);
        });
    }

    // Xóa post
    @Transactional
    public boolean deleteBlog(Long id) {
        return blogRepository.findById(id).map(blog -> {
            blogRepository.delete(blog);
            return true;
        }).orElse(false);
    }
}
