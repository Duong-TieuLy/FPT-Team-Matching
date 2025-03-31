
CREATE TABLE user (
    userId BIGINT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    role ENUM('STUDENT', 'LECTURER') NOT NULL,
    fullName VARCHAR(255),
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    profilePictureUrl VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    skills TEXT,
    hobby TEXT,
    projects TEXT,
    phoneNumber VARCHAR(20)
);

-- Bảng Student (Kế thừa từ User)
CREATE TABLE student (
                         userId BIGINT PRIMARY KEY,
                         major VARCHAR(255) NOT NULL,
                         term INT NOT NULL,
                         FOREIGN KEY (userId) REFERENCES user(userId) ON DELETE CASCADE
);


CREATE TABLE lecturer (
                          userId BIGINT PRIMARY KEY,
                          department VARCHAR(255) NOT NULL,
                          ResearchAreas TEXT,
                          FOREIGN KEY (userId) REFERENCES user(userId) ON DELETE CASCADE
);

CREATE TABLE `post` (
  `post_id` bigint NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `images` text,
  `author_id` bigint DEFAULT NULL,
  `like_count` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `post_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `user` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


-- Bảng Team
CREATE TABLE Team (
                      teamId BIGINT PRIMARY KEY AUTO_INCREMENT,
                      teamName VARCHAR(255) NOT NULL,
                      teamType ENUM('ACADEMIC', 'PERSIONAL', 'LECTURER_GUIDED') NOT NULL,
                      leaderId BIGINT NOT NULL,
                      FOREIGN KEY (leaderId) REFERENCES User(userId) ON DELETE CASCADE
);

-- Bảng Role (Leader có thể tạo mới)
CREATE TABLE Role (
                      roleId BIGINT PRIMARY KEY AUTO_INCREMENT,
                      roleName VARCHAR(255) NOT NULL,
                      teamId BIGINT NOT NULL,
                      FOREIGN KEY (teamId) REFERENCES Team(teamId) ON DELETE CASCADE
);

-- Bảng Task
CREATE TABLE Task (
                      taskId BIGINT PRIMARY KEY AUTO_INCREMENT,
                      taskName VARCHAR(255) NOT NULL,
                      description TEXT,
                      status ENUM('IN_PROGRESS', 'COMPLETED', 'NOT_COMPLETED') DEFAULT 'IN_PROGRESS',
                      deadline DATE,
                      assigneeId BIGINT,
                      teamId BIGINT NOT NULL,
                      FOREIGN KEY (assigneeId) REFERENCES User(userId) ON DELETE SET NULL,
                      FOREIGN KEY (teamId) REFERENCES Team(teamId) ON DELETE CASCADE
);

-- Bảng Post


-- Bảng Comment
CREATE TABLE Comment (
                         commentId BIGINT PRIMARY KEY AUTO_INCREMENT,
                         content TEXT NOT NULL,
                         postId BIGINT NOT NULL,
                         authorId BIGINT NOT NULL,
                         FOREIGN KEY (postId) REFERENCES Post(postId) ON DELETE CASCADE,
                         FOREIGN KEY (authorId) REFERENCES User(userId) ON DELETE CASCADE
);

-- Bảng Message
CREATE TABLE Message (
                         messageId BIGINT PRIMARY KEY AUTO_INCREMENT,
                         senderId BIGINT NOT NULL,
                         receiverId BIGINT,
                         teamId BIGINT,
                         content TEXT NOT NULL,
                         FOREIGN KEY (senderId) REFERENCES User(userId) ON DELETE CASCADE,
                         FOREIGN KEY (receiverId) REFERENCES User(userId) ON DELETE CASCADE,
                         FOREIGN KEY (teamId) REFERENCES Team(teamId) ON DELETE CASCADE
);

-- Bảng Notification
CREATE TABLE Notification (
                              notificationId BIGINT PRIMARY KEY AUTO_INCREMENT,
                              content TEXT NOT NULL,
                              type ENUM('DEADLINE', 'MESSAGE', 'INVITE') NOT NULL,
                              recipientId BIGINT NOT NULL,
                              createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              isRead BOOLEAN DEFAULT FALSE,
                              FOREIGN KEY (recipientId) REFERENCES User(userId) ON DELETE CASCADE
);

-- Bảng AI_Matching (Lưu lịch sử gợi ý nhóm)
CREATE TABLE AI_Matching (
                             matchId BIGINT PRIMARY KEY AUTO_INCREMENT,
                             userId BIGINT NOT NULL,
                             suggestedTeamId BIGINT NOT NULL,
                             matchScore FLOAT NOT NULL,
                             createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                             FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE,
                             FOREIGN KEY (suggestedTeamId) REFERENCES Team(teamId) ON DELETE CASCADE
);

-- Bảng Rating (Đánh giá thành viên)
CREATE TABLE Rating (
                            ratingId BIGINT PRIMARY KEY AUTO_INCREMENT,
                            reviewerId BIGINT NOT NULL,
                            ratedUserId BIGINT NOT NULL,
                            teamId BIGINT NOT NULL,
                            rating FLOAT NOT NULL CHECK (rating BETWEEN 0 AND 5),
                            feedback TEXT,
                            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Ngày tạo đánh giá
                            ratingType ENUM('ACADEMIC', 'TEAMWORK') DEFAULT 'TEAMWORK', -- Loại đánh giá
                            FOREIGN KEY (reviewerId) REFERENCES User(userId) ON DELETE CASCADE,
                            FOREIGN KEY (ratedUserId) REFERENCES User(userId) ON DELETE CASCADE,
                            FOREIGN KEY (teamId) REFERENCES Team(teamId) ON DELETE CASCADE
);

