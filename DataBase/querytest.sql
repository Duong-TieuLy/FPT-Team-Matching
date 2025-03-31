INSERT INTO user (userName, password, role, fullName, gender, profilePictureUrl, email, skills, hobby, projects, phoneNumber) 
VALUES 
    ('john_doe', 'password123', 'STUDENT', 'John Doe', 'MALE', 'http://localhost:8080/images/profile1.jpg', 'john@example.com', 'Java, Python, SQL', 'Guitar, Coding', 'Student Management System, Chat App', '0123456789'),
    ('jane_smith', 'securepass456', 'LECTURER', 'Jane Smith', 'FEMALE', 'http://localhost:8080/images/profile2.jpg', 'jane@example.com', 'Data Science, Machine Learning', 'Reading, Cooking', 'Research Paper on AI, Data Analytics Tool', '0987654321'),
    ('alex_taylor', 'mypassword789', 'STUDENT', 'Alex Taylor', 'OTHER', 'http://localhost:8080/images/profile3.jpg', 'alex@example.com', 'Rust, Blockchain, Web Development', 'Traveling, Gaming', 'Crypto Wallet, NFT Marketplace', '0112233445');


INSERT INTO post (content, images, author_id) 
VALUES 
('Bài viết số 1', 'http://localhost:8080/imagespost/image1.jpg', 2),
('Bài viết số 2', 'http://localhost:8080/imagespost/image2.jpg', 3),
('Bài viết số 3', 'http://localhost:8080/imagespost/image3.jpg', 3),
('Bài viết số 4', 'http://localhost:8080/imagespost/image4.jpg', 2),
('Bài viết số 5', 'http://localhost:8080/imagespost/image5.jpg', 1),
('Bài viết số 6', 'http://localhost:8080/imagespost/image6.jpg', 1),
('Bài viết số 7', 'http://localhost:8080/imagespost/image7.jpg', 3),
('Bài viết số 8', 'http://localhost:8080/imagespost/image8.jpg', 2),
('Bài viết số 9', 'http://localhost:8080/imagespost/image9.jpg', 2),
('Bài viết số 10', 'http://localhost:8080/imagespost/image10.jpg', 1);
