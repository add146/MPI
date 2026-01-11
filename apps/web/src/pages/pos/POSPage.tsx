import { useState } from 'react';
import {
    Search,
    Plus,
    Minus,
    X,
    User,
    ShoppingCart,
    Star,
    ChevronDown,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';

interface CartItem {
    id: string;
    name: string;
    price: number;
    qty: number;
    image?: string;
}

export default function POSPage() {
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<{
        name: string;
        level: string;
        id: string;
    } | null>(null);
    const [activeCategory, setActiveCategory] = useState('all');
    const { user, outlets } = useAuthStore();

    const categories = [
        { id: 'all', name: 'All Items', icon: '🏷️' },
        { id: 'bakery', name: 'Bakery', icon: '🥐' },
        { id: 'drinks', name: 'Drinks', icon: '☕' },
        { id: 'bundles', name: 'Bundles', icon: '📦' },
        { id: 'meals', name: 'Meals', icon: '🍽️' },
    ];

    // Sample products with images
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
    const discount = 0;
    const total = subtotal + tax - discount;
    const pointsEarned = Math.floor(subtotal / 1000);

    return (
        <div className="h-[calc(100vh-64px)] flex -m-4 lg:-m-6">
            {/* Left Side - Products */}
            <div className="flex-1 flex flex-col bg-gray-50">
                {/* Top Header */}
                <div className="bg-primary-600 text-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold">MPI POS</h1>
                            <p className="text-primary-100 text-sm flex items-center gap-2">
                                <span className="h-2 w-2 bg-green-400 rounded-full"></span>
                                Online • {outlets[0]?.name || 'Outlet'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="font-medium">{user?.name}</p>
                                <p className="text-primary-100 text-sm">Kasir</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                                <span className="text-primary-600 font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="px-6 py-4 bg-white border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products (e.g., Roti, Kopi, Bundle)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="px-6 py-3 bg-white border-b border-gray-200">
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${activeCategory === cat.id
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredProducts.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="bg-white rounded-xl p-4 text-left hover:shadow-lg transition-shadow border border-gray-100 group relative"
                            >
                                {product.isBundle && (
                                    <span className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                                        BUNDLE
                                    </span>
                                )}
                                <div className="h-24 w-full rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 mb-3 flex items-center justify-center">
                                    <ShoppingCart className="h-8 w-8 text-amber-300" />
                                </div>
                                <h3 className="font-medium text-gray-900 mb-0.5 line-clamp-2">{product.name}</h3>
                                <p className="text-xs text-gray-500 mb-2">{product.subtext}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-primary-600 font-semibold">
                                        {formatCurrency(product.price)}
                                    </span>
                                    <span className="h-7 w-7 rounded-full bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center">
                                        <Plus className="h-4 w-4 text-gray-500 group-hover:text-primary-600" />
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Cart */}
            <div className="w-[380px] bg-white border-l border-gray-200 flex flex-col">
                {/* Customer Profile Section */}
                <div className="p-5 border-b border-gray-200">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                        Customer Profile
                    </h3>
                    <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-500" />
                            </div>
                            <span className="font-medium text-gray-900">
                                {selectedCustomer?.name || 'Budi Santoso (Reseller)'}
                            </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>
                    <div className="flex items-center justify-between mt-3">
                        <span className="badge badge-primary text-xs">
                            ★ Reseller Price Active
                        </span>
                        <span className="text-xs text-gray-500">ID: #CUS-8821</span>
                    </div>
                </div>

                {/* Current Order */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Current Order</h3>
                        {cart.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto px-5 py-3">
                        {cart.length === 0 ? (
                            <div className="text-center py-12">
                                <ShoppingCart className="h-12 w-12 mx-auto text-gray-200 mb-3" />
                                <p className="text-gray-500 font-medium">No items yet</p>
                                <p className="text-sm text-gray-400">Click products to add to order</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 py-2">
                                        <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                                            <ShoppingCart className="h-5 w-5 text-amber-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{item.name}</p>
                                            <p className="text-sm text-gray-500">@ {formatCurrency(item.price)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900 w-20 text-right">
                                                {formatCurrency(item.price * item.qty)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {cart.map((item) => (
                                    <div key={`qty-${item.id}`} className="flex items-center justify-end gap-2 -mt-2 pr-1">
                                        <button
                                            onClick={() => updateQty(item.id, -1)}
                                            className="h-7 w-7 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                        >
                                            <Minus className="h-3.5 w-3.5 text-gray-600" />
                                        </button>
                                        <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                                        <button
                                            onClick={() => updateQty(item.id, 1)}
                                            className="h-7 w-7 rounded bg-primary-500 flex items-center justify-center hover:bg-primary-600"
                                        >
                                            <Plus className="h-3.5 w-3.5 text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary & Payment */}
                <div className="border-t border-gray-200 p-5 space-y-3 bg-gray-50">
                    {/* Points Earned */}
                    {cart.length > 0 && (
                        <div className="flex items-center justify-between py-2 px-3 bg-amber-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-amber-500" />
                                <span className="text-sm font-medium text-amber-700">Points Earned</span>
                            </div>
                            <span className="font-semibold text-primary-600">+{pointsEarned} pts</span>
                        </div>
                    )}

                    {/* Totals */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tax (11% PPN)</span>
                            <span className="text-gray-900">{formatCurrency(tax)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Discount</span>
                            <span className="text-primary-600">- {formatCurrency(discount)}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <span className="font-medium text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</span>
                    </div>

                    <button
                        className="btn-primary w-full py-3.5 text-lg font-semibold"
                        disabled={cart.length === 0}
                    >
                        💳 Bayar
                    </button>
                </div>
            </div>
        </div>
    );
}
