import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import UseLoader from './loader/UseLoader';
import { ShoppingCart, Trash2, ChevronLeft, ChevronRight, Package, User } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Carts() {
    const [totalData, setTotalData] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState([]);
    const [allCarts, setAllCarts] = useState([]);
    const [loader, showLoader, hideLoader] = UseLoader();

    const handleDelete = (cartId) => {
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
                removeCartItem(cartId);
            }
        });
    };

    const removeCartItem = async (cartId) => {
        try {
            showLoader();
            const { error } = await supabase
                .from('carts')
                .delete()
                .eq('id', cartId);

            if (error) throw error;

            const updatedCarts = allCarts.filter(row => row?.id !== cartId);
            setAllCarts(updatedCarts);
            setTotalData(updatedCarts.length);

            // Update paginated view
            const startIndex = page * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            setRows(updatedCarts.slice(startIndex, endIndex));

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Cart item has been deleted.',
                confirmButtonColor: '#A1887F'
            });
            hideLoader();
        } catch (error) {
            hideLoader();
            console.error('Delete error:', error);
            Swal.fire({
                icon: "error",
                title: "Request Failed",
                text: error.message || "Unable to delete cart item",
                confirmButtonColor: '#A1887F'
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                const { data: carts, error } = await supabase
                    .from('carts')
                    .select(`
                        *,
                        profile:user_id (username),
                        product:product_id (id, name, price, image)
                    `)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setAllCarts(carts || []);
                setTotalData(carts?.length || 0);

                // Pagination di frontend
                const startIndex = page * rowsPerPage;
                const endIndex = startIndex + rowsPerPage;
                setRows((carts || []).slice(startIndex, endIndex));

                hideLoader();
            } catch (error) {
                hideLoader();
                console.error('Fetch error:', error);
                // Don't show error popup, just show empty state
            }
        };
        fetchData();
    }, []);

    // Handle pagination changes
    useEffect(() => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        setRows(allCarts.slice(startIndex, endIndex));
    }, [page, rowsPerPage, allCarts]);

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
                        <h1 className="text-2xl font-bold text-gray-800">All Carts</h1>
                        <p className="text-sm text-gray-500 mt-1">View all active shopping carts</p>
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead style={{ backgroundColor: '#F5F5F5' }}>
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Subtotal
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Added At
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <ShoppingCart className="w-12 h-12 text-gray-400 mb-3" />
                                            <p className="text-gray-500 font-medium">No cart items found</p>
                                            <p className="text-sm text-gray-400 mt-1">Carts will appear here when users add items</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, rowIndex) => (
                                    <tr key={row?.id || rowIndex} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                                                    style={{ backgroundColor: '#A1887F' }}>
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {row?.profile?.username || 'Unknown User'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {row?.product?.image ? (
                                                    <img
                                                        src={row?.product?.image}
                                                        alt={row?.product?.name}
                                                        className="w-10 h-10 rounded-lg object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                                                        style={{ backgroundColor: '#A1887F' }}>
                                                        <Package className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <span className="text-sm font-medium text-gray-900">
                                                    {row?.product?.name || '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {row?.product?.price ? formatPrice(row?.product?.price) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {row?.quantity || 0}x
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold" style={{ color: '#A1887F' }}>
                                            {row?.product?.price ? formatPrice(row?.product?.price * (row?.quantity || 1)) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(row?.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDelete(row?.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
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
