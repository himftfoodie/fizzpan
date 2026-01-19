import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import UseLoader from './loader/UseLoader';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, ChevronLeft, ChevronRight, Package, ShoppingBag } from 'lucide-react';
import Swal from 'sweetalert2';

export default function OrderItem() {
    const [totalData, setTotalData] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [loader, showLoader, hideLoader] = UseLoader();

    const handleDelete = (itemId) => {
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
                removeOrderItem(itemId);
            }
        });
    };

    const removeOrderItem = async (itemId) => {
        try {
            showLoader();
            const { error } = await supabase
                .from('order_items')
                .delete()
                .eq('id', itemId);

            if (error) throw error;

            const updatedItems = allItems.filter(row => row?.id !== itemId);
            setAllItems(updatedItems);
            setTotalData(updatedItems.length);

            const startIndex = page * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            setRows(updatedItems.slice(startIndex, endIndex));

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Order item has been deleted.',
                confirmButtonColor: '#A1887F'
            });
            hideLoader();
        } catch (error) {
            hideLoader();
            console.error('Delete error:', error);
            Swal.fire({
                icon: "error",
                title: "Request Failed",
                text: error.message || "Unable to delete order item",
                confirmButtonColor: '#A1887F'
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                const { data: orderItems, error } = await supabase
                    .from('order_items')
                    .select(`
                        *,
                        product:product_id (name, price)
                    `)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setAllItems(orderItems || []);
                setTotalData(orderItems?.length || 0);

                // Pagination di frontend
                const startIndex = page * rowsPerPage;
                const endIndex = startIndex + rowsPerPage;
                setRows((orderItems || []).slice(startIndex, endIndex));

                hideLoader();
            } catch (error) {
                hideLoader();
                console.error('Fetch error:', error);
                // Don't show error popup, just log it
            }
        };
        fetchData();
    }, []);

    // Handle pagination changes
    useEffect(() => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        setRows(allItems.slice(startIndex, endIndex));
    }, [page, rowsPerPage, allItems]);

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

    const totalPages = Math.ceil(totalData / rowsPerPage);
    const startItem = totalData === 0 ? 0 : page * rowsPerPage + 1;
    const endItem = Math.min((page + 1) * rowsPerPage, totalData);

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-200">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Order Items</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage all order items</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                            <span className="text-gray-600">Total Items: </span>
                            <span className="font-bold" style={{ color: '#A1887F' }}>{totalData}</span>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead style={{ backgroundColor: '#F5F5F5' }}>
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Item ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Product ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                        <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p>No order items found</p>
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, rowIndex) => (
                                    <tr key={row?.id || rowIndex} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-medium"
                                                    style={{ backgroundColor: '#A1887F' }}>
                                                    <Package className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    #{row?.id}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                to={`/admin/order-details/${row?.order_id}`}
                                                className="text-sm font-medium hover:underline"
                                                style={{ color: '#A1887F' }}
                                            >
                                                Order #{row?.order_id}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                to={`/admin/food-list`}
                                                className="text-sm text-gray-700 hover:underline"
                                            >
                                                Product #{row?.product_id}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center justify-center w-12 h-8 rounded-full text-sm font-bold text-white"
                                                style={{ backgroundColor: '#A1887F' }}>
                                                {row?.quantity || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                            {row?.price ? formatPrice(row?.price) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold" style={{ color: '#A1887F' }}>
                                            {row?.price && row?.quantity
                                                ? formatPrice(row?.price * row?.quantity)
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(row?.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link to={`/admin/edit-order-item/${row?.id}`}>
                                                    <button
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Edit"
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

                {/* Summary Footer */}
                {rows.length > 0 && (
                    <div className="px-6 py-4 bg-gray-50 border-t-2" style={{ borderColor: '#A1887F' }}>
                        <div className="flex justify-end items-center gap-8">
                            <div className="text-sm">
                                <span className="text-gray-600">Total Quantity: </span>
                                <span className="font-bold text-gray-900">
                                    {rows.reduce((sum, row) => sum + (row?.quantity || 0), 0)} items
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="text-gray-600">Total Value: </span>
                                <span className="font-bold text-lg" style={{ color: '#A1887F' }}>
                                    {formatPrice(
                                        rows.reduce((sum, row) =>
                                            sum + ((row?.price || 0) * (row?.quantity || 0)), 0
                                        )
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

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
                                className={`p-2 rounded-lg transition-colors ${page === 0
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleChangePage(page + 1)}
                                disabled={page >= totalPages - 1}
                                className={`p-2 rounded-lg transition-colors ${page >= totalPages - 1
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