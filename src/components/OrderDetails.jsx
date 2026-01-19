import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Swal from 'sweetalert2';
import UseLoader from './loader/UseLoader';
import { Package, User, Calendar, CreditCard, ArrowLeft, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loader, showLoader, hideLoader] = UseLoader();
    const [order, setOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        showLoader();
        try {
            // Fetch order with user profile
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .select(`
                    *,
                    profile:user_id (id, username, avatar_url)
                `)
                .eq('id', id)
                .single();

            if (orderError) throw orderError;
            setOrder(orderData);
            setStatus(orderData.status || 'pending');

            // Fetch order items with product details
            const { data: itemsData, error: itemsError } = await supabase
                .from('order_items')
                .select(`
                    *,
                    product:product_id (id, name, price, image)
                `)
                .eq('order_id', id);

            if (itemsError) throw itemsError;
            setOrderItems(itemsData || []);

            setIsLoading(false);
            hideLoader();
        } catch (error) {
            hideLoader();
            console.error('Fetch error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to load order data',
                confirmButtonColor: '#A1887F'
            }).then(() => {
                navigate('/admin/all-orders-list');
            });
        }
    };

    const handleStatusUpdate = async () => {
        showLoader();
        try {
            const { error } = await supabase
                .from('orders')
                .update({
                    status: status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;

            hideLoader();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Order status updated successfully',
                confirmButtonColor: '#A1887F'
            });

            // Refresh data
            fetchOrderDetails();
        } catch (error) {
            hideLoader();
            console.error('Update error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Request Failed',
                text: error.message || 'Failed to update order status',
                confirmButtonColor: '#A1887F'
            });
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '-';
        return new Date(timestamp).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusIcon = (statusValue) => {
        switch (statusValue) {
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'processing':
                return <Truck className="w-5 h-5 text-blue-500" />;
            case 'cancelled':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-yellow-500" />;
        }
    };

    const getStatusColor = (statusValue) => {
        switch (statusValue) {
            case 'completed':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'processing':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'cancelled':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white p-4 md:p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#A1887F' }}></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <button
                            onClick={() => navigate('/admin/all-orders-list')}
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Orders
                        </button>
                    </div>
                    <h1 className="text-2xl font-semibold" style={{ color: '#A1887F' }}>Order Details</h1>
                    <div className="w-16 h-0.5 mt-2" style={{ backgroundColor: '#A1887F' }}></div>
                </div>

                {/* Order Summary Card */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Order #{order?.id}</h2>
                            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(order?.created_at)}
                            </p>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(order?.status)}`}>
                            {getStatusIcon(order?.status)}
                            <span className="font-medium capitalize">{order?.status || 'Pending'}</span>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {order?.profile?.avatar_url ? (
                                <img src={order.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-6 h-6 text-gray-400" />
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">{order?.profile?.username || 'Unknown User'}</p>
                            <p className="text-sm text-gray-500">Customer</p>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5" style={{ color: '#A1887F' }} />
                        Order Items
                    </h3>

                    <div className="space-y-4">
                        {orderItems.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No items found</p>
                        ) : (
                            orderItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        {item.product?.image ? (
                                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800">{item.product?.name || `Product #${item.product_id}`}</h4>
                                        <p className="text-sm text-gray-500">
                                            {formatPrice(item.price)} × {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold" style={{ color: '#A1887F' }}>
                                            {formatPrice(item.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Total */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-medium text-gray-600">Total Amount</span>
                            <span className="text-2xl font-bold" style={{ color: '#A1887F' }}>
                                {formatPrice(order?.total_amount || orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Update Status */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Order Status</h3>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A1887F] bg-white"
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                            onClick={handleStatusUpdate}
                            className="px-6 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-md"
                            style={{ backgroundColor: '#A1887F' }}
                        >
                            Update Status
                        </button>
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => navigate('/admin/all-orders-list')}
                        className="px-6 py-3 text-gray-700 font-medium rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-all"
                    >
                        Back to All Orders
                    </button>
                </div>
            </div>
            {loader}
        </div>
    );
}
