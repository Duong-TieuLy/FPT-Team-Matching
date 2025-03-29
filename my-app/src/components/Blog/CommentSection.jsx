import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import LoginModal from '../LoginModal';

const CommentSection = ({ blogId }) => {
    const { isLoggedIn, user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/comments/blog/${blogId}`)
            .then(response => setComments(response.data))
            .catch(error => console.error('Error fetching comments:', error));
    }, [blogId]);

    const handleSubmit = () => {
        if (!isLoggedIn) {
            setShowLOGIN(true);
            return;
        }
        axios.post('http://localhost:8080/api/comments', {
            content: newComment,
            blog: { id: blogId },
            author: { id: user.id }
        }).then(response => {
            setComments([...comments, response.data]);
            setNewComment('');
        }).catch(error => console.error('Error posting comment:', error));
    };

    return (
        <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
            {comments.map(comment => (
                <div key={comment.id} className="mt-2 text-gray-700">
                    <strong>User {comment.author.id}:</strong> {comment.content}
                </div>
            ))}
            <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="w-full mt-2 p-2 border rounded-lg"
                placeholder="Write a comment..."
            />
            <button
                onClick={handleSubmit}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Add Comment
            </button>
            {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        </div>
    );
};

export default CommentSection;