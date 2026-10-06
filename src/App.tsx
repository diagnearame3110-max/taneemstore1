import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProductsProvider } from './store/ProductsContext';
import { AuthProvider } from './store/AuthContext';
import { ToastProvider } from './store/ToastContext';
import { CartProvider } from './store/CartContext';
import { WishlistProvider } from './store/WishlistContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/admin/ProtectedRoute';
import StorePage from './pages/StorePage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsPage from './pages/admin/ProductsPage';
import ProductFormPage from './pages/admin/ProductFormPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import OrdersPage from './pages/admin/OrdersPage';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ProductsProvider>
            <ToastProvider>
              <CartProvider>
                <WishlistProvider>
                  <Routes>
                    <Route path="/" element={<StorePage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />

                    <Route path="/admin/login" element={<LoginPage />} />

                    <Route path="/admin" element={
                      <ProtectedRoute><DashboardPage /></ProtectedRoute>
                    } />
                    <Route path="/admin/orders" element={
                      <ProtectedRoute><OrdersPage /></ProtectedRoute>
                    } />
                    <Route path="/admin/products" element={
                      <ProtectedRoute><ProductsPage /></ProtectedRoute>
                    } />
                    <Route path="/admin/products/new" element={
                      <ProtectedRoute><ProductFormPage /></ProtectedRoute>
                    } />
                    <Route path="/admin/products/:id/edit" element={
                      <ProtectedRoute><ProductFormPage /></ProtectedRoute>
                    } />
                    <Route path="/admin/categories" element={
                      <ProtectedRoute><CategoriesPage /></ProtectedRoute>
                    } />

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </WishlistProvider>
              </CartProvider>
            </ToastProvider>
          </ProductsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
