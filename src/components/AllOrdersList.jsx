import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UseLoader from './loader/UseLoader';
import ApiCall from './apiCollection/ApiCall';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, ChevronLeft, ChevronRight, User, DollarSign } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AllOrdersList() {
    const [totalData, setTotalData] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState([]);
    const [loader, showLoader, hideLoader] = UseLoader();

    const handleDelete = (orderId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#A1887F',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                removeOrder(orderId);
            }
        });
    };

    const removeOrder = async (orderId) => {
        try {
            showLoader();
            // Update endpoint sesuai API Anda
            const response = await axios.delete(`${ApiCall.baseUrl}/api/orders/${orderId}`);

            if (response.status === 204 || response.status === 200) {
                const updateRows = rows.filter(row => row?.id !== orderId);
                setRows(updateRows);
                setTotalData(totalData - 1);
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Order has been deleted.',
                    confirmButtonColor: '#A1887F'
                });
            }
            hideLoader();
        } catch (error) {
            hideLoader();
            console.error('Delete error:', error);
            Swal.fire({
                icon: "error",
                title: "Request Failed",
                text: error.response?.data?.message || "Unable to delete order",
                confirmButtonColor: '#A1887F'
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                // Update endpoint sesuai API Anda
                const response = await axios.get(`${ApiCall.baseUrl}/api/orders`);
                
                console.log('Orders API Response:', response.data);
                
                // Cek struktur response
                let orders = [];
                if (Array.isArray(response.data)) {
                    orders = response.data;
                } else if (response.data.data) {
                    orders = response.data.data;
                } else if (response.data.orders) {
                    orders = response.data.orders;
                }

                // Pagination di frontend
                const startIndex = page * rowsPerPage;
                const endIndex = startIndex + rowsPerPage;
                const paginatedData = orders.slice(startIndex, endIndex);
                
                setRows(paginatedData);
                setTotalData(orders.length);
                hideLoader();
            } catch (error) {
                hideLoader();
                console.error('Fetch error:', error);
                Swal.fire({
                    icon: "error",
                    title: "Request Failed",
                    text: error.response?.data?.message || "Unable to fetch orders",
                    confirmButtonColor: '#A1887F'
                });
            }
        };
        fetchData();
    }, [page, rowsPerPage]);

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
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
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'processing': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800',
            'delivered': 'bg-purple-100 text-purple-800'
        };
        
        const colorClass = statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
        
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                {status || 'Unknown'}
            </span>
        );
    };

    const totalPages = Math.ceil(totalData / rowsPerPage);
    const startItem = totalData === 0 ? 0 : page * rowsPerPage + 1;
    const endItem = Math.min((page + 1) * rowsPerPage, totalData);

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-200">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">All Orders</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage customer orders</p>
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead style={{ backgroundColor: '#F5F5F5' }}>
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Total Amount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Updated At
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, rowIndex) => (
                                    <tr key={row?.id || rowIndex} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            #{row?.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                                                     style={{ backgroundColor: '#A1887F' }}>
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        User ID: {row?.user_id || '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold" style={{ color: '#A1887F' }}>
                                            {row?.total_amount ? formatPrice(row?.total_amount) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(row?.status)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(row?.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(row?.updated_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link to={`/admin/order-details/${row?.id}`}>
                                                    <button
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Edit2 className="w-4 h-4 text-blue-600" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(row?.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Items per page:</span>
                        <select
                            value={rowsPerPage}
                            onChange={handleChangeRowsPerPage}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#A1887F] transition-colors bg-white"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            {totalData > 0 && <option value={totalData}>All</option>}
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            {startItem}-{endItem} of {totalData}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleChangePage(page - 1)}
                                disabled={page === 0}
                                className={`p-2 rounded-lg transition-colors ${
                                    page === 0
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleChangePage(page + 1)}
                                disabled={page >= totalPages - 1}
                                className={`p-2 rounded-lg transition-colors ${
                                    page >= totalPages - 1
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {loader}
        </>
    );
}