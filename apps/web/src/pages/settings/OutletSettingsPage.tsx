import { useAuthStore } from '@/stores/auth';
import { Building2, MapPin, Phone, Mail, Clock, Edit } from 'lucide-react';

export default function OutletSettingsPage() {
    const { outlets } = useAuthStore();
    const outlet = outlets[0];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pengaturan Outlet</h1>
                    <p className="text-gray-500">Kelola informasi outlet dan jam operasional</p>
                </div>
                <button className="btn-primary">
                    <Edit className="h-4 w-4" />
                    Edit Outlet
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Outlet Info */}
                <div className="card">
                    <div className="p-5 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Informasi Outlet</h3>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-lg bg-primary-500 flex items-center justify-center">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{outlet?.name || 'Nama Outlet'}</h4>
                                <p className="text-sm text-gray-500">Outlet Pusat</p>
                            </div>
                        </div>
                        <div className="pt-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                <span className="text-sm text-gray-600">{outlet?.address || 'Alamat belum diatur'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{outlet?.phone || '-'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{outlet?.email || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operating Hours */}
                <div className="card">
                    <div className="p-5 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Jam Operasional</h3>
                    </div>
                    <div className="p-5 space-y-3">
                        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day) => (
                            <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                <span className="text-sm font-medium text-gray-900">{day}</span>
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    08:00 - 21:00
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Receipt Settings */}
            <div className="card">
                <div className="p-5 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Pengaturan Struk</h3>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="label">Header Struk</label>
                        <textarea className="input h-24" placeholder="Teks yang muncul di bagian atas struk..." />
                    </div>
                    <div>
                        <label className="label">Footer Struk</label>
                        <textarea className="input h-24" placeholder="Teks yang muncul di bagian bawah struk..." />
                    </div>
                </div>
            </div>
        </div>
    );
}
