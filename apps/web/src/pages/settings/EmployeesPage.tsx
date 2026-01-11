import { useState } from 'react';
import { Plus, Search, Edit, Trash2, User, Shield, CheckCircle, XCircle } from 'lucide-react';

export default function EmployeesPage() {
    const [search, setSearch] = useState('');

    const employees = [
        { id: 1, name: 'Admin Utama', email: 'admin@toko.com', role: 'Owner', status: 'active', lastLogin: '15 Jan 2024' },
        { id: 2, name: 'Kasir 1', email: 'kasir1@toko.com', role: 'Cashier', status: 'active', lastLogin: '15 Jan 2024' },
        { id: 3, name: 'Kasir 2', email: 'kasir2@toko.com', role: 'Cashier', status: 'inactive', lastLogin: '10 Jan 2024' },
        { id: 4, name: 'Manager Outlet', email: 'manager@toko.com', role: 'Manager', status: 'active', lastLogin: '14 Jan 2024' },
    ];

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'Owner': return 'bg-purple-100 text-purple-700';
            case 'Manager': return 'bg-blue-100 text-blue-700';
            case 'Cashier': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Karyawan</h1>
                    <p className="text-sm text-gray-500">Kelola akses karyawan ke sistem</p>
                </div>
                <button className="btn-primary text-sm">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Tambah</span> Karyawan
                </button>
            </div>

            {/* Filter */}
            <div className="card p-3 sm:p-4">
                <div className="filter-section">
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari karyawan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-10"
                        />
                    </div>
                    <select className="input w-full sm:w-auto">
                        <option value="">Semua Role</option>
                        <option value="owner">Owner</option>
                        <option value="manager">Manager</option>
                        <option value="cashier">Cashier</option>
                    </select>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-card space-y-3">
                {employees.map((employee) => (
                    <div key={employee.id} className="card p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                    <User className="h-5 w-5 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{employee.name}</h3>
                                    <p className="text-xs text-gray-500">{employee.email}</p>
                                </div>
                            </div>
                            {employee.status === 'active' ? (
                                <span className="badge badge-success flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Aktif
                                </span>
                            ) : (
                                <span className="badge badge-danger flex items-center gap-1">
                                    <XCircle className="h-3 w-3" />
                                    Nonaktif
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div>
                                <p className="text-gray-500">Role</p>
                                <span className={`badge ${getRoleColor(employee.role)} mt-1`}>
                                    <Shield className="h-3 w-3 mr-1" />
                                    {employee.role}
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-500">Login Terakhir</p>
                                <p className="font-medium">{employee.lastLogin}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                            <button className="flex-1 btn-secondary py-2 text-sm">
                                <Edit className="h-4 w-4" />
                                Edit
                            </button>
                            <button className="p-2 hover:bg-red-50 rounded-lg">
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="desktop-table card overflow-hidden">
                <div className="table-responsive">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Karyawan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Login Terakhir</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {employees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                <User className="h-5 w-5 text-primary-600" />
                                            </div>
                                            <span className="font-medium text-gray-900">{employee.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{employee.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`badge ${getRoleColor(employee.role)}`}>
                                            {employee.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {employee.status === 'active' ? (
                                            <span className="badge badge-success flex items-center gap-1 w-fit">
                                                <CheckCircle className="h-3 w-3" />
                                                Aktif
                                            </span>
                                        ) : (
                                            <span className="badge badge-danger flex items-center gap-1 w-fit">
                                                <XCircle className="h-3 w-3" />
                                                Nonaktif
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{employee.lastLogin}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                                                <Edit className="h-4 w-4 text-gray-500" />
                                            </button>
                                            <button className="p-1.5 hover:bg-red-50 rounded-lg">
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
