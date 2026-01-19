import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import UseLoader from './loader/UseLoader';
import { TrendingUp, DollarSign, ShoppingBag, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AllRevenue() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        cancelledOrders: 0,
        totalProducts: 0,
        totalUsers: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loader, showLoader, hideLoader] = UseLoader();

    useEffect(() => {
        const fetchStats = async () => {
            showLoader();
            try {
                // Fetch all orders
                const { data: orders, error: ordersError } = await supabase
                    .from('orders')
                    .select('*');

                if (ordersError) throw ordersError;

                // Calculate revenue from completed orders
                const completedOrders = orders?.filter(o => o.status === 'completed') || [];
                const pendingOrders = orders?.filter(o => o.status === 'pending') || [];
                const cancelledOrders = orders?.filter(o => o.status === 'cancelled') || [];
                const totalRevenue = completedOrders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

                // Fetch products count
                const { count: productsCount, error: productsError } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true });

                if (productsError) throw productsError;

                // Fetch users count
                const { count: usersCount, error: usersError } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                if (usersError) throw usersError;

                // Fetch recent completed orders
                const { data: recent, error: recentError } = await supabase
                    .from('orders')
                    .select(`
                        *,
                        profile:user_id (username)
                    `)
                    .eq('status', 'completed')
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (recentError) throw recentError;

                setStats({
                    totalRevenue,
                    totalOrders: orders?.length || 0,
                    completedOrders: completedOrders.length,
                    pendingOrders: pendingOrders.length,
                    cancelledOrders: cancelledOrders.length,
                    totalProducts: productsCount || 0,
                    totalUsers: usersCount || 0
                });
                setRecentOrders(recent || []);
                hideLoader();
            } catch (error) {
                hideLoader();
                console.error('Fetch error:', error);
                // Don't show error popup, just show empty state
            }
        };
        fetchStats();
    }, []);

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
            month: 'short',
            day: 'numeric'
        });
    };

    const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgColor}`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Revenue Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Overview of your business performance</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={DollarSign}
                        title="Total Revenue"
                        value={formatPrice(stats.totalRevenue)}
                        color="text-green-600"
                        bgColor="bg-green-100"
                    />
                    <StatCard
                        icon={ShoppingBag}
                        title="Total Orders"
                        value={stats.totalOrders}
                        color="text-blue-600"
                        bgColor="bg-blue-100"
                    />
                    <StatCard
                        icon={TrendingUp}
                        title="Total Products"
                        value={stats.totalProducts}
                        color="text-purple-600"
                        bgColor="bg-purple-100"
                    />
                    <StatCard
                        icon={Users}
                        title="Total Users"
                        value={stats.totalUsers}
                        color="text-orange-600"
                        bgColor="bg-orange-100"
                    />
                </div>

                {/* Order Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Completed Orders</p>
                                <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
                            </div>
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Pending Orders</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                            </div>
                            <Clock className="w-10 h-10 text-yellow-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Cancelled Orders</p>
                                <p className="text-3xl font-bold text-red-600">{stats.cancelledOrders}</p>
                            </div>
                            <XCircle className="w-10 h-10 text-red-500" />
                        </div>
                    </div>
                </div>

                {/* Recent Completed Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Completed Orders</h2>
                        <p className="text-sm text-gray-500">Latest successful transactions</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead style={{ backgroundColor: '#F5F5F5' }}>
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Order ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            No completed orders yet
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{order.profile?.username || 'Unknown'}</td>
                                            <td className="px-6 py-4 text-sm font-bold" style={{ color: '#A1887F' }}>
                                                {formatPrice(order.total_amount)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{formatDate(order.created_at)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {loader}
        </>
    );
}
