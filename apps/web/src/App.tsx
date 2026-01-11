import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout';

// Pages
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';

// Catalog
import ProductsPage from '@/pages/catalog/ProductsPage';
import RawMaterialsPage from '@/pages/catalog/RawMaterialsPage';
import CategoriesPage from '@/pages/catalog/CategoriesPage';
import BrandsPage from '@/pages/catalog/BrandsPage';
import RecipesPage from '@/pages/catalog/RecipesPage';
import BundlesPage from '@/pages/catalog/BundlesPage';

// Pricing
import PriceLevelsPage from '@/pages/pricing/PriceLevelsPage';
import ProductPricesPage from '@/pages/pricing/ProductPricesPage';
import PointsConfigPage from '@/pages/pricing/PointsConfigPage';

// Customers
import CustomersPage from '@/pages/customers/CustomersPage';
import CustomerLevelsPage from '@/pages/customers/CustomerLevelsPage';
import PointsHistoryPage from '@/pages/customers/PointsHistoryPage';

// Inventory
import InventoryProductsPage from '@/pages/inventory/InventoryProductsPage';
import InventoryMaterialsPage from '@/pages/inventory/InventoryMaterialsPage';
import PurchaseOrdersPage from '@/pages/inventory/PurchaseOrdersPage';
import TransfersPage from '@/pages/inventory/TransfersPage';
import AdjustmentsPage from '@/pages/inventory/AdjustmentsPage';

// Transactions
import TransactionsPage from '@/pages/transactions/TransactionsPage';
import ShiftsPage from '@/pages/transactions/ShiftsPage';
import POSPage from '@/pages/pos/POSPage';

// Reports
import SalesReportPage from '@/pages/reports/SalesReportPage';
import BalanceSheetPage from '@/pages/reports/BalanceSheetPage';
import ProfitLossPage from '@/pages/reports/ProfitLossPage';
import HppReportPage from '@/pages/reports/HppReportPage';
import ExportPage from '@/pages/reports/ExportPage';

// Settings
import AccountSettingsPage from '@/pages/settings/AccountSettingsPage';
import OutletSettingsPage from '@/pages/settings/OutletSettingsPage';
import EmployeesPage from '@/pages/settings/EmployeesPage';
import PaymentMethodsPage from '@/pages/settings/PaymentMethodsPage';
import TaxesPage from '@/pages/settings/TaxesPage';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

export default function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<DashboardPage />} />

                {/* Katalog */}
                <Route path="catalog">
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="raw-materials" element={<RawMaterialsPage />} />
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route path="brands" element={<BrandsPage />} />
                    <Route path="recipes" element={<RecipesPage />} />
                    <Route path="bundles" element={<BundlesPage />} />
                </Route>

                {/* Harga & Level */}
                <Route path="pricing">
                    <Route path="levels" element={<PriceLevelsPage />} />
                    <Route path="products" element={<ProductPricesPage />} />
                    <Route path="points" element={<PointsConfigPage />} />
                </Route>

                {/* Pelanggan */}
                <Route path="customers">
                    <Route index element={<CustomersPage />} />
                    <Route path="levels" element={<CustomerLevelsPage />} />
                    <Route path="points" element={<PointsHistoryPage />} />
                </Route>

                {/* Inventory */}
                <Route path="inventory">
                    <Route path="products" element={<InventoryProductsPage />} />
                    <Route path="raw-materials" element={<InventoryMaterialsPage />} />
                    <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
                    <Route path="transfers" element={<TransfersPage />} />
                    <Route path="adjustments" element={<AdjustmentsPage />} />
                </Route>

                {/* Transaksi */}
                <Route path="transactions">
                    <Route index element={<TransactionsPage />} />
                    <Route path="shifts" element={<ShiftsPage />} />
                </Route>

                {/* Laporan */}
                <Route path="reports">
                    <Route path="sales" element={<SalesReportPage />} />
                    <Route path="balance-sheet" element={<BalanceSheetPage />} />
                    <Route path="profit-loss" element={<ProfitLossPage />} />
                    <Route path="hpp" element={<HppReportPage />} />
                    <Route path="export" element={<ExportPage />} />
                </Route>

                {/* Pengaturan */}
                <Route path="settings">
                    <Route path="account" element={<AccountSettingsPage />} />
                    <Route path="outlet" element={<OutletSettingsPage />} />
                    <Route path="employees" element={<EmployeesPage />} />
                    <Route path="payment-methods" element={<PaymentMethodsPage />} />
                    <Route path="taxes" element={<TaxesPage />} />
                </Route>
            </Route>

            {/* POS - Full screen */}
            <Route
                path="/pos"
                element={
                    <ProtectedRoute>
                        <POSPage />
                    </ProtectedRoute>
                }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
