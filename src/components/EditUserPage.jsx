import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApiCall from '../components/apiCollection/ApiCall.js';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import UseLoader from '../components/loader/UseLoader.jsx';

export default function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loader, showLoader, hideLoader] = UseLoader();
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: 'user' // default role
    });

    useEffect(() => {
        fetchUserData();
    }, [id]);

    const fetchUserData = async () => {
        try {
            showLoader();
            const response = await axios.get(`${ApiCall.baseUrl}/api/profile/${id}`);
            setFormData({
                username: response.data.username,
                email: response.data.email,
                role: response.data.role || 'user'
            });
            hideLoader();
        } catch (error) {
            hideLoader();
            Swal.fire({
                icon: 'error',
                title: 'Failed to fetch user data',
                text: error.response?.data?.message || 'Something went wrong'
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            showLoader();
            const response = await axios.put(`${ApiCall.baseUrl}/api/profile/${id}`, formData);
            
            if (response.status === 200) {
                hideLoader();
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User role updated successfully',
                    confirmButtonColor: '#A1887F'
                }).then(() => {
                    navigate('/admin');
                });
            }
        } catch (error) {
            hideLoader();
            Swal.fire({
                icon: 'error',
                title: 'Failed to update user',
                text: error.response?.data?.message || 'Something went wrong'
            });
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit User Role</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        value={formData.username}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role *
                    </label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A1887F]"
                        required
                    >
                        <option value="user">User (Customer)</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="flex-1 bg-[#A1887F] text-white py-2 rounded-lg font-semibold hover:bg-[#8D6E63] transition"
                    >
                        Update Role
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin')}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
            {loader}
        </div>
    );
}