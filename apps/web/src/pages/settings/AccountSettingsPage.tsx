import { useState } from 'react';
import { User, Building2, Save, Camera } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';

export default function AccountSettingsPage() {
    const { user, outlets } = useAuthStore();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '08123456789',
        businessName: outlets[0]?.name || '',
        businessAddress: 'Jl. Contoh No. 123, Jakarta',
        taxId: '01.234.567.8-901.000',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pengaturan Akun</h1>
                    <p className="text-sm text-gray-500">Kelola profil dan informasi bisnis</p>
                </div>
                <button className="btn-primary text-sm">
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline">Simpan</span> Perubahan
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Profile Info */}
                <div className="card overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                        <User className="h-5 w-5 text-gray-400" />
                        <h3 className="font-semibold text-gray-900">Informasi Profil</h3>
                    </div>
                    <div className="p-4 sm:p-5 space-y-4">
                        {/* Avatar */}
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-2xl sm:text-3xl font-bold text-primary-600">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <button className="btn-secondary text-sm">
                                <Camera className="h-4 w-4" />
                                Ganti Foto
                            </button>
                        </div>

                        <div>
                            <label className="label">Nama Lengkap</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="label">No. Telepon</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input"
                            />
                        </div>
                    </div>
                </div>

                {/* Business Info */}
                <div className="card overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-gray-400" />
                        <h3 className="font-semibold text-gray-900">Informasi Bisnis</h3>
                    </div>
                    <div className="p-4 sm:p-5 space-y-4">
                        <div>
                            <label className="label">Nama Bisnis</label>
                            <input
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="label">Alamat</label>
                            <textarea
                                name="businessAddress"
                                value={formData.businessAddress}
                                onChange={handleChange}
                                rows={3}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="label">NPWP</label>
                            <input
                                type="text"
                                name="taxId"
                                value={formData.taxId}
                                onChange={handleChange}
                                className="input"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="card overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-900">Keamanan</h3>
                </div>
                <div className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="font-medium text-gray-900">Password</p>
                            <p className="text-sm text-gray-500">Terakhir diubah 30 hari yang lalu</p>
                        </div>
                        <button className="btn-secondary text-sm w-full sm:w-auto">
                            Ubah Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
