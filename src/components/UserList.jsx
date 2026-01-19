import React, { useEffect, useState } from 'react';
import { getProfiles, deleteProfile } from '../services/profileService';
import UseLoader from './loader/UseLoader';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, ChevronLeft, ChevronRight, User, Shield, UserCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export default function UserList() {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalData, setTotalData] = useState(0);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState([]);
    const [loader, showLoader, hideLoader] = UseLoader();

    const handleDelete = (userId) => {
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
                removeUser(userId);
            }
        });
    };

    const removeUser = async (userId) => {
        try {
            showLoader();
            await deleteProfile(userId);

            const updateRows = rows.filter(row => row?.id !== userId);
            setRows(updateRows);
            setTotalData(prev => prev - 1);
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'User has been deleted.',
                confirmButtonColor: '#A1887F'
            });
            hideLoader();
        } catch (error) {
            hideLoader();
            Swal.fire({
                icon: "error",
                title: "Request Failed",
                text: error.message || "Unable to delete user",
                confirmButtonColor: '#A1887F'
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                const profiles = await getProfiles();
                setRows(profiles || []);
                setTotalData(profiles?.length || 0);
                hideLoader();
            } catch (error) {
                hideLoader();
                console.error('Fetch error:', error);
                // Don't show error popup, just show empty state
            }
        };
        fetchData();
    }, []);

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            admin: '#DC2626',
            staff: '#A1887F',
            customer: '#3B82F6',
            user: '#10B981'
        };
        return colors[role?.toLowerCase()] || '#6B7280';
    };

    const getRoleIcon = (role) => {
        if (role?.toLowerCase() === 'admin') return <Shield className="w-3 h-3" />;
        return <UserCircle className="w-3 h-3" />;
    };

    // Pagination logic
    const totalPages = Math.ceil(totalData / rowsPerPage);
    const startItem = page * rowsPerPage;
    const endItem = Math.min((page + 1) * rowsPerPage, totalData);
    const paginatedRows = rows.slice(startItem, endItem);

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-200">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">User Profiles</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage system users and their roles</p>
                    </div>
                    <Link to="add-user">
                        <button className="px-6 py-2.5 text-white rounded-lg font-medium hover:opacity-90 transition-all shadow-md"
                            style={{ backgroundColor: '#A1887F' }}>
                            + Add New User
                        </button>
                    </Link>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead style={{ backgroundColor: '#F5F5F5' }}>
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Avatar
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Username
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedRows.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <User className="w-12 h-12 text-gray-400 mb-3" />
                                            <p className="text-gray-500 font-medium">No users found</p>
                                            <p className="text-sm text-gray-400 mt-1">Start by adding a new user</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedRows.map((row, rowIndex) => (
                                    <tr key={row.id || rowIndex} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            {row?.avatar_url ? (
                                                <img
                                                    src={row.avatar_url}
                                                    alt={row.username}
                                                    className="w-10 h-10 rounded-full object-cover border-2"
                                                    style={{ borderColor: '#A1887F' }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                                                style={{
                                                    backgroundColor: '#A1887F',
                                                    display: row?.avatar_url ? 'none' : 'flex'
                                                }}
                                            >
                                                {row?.username?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-900">
                                                {row?.username || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full text-white"
                                                style={{ backgroundColor: getRoleBadgeColor(row?.role) }}
                                            >
                                                {getRoleIcon(row?.role)}
                                                {row?.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link to={`edit-user/${row?.id}`}>
                                                    <button
                                                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
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
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#A1887F] appearance-none bg-white cursor-pointer"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            {totalData > 0 ? `${startItem + 1}-${endItem} of ${totalData}` : '0 users'}
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
                            <span className="text-sm text-gray-600 min-w-[60px] text-center">
                                Page {page + 1} of {totalPages || 1}
                            </span>
                            <button
                                onClick={() => handleChangePage(page + 1)}
                                disabled={page >= totalPages - 1 || totalData === 0}
                                className={`p-2 rounded-lg transition-colors ${page >= totalPages - 1 || totalData === 0
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