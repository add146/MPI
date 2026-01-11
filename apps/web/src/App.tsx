import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout';

// Pages
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import ProductsPage from '@/pages/catalog/ProductsPage';
import RawMaterialsPage from '@/pages/catalog/RawMaterialsPage';
import RecipesPage from '@/pages/catalog/RecipesPage';
import BundlesPage from '@/pages/catalog/BundlesPage';
import CustomersPage from '@/pages/customers/CustomersPage';
import PriceLevelsPage from '@/pages/pricing/PriceLevelsPage';
import TransactionsPage from '@/pages/transactions/TransactionsPage';
import ReportsPage from '@/pages/reports/ReportsPage';
import POSPage from '@/pages/pos/POSPage';

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

                {/* Catalog */}
                <Route path="catalog">
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="raw-materials" element={<RawMaterialsPage />} />
                    <Route path="recipes" element={<RecipesPage />} />
                    <Route path="bundles" element={<BundlesPage />} />
                </Route>

                {/* Pricing */}
                <Route path="pricing">
                    <Route path="levels" element={<PriceLevelsPage />} />
                </Route>

                {/* Customers */}
                <Route path="customers" element={<CustomersPage />} />

                {/* Transactions */}
                <Route path="transactions" element={<TransactionsPage />} />

                {/* Reports */}
                <Route path="reports" element={<ReportsPage />} />
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
