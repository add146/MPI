import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Calendar, CheckCircle } from 'lucide-react';

export default function ExportPage() {
    const [selectedReport, setSelectedReport] = useState('');
    const [format, setFormat] = useState('xlsx');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const reports = [
        { id: 'sales', name: 'Laporan Penjualan', description: 'Data transaksi dan penjualan harian/bulanan' },
        { id: 'inventory', name: 'Laporan Stok', description: 'Posisi stok produk dan bahan baku' },
        { id: 'customers', name: 'Data Pelanggan', description: 'Daftar pelanggan dan poin mereka' },
        { id: 'transactions', name: 'Riwayat Transaksi', description: 'Detail semua transaksi' },
        { id: 'profit-loss', name: 'Laporan Laba Rugi', description: 'Ringkasan pendapatan dan pengeluaran' },
        { id: 'hpp', name: 'Laporan HPP', description: 'Harga Pokok Produksi per produk' },
    ];

    const recentExports = [
        { name: 'Laporan Penjualan Jan 2024', format: 'xlsx', date: '2024-01-15 10:30', status: 'completed' },
        { name: 'Data Pelanggan', format: 'csv', date: '2024-01-14 14:22', status: 'completed' },
        { name: 'Stok Bahan Baku', format: 'xlsx', date: '2024-01-12 09:15', status: 'completed' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Export Data</h1>
                <p className="text-gray-500">Unduh laporan dan data dalam format Excel atau CSV</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Export Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Select Report */}
                    <div className="card">
                        <div className="p-5 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900">Pilih Laporan</h3>
                        </div>
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {reports.map((report) => (
                                <label
                                    key={report.id}
                                    className={`card p-4 cursor-pointer border-2 transition-colors ${selectedReport === report.id
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="report"
                                        value={report.id}
                                        checked={selectedReport === report.id}
                                        onChange={(e) => setSelectedReport(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className="flex items-start gap-3">
                                        <FileSpreadsheet className={`h-5 w-5 ${selectedReport === report.id ? 'text-primary-600' : 'text-gray-400'
                                            }`} />
                                        <div>
                                            <p className="font-medium text-gray-900">{report.name}</p>
                                            <p className="text-sm text-gray-500">{report.description}</p>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Options */}
                    <div className="card">
                        <div className="p-5 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900">Pengaturan Export</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Dari Tanggal</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="date"
                                            value={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                            className="input pl-10"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="label">Sampai Tanggal</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="date"
                                            value={dateTo}
                                            onChange={(e) => setDateTo(e.target.value)}
                                            className="input pl-10"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="label">Format File</label>
                                <div className="flex gap-4">
                                    <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer ${format === 'xlsx' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="format"
                                            value="xlsx"
                                            checked={format === 'xlsx'}
                                            onChange={(e) => setFormat(e.target.value)}
                                            className="sr-only"
                                        />
                                        <FileSpreadsheet className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium">Excel (.xlsx)</span>
                                    </label>
                                    <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer ${format === 'csv' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="format"
                                            value="csv"
                                            checked={format === 'csv'}
                                            onChange={(e) => setFormat(e.target.value)}
                                            className="sr-only"
                                        />
                                        <FileText className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium">CSV (.csv)</span>
                                    </label>
                                </div>
                            </div>
                            <button className="btn-primary w-full" disabled={!selectedReport}>
                                <Download className="h-4 w-4" />
                                Export Laporan
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Exports */}
                <div className="card h-fit">
                    <div className="p-5 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Export Terakhir</h3>
                    </div>
                    <div className="p-5 space-y-3">
                        {recentExports.map((exp, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{exp.name}</p>
                                        <p className="text-xs text-gray-500">{exp.date}</p>
                                    </div>
                                </div>
                                <span className="badge bg-gray-100 text-gray-700 uppercase text-xs">{exp.format}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
