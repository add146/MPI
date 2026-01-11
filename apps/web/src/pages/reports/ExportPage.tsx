import { useState } from 'react';
import { Download, Search, FileSpreadsheet, FileText, Calendar, Clock, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ExportPage() {
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const exportOptions = [
        { id: 'sales', name: 'Laporan Penjualan', icon: FileSpreadsheet, description: 'Data transaksi dan penjualan' },
        { id: 'inventory', name: 'Stok & Inventory', icon: FileSpreadsheet, description: 'Data stok produk dan bahan' },
        { id: 'profit-loss', name: 'Laba Rugi', icon: FileText, description: 'Laporan pendapatan dan biaya' },
        { id: 'balance', name: 'Neraca', icon: FileText, description: 'Posisi keuangan' },
        { id: 'customers', name: 'Data Pelanggan', icon: FileSpreadsheet, description: 'Daftar pelanggan dan transaksi' },
        { id: 'products', name: 'Data Produk', icon: FileSpreadsheet, description: 'Katalog produk dan harga' },
    ];

    const recentExports = [
        { name: 'Penjualan Jan 2024.xlsx', date: '15 Jan 2024', size: '245 KB', status: 'completed' },
        { name: 'Stok 31 Jan 2024.xlsx', date: '31 Jan 2024', size: '128 KB', status: 'completed' },
        { name: 'Laba Rugi Q4 2023.xlsx', date: '01 Jan 2024', size: '89 KB', status: 'completed' },
    ];

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Export Data</h1>
                    <p className="text-sm text-gray-500">Download laporan dalam format Excel/CSV</p>
                </div>
            </div>

            {/* Date Range */}
            <div className="card p-4 sm:p-5">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    Periode Laporan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <label className="label">Dari Tanggal</label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="input"
                        />
                    </div>
                    <div>
                        <label className="label">Sampai Tanggal</label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="input"
                        />
                    </div>
                </div>
            </div>

            {/* Export Options */}
            <div>
                <h3 className="font-medium text-gray-900 mb-3">Pilih Jenis Laporan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {exportOptions.map((option) => (
                        <div key={option.id} className="card p-4 hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                                    <option.icon className="h-5 w-5 text-primary-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900">{option.name}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <button className="flex-1 btn-secondary py-2 text-xs sm:text-sm">
                                    <FileSpreadsheet className="h-4 w-4" />
                                    Excel
                                </button>
                                <button className="flex-1 btn-secondary py-2 text-xs sm:text-sm">
                                    <FileText className="h-4 w-4" />
                                    CSV
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Exports */}
            <div className="card overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">Export Terakhir</h3>
                </div>

                {/* Mobile View */}
                <div className="mobile-card divide-y divide-gray-100">
                    {recentExports.map((file, idx) => (
                        <div key={idx} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                                    <p className="text-xs text-gray-500">{file.date} • {file.size}</p>
                                </div>
                            </div>
                            <button className="btn-secondary p-2">
                                <Download className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Desktop View */}
                <div className="desktop-table table-responsive">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">File</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tanggal</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ukuran</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentExports.map((file, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <FileSpreadsheet className="h-5 w-5 text-green-600" />
                                            <span className="font-medium text-gray-900">{file.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{file.date}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{file.size}</td>
                                    <td className="px-4 py-3">
                                        <span className="badge badge-success flex items-center gap-1 w-fit">
                                            <CheckCircle className="h-3 w-3" />
                                            Selesai
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center">
                                            <button className="btn-secondary py-1.5 px-3 text-sm">
                                                <Download className="h-4 w-4" />
                                                Download
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
