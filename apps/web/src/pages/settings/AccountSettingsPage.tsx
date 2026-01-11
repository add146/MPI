import { useAuthStore } from '@/stores/auth';
import { User, Mail, Phone, Building2, MapPin, Edit } from 'lucide-react';

export default function AccountSettingsPage() {
    const { user, outlets } = useAuthStore();
    const currentOutlet = outlets[0];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Pengaturan Akun</h1>
                <p className="text-gray-500">Kelola informasi akun dan profil bisnis Anda</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Card */}
                <div className="card">
                    <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Informasi Profil</h3>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-2xl font-bold text-primary-600">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{user?.name}</h4>
                                <p className="text-sm text-gray-500">Owner</p>
                            </div>
                        </div>
                        <div className="pt-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">-</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business Card */}
                <div className="card">
                    <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Informasi Bisnis</h3>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-lg bg-primary-500 flex items-center justify-center">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{currentOutlet?.name || 'Nama Bisnis'}</h4>
                                <p className="text-sm text-gray-500">UMKM</p>
                            </div>
                        </div>
                        <div className="pt-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                <span className="text-sm text-gray-600">{currentOutlet?.address || '-'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{currentOutlet?.phone || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="card">
                <div className="p-5 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Keamanan</h3>
                </div>
                <div className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900">Password</h4>
                            <p className="text-sm text-gray-500">Terakhir diubah: Tidak pernah</p>
                        </div>
                        <button className="btn-secondary">
                            Ubah Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
