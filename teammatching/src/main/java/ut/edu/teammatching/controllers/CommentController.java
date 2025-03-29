package ut.edu.teammatching.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ut.edu.teammatching.models.Comment;
import ut.edu.teammatching.services.CommentService;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment) {
        Comment savedComment = commentService.createComment(comment);
        return ResponseEntity.ok(savedComment);
    }

    @GetMapping("/blog/{blogId}")
    public ResponseEntity<List<Comment>> getCommentsByBlogId(@PathVariable Long blogId) {
        List<Comment> comments = commentService.getCommentsByBlogId(blogId);
        return ResponseEntity.ok(comments);
    }
}