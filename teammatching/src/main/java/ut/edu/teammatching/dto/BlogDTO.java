package ut.edu.teammatching.dto;

import ut.edu.teammatching.models.Blog;

public class BlogDTO {
    private String title;
    private String content;
    private String image;  // Thêm trường image cho bài viết
    private String authorName;
    private Integer likeCount;

    public BlogDTO(Blog blog) {
        this.title = blog.getContent();  // Assuming you want to use a separate 'title' field, you may need to adjust this.
        this.content = blog.getContent();  // If you have the full content here, no need to change.
        this.authorName = blog.getAuthor().getFullName();
        this.likeCount = blog.getLikeCount();  // Fixed: Change from String to Integer as it was an Integer in Blog model
        this.image = blog.getImages();  // Lấy thông tin ảnh từ Blog (do bạn đã set trong frontend)
    }

    // Getters and setters (optional if using lombok)
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public Integer getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }
}
