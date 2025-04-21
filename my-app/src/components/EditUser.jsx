import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';

const EditUser = ({ userId, onClose }) => {
    const { token } = useAuth();
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        profilePicture: '',
        gender: '',
        phoneNumber: '',
        hobbies: [],
        projects: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Lấy thông tin user hiện tại
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Cập nhật userData với dữ liệu từ API
                setUserData({
                    fullName: response.data.fullName || '',
                    email: response.data.email || '',
                    profilePicture: response.data.profilePicture || '',
                    gender: response.data.gender || '',
                    phoneNumber: response.data.phoneNumber || '',
                    hobbies: response.data.hobbies || [],
                    projects: response.data.projects || [],
                });
            } catch (err) {
                setError('Không thể lấy thông tin user');
                console.error(err);
            }
        };
        if (userId && token) {
            fetchUser();
        }
    }, [userId, token]);

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    // Xử lý thay đổi cho các trường mảng (hobbies, projects)
    const handleArrayChange = (e, field) => {
        const value = e.target.value.split(',').map((item) => item.trim()).filter(item => item); // Loại bỏ phần tử rỗng
        setUserData((prev) => ({ ...prev, [field]: value }));
    };

    // Gửi yêu cầu cập nhật user
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`http://localhost:8080/api/users/${userId}`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Cập nhật thông tin user thành công!');
            onClose(); // Đóng form sau khi cập nhật
        } catch (err) {
            setError('Có lỗi xảy ra khi cập nhật user');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Chỉnh sửa thông tin user</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Họ tên</label>
                        <input
                            type="text"
                            name="fullName"
                            value={userData.fullName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Ảnh đại diện (URL)</label>
                        <input
                            type="text"
                            name="profilePicture"
                            value={userData.profilePicture}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Giới tính</label>
                        <select
                            name="gender"
                            value={userData.gender}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">-- Chọn --</option>
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                            <option value="OTHER">Khác</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Số điện thoại</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={userData.phoneNumber}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Sở thích (cách nhau bằng dấu phẩy)</label>
                        <input
                            type="text"
                            value={userData.hobbies.join(', ')}
                            onChange={(e) => handleArrayChange(e, 'hobbies')}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Dự án (cách nhau bằng dấu phẩy)</label>
                        <input
                            type="text"
                            value={userData.projects.join(', ')}
                            onChange={(e) => handleArrayChange(e, 'projects')}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            disabled={loading}
                        >
                            {loading ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;