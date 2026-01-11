import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Users, Mail, Phone, Shield } from 'lucide-react';

export default function EmployeesPage() {
    const [search, setSearch] = useState('');

    const employees = [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '081234567890', role: 'Kasir', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '081234567891', role: 'Admin', status: 'active' },
        { id: 3, name: 'Bob Wilson', email: 'bob@example.com', phone: '081234567892', role: 'Kasir', status: 'inactive' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Karyawan</h1>
                    <p className="text-gray-500">Kelola akun karyawan dan hak akses</p>
                </div>
                <button className="btn-primary">
                    <Plus className="h-4 w-4" />
                    Tambah Karyawan
                </button>
            </div>

            {/* Filter */}
            <div className="card p-4">
                <div className="flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari karyawan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-10"
                        />
                    </div>
                    <select className="input w-auto">
                        <option value="">Semua Role</option>
                        <option value="admin">Admin</option>
                        <option value="kasir">Kasir</option>
                    </select>
                    <select className="input w-auto">
                        <option value="">Semua Status</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Nonaktif</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Karyawan
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Kontak
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Role
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Status
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                            <span className="text-primary-600 font-medium">
                                                {emp.name.charAt(0)}
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-900">{emp.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                            <Mail className="h-3.5 w-3.5" />
                                            {emp.email}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                            <Phone className="h-3.5 w-3.5" />
                                            {emp.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`badge flex items-center gap-1 w-fit ${emp.role === 'Admin' ? 'badge-primary' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        <Shield className="h-3 w-3" />
                                        {emp.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`badge ${emp.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                                        {emp.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </td>
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
    );
}
