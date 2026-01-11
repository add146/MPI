import { useState } from 'react';
import {
    Search,
    Plus,
    Minus,
    Trash2,
    CreditCard,
    Banknote,
    QrCode,
    User,
    ShoppingCart,
    X,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CartItem {
    id: string;
    name: string;
    price: number;
    qty: number;
}

export default function POSPage() {
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

    // Sample products
    const products = [
        { id: '1', name: 'Roti Tawar', price: 18000, category: 'Makanan' },
        { id: '2', name: 'Kopi Susu Aren', price: 18000, category: 'Minuman' },
        { id: '3', name: 'Donat Coklat', price: 8000, category: 'Snack' },
        { id: '4', name: 'Croissant Butter', price: 15000, category: 'Makanan' },
        { id: '5', name: 'Teh Manis', price: 8000, category: 'Minuman' },
        { id: '6', name: 'Es Kopi Susu', price: 20000, category: 'Minuman' },
        { id: '7', name: 'Kentang Goreng', price: 15000, category: 'Snack' },
        { id: '8', name: 'Sandwich Tuna', price: 25000, category: 'Makanan' },
    ];

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

    const removeItem = (id: string) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = Math.round(subtotal * 0.11);
    const total = subtotal + tax;

    return (
        <div className="h-[calc(100vh-64px)] flex bg-gray-100 -m-4 lg:-m-6">
            {/* Products Section */}
            <div className="flex-1 p-4 overflow-hidden flex flex-col">
                {/* Search */}
                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    <button className="px-4 py-2 rounded-lg bg-primary-500 text-white font-medium whitespace-nowrap">
                        Semua
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-white text-gray-700 font-medium whitespace-nowrap hover:bg-gray-50">
                        Makanan
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-white text-gray-700 font-medium whitespace-nowrap hover:bg-gray-50">
                        Minuman
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-white text-gray-700 font-medium whitespace-nowrap hover:bg-gray-50">
                        Snack
                    </button>
                </div>

                {/* Products Grid */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {products.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="bg-white p-4 rounded-xl text-left hover:shadow-md transition-shadow border border-gray-100"
                            >
                                <div className="h-16 w-16 rounded-lg bg-gray-100 mb-3 flex items-center justify-center">
                                    <ShoppingCart className="h-6 w-6 text-gray-400" />
                                </div>
                                <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
                                <p className="text-primary-600 font-semibold">{formatCurrency(product.price)}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cart Section */}
            <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
                {/* Cart Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold text-gray-900">Keranjang</h2>
                        <span className="badge badge-primary">{cart.length} item</span>
                    </div>
                    <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-left">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                            {selectedCustomer || 'Pilih Pelanggan'}
                        </span>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {cart.length === 0 ? (
                        <div className="text-center py-8">
                            <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                            <p className="text-gray-500">Keranjang kosong</p>
                            <p className="text-sm text-gray-400">Klik produk untuk menambahkan</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 py-2">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQty(item.id, -1)}
                                            className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.qty}</span>
                                        <button
                                            onClick={() => updateQty(item.id, 1)}
                                            className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="h-8 w-8 rounded-lg hover:bg-red-50 flex items-center justify-center"
                                        >
                                            <X className="h-4 w-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cart Summary */}
                <div className="p-4 border-t border-gray-200 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">PPN (11%)</span>
                        <span className="text-gray-900">{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span className="text-primary-600">{formatCurrency(total)}</span>
                    </div>

                    {/* Payment Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                        <button className="flex flex-col items-center gap-1 p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100">
                            <Banknote className="h-5 w-5" />
                            <span className="text-xs font-medium">Tunai</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 p-3 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100">
                            <QrCode className="h-5 w-5" />
                            <span className="text-xs font-medium">QRIS</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100">
                            <CreditCard className="h-5 w-5" />
                            <span className="text-xs font-medium">Kartu</span>
                        </button>
                    </div>

                    <button
                        className="btn-primary w-full py-3 text-lg"
                        disabled={cart.length === 0}
                    >
                        Bayar {formatCurrency(total)}
                    </button>
                </div>
            </div>
        </div>
    );
}
