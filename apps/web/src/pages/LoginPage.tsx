import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Boxes, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        outletName: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const { data } = await authApi.login(formData.email, formData.password);
                login(data.token, data.user, data.outlets);
                toast.success('Login berhasil!');
                navigate('/');
            } else {
                const { data } = await authApi.register({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    outletName: formData.outletName,
                });
                login(data.token, data.user, [data.outlet]);
                toast.success('Registrasi berhasil!');
                navigate('/');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-12 w-12 rounded-xl bg-primary-500 flex items-center justify-center">
                            <Boxes className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">MPI System</h1>
                            <p className="text-sm text-gray-500">Manajemen Produksi Terintegrasi</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">
                            {isLogin ? 'Masuk ke Akun' : 'Buat Akun Baru'}
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            {isLogin
                                ? 'Masukkan email dan password untuk melanjutkan'
                                : 'Isi form berikut untuk mendaftar'}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <>
                                    <div>
                                        <label className="label">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="Nama Anda"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Nama Outlet/Toko</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="Nama toko atau bisnis Anda"
                                            value={formData.outletName}
                                            onChange={(e) => setFormData({ ...formData, outletName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    className="input"
                                    placeholder="nama@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="input pr-10"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary w-full"
                                disabled={loading}
                            >
                                {loading ? 'Memproses...' : isLogin ? 'Masuk' : 'Daftar'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-500">
                            {isLogin ? "Belum punya akun?" : 'Sudah punya akun?'}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-1 text-primary-600 hover:text-primary-700 font-medium"
                            >
                                {isLogin ? 'Daftar sekarang' : 'Masuk'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Hero */}
            <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-500 to-primary-700 items-center justify-center p-12">
                <div className="max-w-lg text-white">
                    <h2 className="text-4xl font-bold mb-4">
                        Kelola Bisnis Anda dengan Lebih Mudah
                    </h2>
                    <p className="text-lg text-primary-100 mb-8">
                        MPI membantu UMKM dan IKM mengelola produksi, inventory, penjualan,
                        dan laporan keuangan dalam satu platform terintegrasi.
                    </p>
                    <ul className="space-y-3">
                        {[
                            'Resep Produksi & HPP Otomatis',
                            'Multi-Level Pricing (Reseller, Agen, Distributor)',
                            'Sistem Poin & Loyalitas Pelanggan',
                            'Laporan Neraca & Laba Rugi',
                        ].map((feature) => (
                            <li key={feature} className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
