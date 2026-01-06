import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import ApiCall from './apiCollection/ApiCall';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import UseLoader from './loader/UseLoader';
import DefaultAdminImage from '../assets/img/defaultImg.png';

export default function AddNewUser() {
  const navigate = useNavigate();
  const hiddenFileInput = useRef(null);
  const [loader, showLoader, hideLoader] = UseLoader();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const [formData, setFormData] = useState({
    username: '',
    role: 'user',
    avatar_url: '',
    base64: ''
  });

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'avatar_url') {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData({ ...formData, base64: reader.result });
      };
    }
    else if (name === 'role') {
      setFormData({ ...formData, [name]: value });
      setValue('role', value);
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onSubmit = async () => {
    showLoader();
    try {
      // Prepare data untuk API
      const dataToSend = {
        username: formData.username,
        role: formData.role,
        avatar_url: formData.base64 || formData.avatar_url
      };

      const response = await axios.post(`${ApiCall.baseUrl}/api/profile`, dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200 || response.status === 201) {
        hideLoader();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User has been added successfully",
        }).then(() => {
          navigate("/admin");
        });
      }
    } catch (error) {
      hideLoader();
      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text: error.response?.data?.message || "Failed to add user. Please try again.",
      });
    }
  };

  const inputClass = (hasError) => `w-full px-3 py-2.5 border rounded focus:outline-none transition-colors bg-white ${
    hasError ? 'border-red-400' : 'border-gray-300 focus:border-[#A1887F]'
  }`;

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold" style={{ color: '#A1887F' }}>Add New User</h1>
          <div className="w-16 h-0.5 mt-2" style={{ backgroundColor: '#A1887F' }}></div>
        </div>

        {/* Form Container */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              
              {/* Avatar Image Picker */}
              <div className="flex justify-center">
                <div className="text-center">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#A1887F' }}>
                    Profile Picture
                  </label>
                  <div 
                    onClick={handleClick} 
                    className="w-32 h-32 mx-auto border-2 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ borderColor: '#A1887F' }}
                  >
                    {formData.base64 ? (
                      <img src={formData.base64} alt="Uploaded" className="w-full h-full object-cover" />
                    ) : (
                      <img src={DefaultAdminImage} alt="Default" className="w-full h-full object-cover" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      name="avatar_url" 
                      onInput={handleChange} 
                      ref={hiddenFileInput} 
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Click to upload avatar</p>
                </div>
              </div>

              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#A1887F' }}>
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  {...register('username', { 
                    required: 'Username is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters'
                    }
                  })}
                  onInput={handleChange}
                  className={inputClass(errors.username)}
                  placeholder="Enter username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Username will be used for login</p>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#A1887F' }}>
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  {...register('role', { required: 'Role is required' })}
                  onChange={handleChange}
                  className={`${inputClass(errors.role)} appearance-none bg-white`}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Select user role in the system</p>
              </div>


              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full text-white font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-opacity focus:outline-none shadow-md"
                  style={{ backgroundColor: '#A1887F' }}
                >
                  Add User to System
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {loader}
    </div>
  );
}