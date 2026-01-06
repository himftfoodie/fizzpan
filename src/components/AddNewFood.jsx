import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import ApiCall from './apiCollection/ApiCall';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import UseLoader from './loader/UseLoader';
import DefaultAdminImage from '../assets/img/defaultImg.png';

const AddNewFood = () => {
    const navigate = useNavigate();
    const hiddenFileInput = useRef(null);
    const [loader, showLoader, hideLoader] = UseLoader();
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        image: '',
        base64: ''
    });

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const compressImage = (file, maxWidth = 600, quality = 0.5) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Resize lebih agresif - max 600px
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    
                    // Jika tinggi masih terlalu besar
                    if (height > maxWidth) {
                        width = (width * maxWidth) / height;
                        height = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress dengan quality lebih rendah (50%)
                    let compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                    
                    // Jika masih terlalu besar, compress lagi
                    const sizeInKB = Math.round((compressedBase64.length * 3) / 4 / 1024);
                    console.log('Compressed size:', sizeInKB, 'KB');
                    
                    if (sizeInKB > 300) {
                        // Compress lagi dengan quality lebih rendah
                        compressedBase64 = canvas.toDataURL('image/jpeg', 0.3);
                        console.log('Re-compressed size:', Math.round((compressedBase64.length * 3) / 4 / 1024), 'KB');
                    }
                    
                    resolve(compressedBase64);
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        if (name === 'image') {
            const file = e.target.files[0];
            
            if (file) {
                // Validasi ukuran file (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'File too large',
                        text: 'Please select an image smaller than 5MB',
                    });
                    return;
                }

                // Compress image
                showLoader();
                const compressedBase64 = await compressImage(file);
                hideLoader();
                
                console.log('Original size:', file.size, 'bytes');
                console.log('Compressed size:', Math.round((compressedBase64.length * 3) / 4), 'bytes');
                
                setFormData({ ...formData, base64: compressedBase64 });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const onSubmit = async () => {
        showLoader();

        try {
            console.log('Form Data:', formData);
            console.log('API Endpoint:', ApiCall.product);

            // Validasi: pastikan ada nama dan harga
            if (!formData.name || !formData.price) {
                hideLoader();
                Swal.fire({
                    icon: 'warning',
                    title: 'Incomplete Data',
                    text: 'Please fill in all required fields',
                });
                return;
            }

            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                image: formData.base64 || formData.image || ''
            };

            // Cek ukuran data
            const dataSize = new Blob([JSON.stringify(productData)]).size;
            console.log('Request size:', (dataSize / 1024).toFixed(2), 'KB');
            
            if (dataSize > 1024 * 1024) { // 1MB
                hideLoader();
                Swal.fire({
                    icon: 'warning',
                    title: 'Image too large',
                    text: 'Please select a smaller image or reduce quality',
                });
                return;
            }

            console.log('Product Data to send:', { ...productData, image: 'base64...' });

            const token = localStorage.getItem('token');
            
            const response = await axios.post(ApiCall.product, productData, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            console.log('Response:', response);

            if (response.status === 200 || response.status === 201) {
                hideLoader();
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Product has been added successfully',
                }).then(() => {
                    navigate("/admin/food-list");
                });
            }

        } catch (error) {
            hideLoader();
            
            console.error('Submit error:', error);
            console.error('Error response:', error.response);
            console.error('Error data:', error.response?.data);
            console.error('Error status:', error.response?.status);
            
            let errorMessage = "Failed to add product. Please try again.";
            let errorTitle = "Request Failed";
            
            if (error.response?.status === 413) {
                errorTitle = "Image Too Large";
                errorMessage = "The image is too large. Please select a smaller image (recommended < 500KB)";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Swal.fire({
                icon: "error",
                title: errorTitle,
                text: errorMessage,
                footer: error.response?.status ? `Status: ${error.response.status}` : ''
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
                    <h1 className="text-2xl font-semibold" style={{ color: '#A1887F' }}>Add New Product</h1>
                    <div className="w-16 h-0.5 mt-2" style={{ backgroundColor: '#A1887F' }}></div>
                </div>

                {/* Form Container */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-6">
                            
                            {/* Product Image Picker */}
                            <div className="flex justify-center">
                                <div className="text-center">
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#A1887F' }}>
                                        Product Image
                                    </label>
                                    <div 
                                        onClick={handleClick} 
                                        className="w-32 h-32 mx-auto border-2 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
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
                                            name="image" 
                                            onChange={handleChange} 
                                            ref={hiddenFileInput} 
                                            className="hidden"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Click to upload image</p>
                                </div>
                            </div>

                            {/* Product Name Field */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: '#A1887F' }}>
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    {...register('name', { 
                                        required: 'Product name is required',
                                        minLength: {
                                            value: 3,
                                            message: 'Product name must be at least 3 characters'
                                        }
                                    })}
                                    onInput={handleChange}
                                    className={inputClass(errors.name)}
                                    placeholder="Enter product name"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Description Field */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: '#A1887F' }}>
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    {...register('description', { 
                                        required: 'Description is required',
                                        minLength: {
                                            value: 10,
                                            message: 'Description must be at least 10 characters'
                                        }
                                    })}
                                    onInput={handleChange}
                                    rows={4}
                                    className={`${inputClass(errors.description)} resize-none`}
                                    placeholder="Enter product description"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                                )}
                            </div>

                            {/* Price Field */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: '#A1887F' }}>
                                    Price (Rp) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    {...register('price', { 
                                        required: 'Price is required',
                                        min: { 
                                            value: 0, 
                                            message: 'Price must be positive' 
                                        }
                                    })}
                                    onInput={handleChange}
                                    className={inputClass(errors.price)}
                                    placeholder="Enter product price"
                                    min="0"
                                    step="1000"
                                />
                                {errors.price && (
                                    <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">Enter price in Indonesian Rupiah</p>
                            </div>

                            {/* Stock Field */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: '#A1887F' }}>
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    {...register('stock', { 
                                        required: 'Stock is required',
                                        min: { 
                                            value: 0, 
                                            message: 'Stock must be positive' 
                                        }
                                    })}
                                    onInput={handleChange}
                                    className={inputClass(errors.stock)}
                                    placeholder="Enter stock quantity"
                                    min="0"
                                    step="1"
                                />
                                {errors.stock && (
                                    <p className="mt-1 text-sm text-red-500">{errors.stock.message}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">Available stock quantity</p>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full text-white font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-opacity focus:outline-none shadow-md"
                                    style={{ backgroundColor: '#A1887F' }}
                                >
                                    Add Product to System
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {loader}
        </div>
    );
};

export default AddNewFood;