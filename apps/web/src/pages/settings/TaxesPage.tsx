import { Plus, Edit, Trash2, Percent } from 'lucide-react';

export default function TaxesPage() {
    const taxes = [
        { id: 1, name: 'PPN', rate: 11, isActive: true, isDefault: true },
        { id: 2, name: 'Pajak Restoran', rate: 10, isActive: false, isDefault: false },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pajak</h1>
                    <p className="text-gray-500">Kelola pengaturan pajak untuk transaksi</p>
                </div>
                <button className="btn-primary">
                    <Plus className="h-4 w-4" />
                    Tambah Pajak
                </button>
            </div>

            {/* Info */}
            <div className="card p-4 bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-700">
                    <strong>Info:</strong> Pajak akan otomatis diterapkan pada transaksi sesuai pengaturan.
                </p>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Nama Pajak
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Tarif
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Default
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {taxes.map((tax) => (
                            <tr key={tax.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                            <Percent className="h-5 w-5 text-amber-500" />
                                        </div>
                                        <span className="font-medium text-gray-900">{tax.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                    {tax.rate}%
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`badge ${tax.isActive ? 'badge-success' : 'badge-danger'}`}>
                                        {tax.isActive ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {tax.isDefault && (
                                        <span className="badge badge-primary">Default</span>
                                    )}
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
