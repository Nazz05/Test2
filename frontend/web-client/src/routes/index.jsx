import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Login from "../pages/Login";
import Home from "../pages/Home/Home";
import Nam from "../pages/Nam/Nam";
import Nu from "../pages/Nu/Nu";
import Giay from "../pages/Giay/Giay";
import Dep from "../pages/Dep/Dep";
import ProductDetailPage from "../pages/ProductDetail/ProductDetail";
import RegisterPage from "../pages/Register/Register";
import CartPage from "../pages/Cart/Cart";
import ProfilePage from "../pages/Profile/Profile";
import AddressPage from "../pages/Address/Address";
import PaymentPage from "../pages/Payment/Payment";
import SearchPage from "../pages/Search/Search";
import TestAPI from "../pages/TestAPI/TestAPI";
import ProductListPage from "../pages/ProductList/ProductList";
import AdminDashboardPage from "../pages/AdminDashboard/AdminDashboard";
import UserManagementPage from "../pages/AdminDashboard/UserManagementPage";
import OrderManagementPage from "../pages/AdminDashboard/OrderManagementPage";
import RevenueDashboardPage from "../pages/AdminDashboard/RevenueDashboardPage";
import PrivateRoute from "./PrivateRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/test-api" element={<TestAPI />} />

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetailPage />}
        />

        <Route
          path="/nam"
          element={<Nam />}
        />

        <Route
          path="/nu"
          element={<Nu />}
        />

        <Route
          path="/giay"
          element={<Giay />}
        />

        <Route
          path="/phu-kien"
          element={<Dep />}
        />

        <Route
          path="/search"
          element={<SearchPage />}
        />

        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/address"
          element={
            <PrivateRoute>
              <AddressPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <PrivateRoute adminOnly={true}>
              <OrderManagementPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <PrivateRoute adminOnly={true}>
              <UserManagementPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/revenue"
          element={
            <PrivateRoute adminOnly={true}>
              <RevenueDashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/products"
          element={<ProductListPage />}
        />

        <Route
          path="/payment"
          element={
            <PrivateRoute>
              <PaymentPage />
            </PrivateRoute>
          }
        />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;
