import { Plus, Edit, CreditCard, QrCode, Banknote, Building } from 'lucide-react';

export default function PaymentMethodsPage() {
    const methods = [
        { id: 1, name: 'Tunai', type: 'cash', icon: Banknote, isActive: true, color: 'bg-green-500' },
        { id: 2, name: 'QRIS', type: 'qris', icon: QrCode, isActive: true, color: 'bg-purple-500' },
        { id: 3, name: 'Transfer Bank', type: 'transfer', icon: Building, isActive: true, color: 'bg-blue-500' },
        { id: 4, name: 'Debit/Kredit', type: 'card', icon: CreditCard, isActive: false, color: 'bg-gray-500' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Metode Pembayaran</h1>
                    <p className="text-gray-500">Kelola metode pembayaran yang diterima</p>
                </div>
                <button className="btn-primary">
                    <Plus className="h-4 w-4" />
                    Tambah Metode
                </button>
            </div>

            {/* Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {methods.map((method) => (
                    <div key={method.id} className={`card p-5 ${!method.isActive && 'opacity-60'}`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className={`h-12 w-12 rounded-xl ${method.color} flex items-center justify-center`}>
                                <method.icon className="h-6 w-6 text-white" />
                            </div>
                            <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                                <Edit className="h-4 w-4 text-gray-500" />
                            </button>
                        </div>
                        <h3 className="font-semibold text-gray-900">{method.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 capitalize">{method.type}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className={`badge ${method.isActive ? 'badge-success' : 'badge-danger'}`}>
                                {method.isActive ? 'Aktif' : 'Nonaktif'}
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={method.isActive} className="sr-only peer" readOnly />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
