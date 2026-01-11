import { useState } from 'react';
import { Plus, Search, Download, Eye, Edit, Users, Phone, Mail, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function CustomersPage() {
    const [search, setSearch] = useState('');
    const [level, setLevel] = useState('');

    // Sample data
    const customers = [
        { id: 1, name: 'Budi Santoso', phone: '08123456789', email: 'budi@email.com', level: 'Reseller', points: 1250, totalSpent: 5850000 },
        { id: 2, name: 'Siti Aminah', phone: '08234567890', email: 'siti@email.com', level: 'Agen', points: 3420, totalSpent: 15200000 },
        { id: 3, name: 'Ahmad Dahlan', phone: '08345678901', email: 'ahmad@email.com', level: 'Regular', points: 450, totalSpent: 1250000 },
        { id: 4, name: 'Maria Garcia', phone: '08456789012', email: 'maria@email.com', level: 'Distributor', points: 8200, totalSpent: 45800000 },
    ];

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Distributor': return 'bg-purple-100 text-purple-700';
            case 'Agen': return 'bg-blue-100 text-blue-700';
            case 'Reseller': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Daftar Pelanggan</h1>
                    <p className="text-sm text-gray-500">Kelola data pelanggan dan membership</p>
                </div>
                <div className="action-buttons">
                    <button className="btn-secondary text-sm">
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                    <button className="btn-primary text-sm">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Tambah</span> Pelanggan
                    </button>
                </div>
            </div>

            {/* Filter */}
            <div className="card p-3 sm:p-4">
                <div className="filter-section">
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari pelanggan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-10"
                        />
                    </div>
                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="input w-full sm:w-auto"
                    >
                        <option value="">Semua Level</option>
                        <option value="regular">Regular</option>
                        <option value="reseller">Reseller</option>
                        <option value="agen">Agen</option>
                        <option value="distributor">Distributor</option>
                    </select>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-card space-y-3">
                {customers.map((customer) => (
                    <div key={customer.id} className="card p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-primary-600 font-bold">
                                        {customer.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{customer.name}</h3>
                                    <span className={`badge text-xs ${getLevelColor(customer.level)}`}>
                                        {customer.level}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm mb-3">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="h-4 w-4" />
                                {customer.phone}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="h-4 w-4" />
                                {customer.email}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div className="bg-amber-50 rounded-lg p-2 text-center">
                                <p className="text-gray-600 text-xs">Poin</p>
                                <p className="font-bold text-amber-600 flex items-center justify-center gap-1">
                                    <Star className="h-3 w-3" />
                                    {customer.points.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-2 text-center">
                                <p className="text-gray-600 text-xs">Total Belanja</p>
                                <p className="font-bold text-green-600">{formatCurrency(customer.totalSpent)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                            <button className="flex-1 btn-secondary py-2 text-sm">
                                <Eye className="h-4 w-4" />
                                Detail
                            </button>
                            <button className="flex-1 btn-secondary py-2 text-sm">
                                <Edit className="h-4 w-4" />
                                Edit
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
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Pelanggan
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Kontak
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Level
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Poin
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Total Belanja
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                <span className="text-primary-600 font-bold">
                                                    {customer.name.charAt(0)}
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-900">{customer.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm">
                                            <p className="text-gray-900">{customer.phone}</p>
                                            <p className="text-gray-500">{customer.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`badge ${getLevelColor(customer.level)}`}>
                                            {customer.level}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="flex items-center gap-1 text-amber-600 font-medium">
                                            <Star className="h-4 w-4" />
                                            {customer.points.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {formatCurrency(customer.totalSpent)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                                                <Eye className="h-4 w-4 text-gray-500" />
                                            </button>
                                            <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                                                <Edit className="h-4 w-4 text-gray-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500 order-2 sm:order-1">
                    Menampilkan 1-4 dari 4 pelanggan
                </p>
                <div className="flex items-center gap-2 order-1 sm:order-2">
                    <button className="btn-secondary px-3 py-2 text-sm" disabled>
                        Prev
                    </button>
                    <button className="btn-primary px-3 py-2 text-sm">1</button>
                    <button className="btn-secondary px-3 py-2 text-sm">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
