import { useState } from 'react';
import {
    Search,
    Plus,
    Minus,
    User,
    ShoppingCart,
    Star,
    ChevronDown,
    ArrowLeft,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import { useNavigate } from 'react-router-dom';

interface CartItem {
    id: string;
    name: string;
    price: number;
    qty: number;
}

export default function POSPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showCart, setShowCart] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');
    const { user, outlets } = useAuthStore();

    const categories = [
        { id: 'all', name: 'All Items', icon: '🏷️' },
        { id: 'bakery', name: 'Bakery', icon: '🥐' },
        { id: 'drinks', name: 'Drinks', icon: '☕' },
        { id: 'bundles', name: 'Bundles', icon: '📦' },
        { id: 'meals', name: 'Meals', icon: '🍽️' },
    ];

    const products = [
        { id: '1', name: 'Roti Sisir Manis', price: 12000, category: 'bakery', subtext: 'Bakery' },
        { id: '2', name: 'Bundle Sarapan Pagi', price: 25000, category: 'bundles', subtext: 'Include Coffee', isBundle: true },
        { id: '3', name: 'Kopi Susu Gula Aren', price: 18000, category: 'drinks', subtext: 'Drinks' },
        { id: '4', name: 'Butter Croissant', price: 15000, category: 'bakery', subtext: 'Bakery' },
        { id: '5', name: 'Donat Coklat', price: 8000, category: 'bakery', subtext: 'Bakery' },
        { id: '6', name: 'Es Teh Manis', price: 5000, category: 'drinks', subtext: 'Drinks' },
        { id: '7', name: 'Nasi Goreng Spesial', price: 25000, category: 'meals', subtext: 'Meals' },
        { id: '8', name: 'Sandwich Tuna', price: 22000, category: 'meals', subtext: 'Meals' },
    ];

    const filteredProducts = activeCategory === 'all'
        ? products
        : products.filter(p => p.category === activeCategory);

    const addToCart = (product: typeof products[0]) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
        });
    };

    const updateQty = (id: string, delta: number) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
                )
                .filter((item) => item.qty > 0)
        );
    };

    const clearCart = () => setCart([]);

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = Math.round(subtotal * 0.11);
    const total = subtotal + tax;
    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const pointsEarned = Math.floor(subtotal / 1000);

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
            {/* Products Section */}
            <div className={`flex-1 flex flex-col ${showCart ? 'hidden lg:flex' : 'flex'}`}>
                {/* Top Header */}
                <div className="bg-primary-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="lg:hidden p-2 -ml-2 hover:bg-white/10 rounded-lg"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                                <div>
                                    <h1 className="text-xl font-bold">MPI POS</h1>
                                    <p className="text-primary-100 text-sm flex items-center gap-2">
                                        <span className="h-2 w-2 bg-green-400 rounded-full"></span>
                                        Online • {outlets[0]?.name || 'Cabang Jakarta Pusat'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="font-medium">{user?.name || 'Budi Santoso'}</p>
                                    <p className="text-primary-100 text-sm">Cashier ID: #4492</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-white overflow-hidden flex items-center justify-center">
                                    <span className="text-primary-600 font-bold text-lg">
                                        {user?.name?.charAt(0).toUpperCase() || 'B'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products (e.g., Roti, Kopi, Bundle)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-base"
                            />
                        </div>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <div className="flex gap-3 overflow-x-auto pb-1 -mb-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all ${activeCategory === cat.id
                                            ? 'bg-primary-500 text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <span>{cat.icon}</span>
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
                            {filteredProducts.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="bg-white rounded-2xl p-4 text-left hover:shadow-lg transition-all border border-gray-100 group relative"
                                >
                                    {product.isBundle && (
                                        <span className="absolute top-3 left-3 bg-primary-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                            BUNDLE
                                        </span>
                                    )}
                                    <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 mb-3 flex items-center justify-center">
                                        <ShoppingCart className="h-10 w-10 text-amber-300" />
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-0.5 line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                                    <p className="text-xs text-gray-500 mb-2">{product.subtext}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-primary-600 font-bold text-sm sm:text-base">
                                            {formatCurrency(product.price)}
                                        </span>
                                        <span className="h-8 w-8 rounded-full bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                                            <Plus className="h-4 w-4 text-gray-500 group-hover:text-primary-600" />
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Cart Button */}
                {cart.length > 0 && !showCart && (
                    <div className="lg:hidden bg-white border-t border-gray-200 p-4">
                        <button
                            onClick={() => setShowCart(true)}
                            className="btn-primary w-full py-3.5 flex items-center justify-between text-base"
                        >
                            <span className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount} item
                            </span>
                            <span className="font-bold">{formatCurrency(total)}</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Cart Section */}
            <div className={`lg:w-[400px] bg-white border-l border-gray-200 flex flex-col shadow-xl ${showCart ? 'flex fixed inset-0 z-50 lg:relative' : 'hidden lg:flex'}`}>
                {/* Mobile Cart Header */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                    <button
                        onClick={() => setShowCart(false)}
                        className="flex items-center gap-2 text-gray-600 font-medium"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Kembali
                    </button>
                    <h2 className="font-semibold text-gray-900">Keranjang</h2>
                    <div className="w-20"></div>
                </div>

                {/* Customer Profile */}
                <div className="p-5 border-b border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Customer Profile
                    </h3>
                    <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-500" />
                            </div>
                            <span className="font-medium text-gray-900">Budi Santoso (Reseller)</span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>
                    <div className="flex items-center justify-between mt-3">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
                            <Star className="h-3 w-3" />
                            Reseller Price Active
                        </span>
                        <span className="text-xs text-gray-500">ID: #CUS-8821</span>
                    </div>
                </div>

                {/* Order Header */}
                <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Current Order</h3>
                    {cart.length > 0 && (
                        <button onClick={clearCart} className="text-sm text-primary-600 font-medium hover:text-primary-700">
                            Clear All
                        </button>
                    )}
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {cart.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="h-16 w-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <ShoppingCart className="h-8 w-8 text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-medium">Keranjang kosong</p>
                            <p className="text-sm text-gray-400 mt-1">Klik produk untuk menambahkan</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-start gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                                        <ShoppingCart className="h-6 w-6 text-amber-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-500">@ {formatCurrency(item.price)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900 mb-2">
                                            {formatCurrency(item.price * item.qty)}
                                        </p>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => updateQty(item.id, -1)}
                                                className="h-7 w-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                            >
                                                <Minus className="h-3.5 w-3.5 text-gray-600" />
                                            </button>
                                            <span className="w-7 text-center text-sm font-medium">{item.qty}</span>
                                            <button
                                                onClick={() => updateQty(item.id, 1)}
                                                className="h-7 w-7 rounded-lg bg-primary-500 flex items-center justify-center hover:bg-primary-600 transition-colors"
                                            >
                                                <Plus className="h-3.5 w-3.5 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div className="border-t border-gray-200 p-5 space-y-4 bg-gray-50">
                    {/* Points Earned */}
                    {cart.length > 0 && (
                        <div className="flex items-center justify-between py-2.5 px-4 bg-amber-50 rounded-xl">
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-amber-500" />
                                <span className="text-sm font-medium text-amber-700">Points Earned</span>
                            </div>
                            <span className="font-semibold text-primary-600">+{pointsEarned} pts</span>
                        </div>
                    )}

                    {/* Totals */}
                    <div className="space-y-2.5">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="text-gray-900 font-medium">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tax (11% PPN)</span>
                            <span className="text-gray-900 font-medium">{formatCurrency(tax)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Discount</span>
                            <span className="text-primary-600 font-medium">- Rp 0</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <span className="font-medium text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</span>
                    </div>

                    <button
                        className="btn-primary w-full py-4 text-lg font-semibold rounded-xl"
                        disabled={cart.length === 0}
                    >
                        💳 Bayar
                    </button>
                </div>
            </div>
        </div>
    );
}
