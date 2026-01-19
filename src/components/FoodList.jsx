import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../services/productService';
import UseLoader from './loader/UseLoader';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import Swal from 'sweetalert2';

export default function FoodList() {
    const [totalData, setTotalData] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loader, showLoader, hideLoader] = UseLoader();

    const handleDelete = (productId) => {
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
                removeProduct(productId);
            }
        });
    };

    const removeProduct = async (productId) => {
        try {
            showLoader();
            await deleteProduct(productId);

            const updatedProducts = allProducts.filter(row => row?.id !== productId);
            setAllProducts(updatedProducts);
            setTotalData(updatedProducts.length);

            // Update paginated view
            const startIndex = page * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            setRows(updatedProducts.slice(startIndex, endIndex));

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Product has been deleted.',
                confirmButtonColor: '#A1887F'
            });
            hideLoader();
        } catch (error) {
            hideLoader();
            console.error('Delete error:', error);
            Swal.fire({
                icon: "error",
                title: "Request Failed",
                text: error.message || "Unable to delete product",
                confirmButtonColor: '#A1887F'
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                const products = await getProducts();
                setAllProducts(products || []);
                setTotalData(products?.length || 0);

                // Pagination di frontend
                const startIndex = page * rowsPerPage;
                const endIndex = startIndex + rowsPerPage;
                setRows((products || []).slice(startIndex, endIndex));

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
        setRows(allProducts.slice(startIndex, endIndex));
    }, [page, rowsPerPage, allProducts]);

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
            day: 'numeric'
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
                        <h1 className="text-2xl font-bold text-gray-800">All Products List</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your product menu</p>
                    </div>
                    <Link to="/admin/add-food">
                        <button className="px-6 py-2.5 text-white rounded-lg font-medium hover:opacity-90 transition-all"
                            style={{ backgroundColor: '#A1887F' }}>
                            + Add Product
                        </button>
                    </Link>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead style={{ backgroundColor: '#F5F5F5' }}>
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Image
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Created
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
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, rowIndex) => (
                                    <tr key={row?.id || rowIndex} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            {row?.image ? (
                                                <img
                                                    src={row?.image}
                                                    alt={row?.name}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display = 'none';
                                                        if (e.target.nextSibling) {
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }
                                                    }}
                                                />
                                            ) : null}
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${row?.image ? 'hidden' : ''}`}
                                                style={{ backgroundColor: '#A1887F' }}>
                                                <Image className="w-6 h-6" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {row?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                                            <div className="truncate" title={row?.description}>
                                                {row?.description || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {row?.price ? formatPrice(row?.price) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${(row?.stock || 0) > 10
                                                ? 'bg-green-100 text-green-800'
                                                : (row?.stock || 0) > 0
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {row?.stock || 0} units
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(row?.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link to={`/admin/edit-food/${row?.id}`}>
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