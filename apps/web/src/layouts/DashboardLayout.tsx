import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Package,
    Boxes,
    FlaskConical,
    Gift,
    Users,
    Tags,
    Receipt,
    BarChart3,
    Settings,
    LogOut,
    ChevronDown,
    Store,
    Menu,
    X,
    Warehouse,
    FileSpreadsheet,
    CreditCard,
    Building2,
    UserCog,
    Coins,
    History,
    ShoppingCart,
    ClipboardList,
    Clock,
    TrendingUp,
    Scale,
    Calculator,
    Download,
    Layers,
} from 'lucide-react';

// Navigation structure sesuai PRD 6.2
const navigation = [
    {
        name: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
    },
    {
        name: 'Katalog',
        icon: Package,
        children: [
            { name: 'Produk Jadi', href: '/catalog/products' },
            { name: 'Bahan Baku', href: '/catalog/raw-materials' },
            { name: 'Kategori', href: '/catalog/categories' },
            { name: 'Brand', href: '/catalog/brands' },
            { name: 'Resep Produksi', href: '/catalog/recipes' },
            { name: 'Bundle Promo', href: '/catalog/bundles' },
        ],
    },
    {
        name: 'Harga & Level',
        icon: Tags,
        children: [
            { name: 'Price Levels', href: '/pricing/levels' },
            { name: 'Product Prices', href: '/pricing/products' },
            { name: 'Points Config', href: '/pricing/points' },
        ],
    },
    {
        name: 'Pelanggan',
        icon: Users,
        children: [
            { name: 'Daftar Pelanggan', href: '/customers' },
            { name: 'Level Pelanggan', href: '/customers/levels' },
            { name: 'Riwayat Poin', href: '/customers/points' },
        ],
    },
    {
        name: 'Inventory',
        icon: Warehouse,
        children: [
            { name: 'Stok Produk', href: '/inventory/products' },
            { name: 'Stok Bahan Baku', href: '/inventory/raw-materials' },
            { name: 'Purchase Order', href: '/inventory/purchase-orders' },
            { name: 'Transfer Stok', href: '/inventory/transfers' },
            { name: 'Adjustment', href: '/inventory/adjustments' },
        ],
    },
    {
        name: 'Transaksi',
        icon: Receipt,
        children: [
            { name: 'POS', href: '/pos' },
            { name: 'Riwayat Transaksi', href: '/transactions' },
            { name: 'Shift', href: '/transactions/shifts' },
        ],
    },
    {
        name: 'Laporan',
        icon: BarChart3,
        children: [
            { name: 'Penjualan', href: '/reports/sales' },
            { name: 'Neraca', href: '/reports/balance-sheet' },
            { name: 'Laba Rugi', href: '/reports/profit-loss' },
            { name: 'HPP', href: '/reports/hpp' },
            { name: 'Export Excel', href: '/reports/export' },
        ],
    },
    {
        name: 'Pengaturan',
        icon: Settings,
        children: [
            { name: 'Akun', href: '/settings/account' },
            { name: 'Outlet', href: '/settings/outlet' },
            { name: 'Karyawan', href: '/settings/employees' },
            { name: 'Metode Pembayaran', href: '/settings/payment-methods' },
            { name: 'Pajak', href: '/settings/taxes' },
        ],
    },
];

function NavItem({ item }: { item: typeof navigation[0] }) {
    const [isOpen, setIsOpen] = useState(false);

    if ('children' in item && item.children) {
        return (
            <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="sidebar-link w-full justify-between"
                >
                    <span className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        {item.name}
                    </span>
                    <ChevronDown
                        className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
                    />
                </button>
                {isOpen && (
                    <div className="ml-8 mt-1 space-y-1">
                        {item.children.map((child) => (
                            <NavLink
                                key={child.href}
                                to={child.href}
                                className={({ isActive }) =>
                                    cn('sidebar-link text-sm', isActive && 'active')
                                }
                            >
                                {child.name}
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <NavLink
            to={item.href!}
            className={({ isActive }) => cn('sidebar-link', isActive && 'active')}
        >
            <item.icon className="h-5 w-5" />
            {item.name}
        </NavLink>
    );
}

export default function DashboardLayout() {
    const navigate = useNavigate();
    const { user, outlets, currentOutletId, setCurrentOutlet, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const currentOutlet = outlets.find((o) => o.id === currentOutletId);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-200 lg:relative lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center">
                                <Boxes className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">MPI System</h1>
                                <p className="text-xs text-gray-400">Manajemen Produksi</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Outlet Selector */}
                    <div className="px-4 py-3 border-b border-gray-800">
                        <select
                            value={currentOutletId || ''}
                            onChange={(e) => setCurrentOutlet(e.target.value)}
                            className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:border-primary-500 focus:outline-none"
                        >
                            {outlets.map((outlet) => (
                                <option key={outlet.id} value={outlet.id}>
                                    {outlet.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                        {navigation.map((item) => (
                            <NavItem key={item.name} item={item} />
                        ))}
                    </nav>

                    {/* POS Button */}
                    <div className="px-4 py-3 border-t border-gray-800">
                        <button
                            onClick={() => navigate('/pos')}
                            className="w-full btn-primary"
                        >
                            <Store className="h-5 w-5" />
                            Buka POS
                        </button>
                    </div>

                    {/* User */}
                    <div className="px-4 py-3 border-t border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                                <span className="text-white font-medium">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-red-400"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex items-center gap-2">
                        <Store className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                            {currentOutlet?.name || 'Pilih Outlet'}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Add notifications, search, etc. here */}
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
