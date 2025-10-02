import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import HomePage from "./pages/HomePage";
import Footer from "./components/layout/Footer";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import BuyPage from "./pages/BuyPage";
import SellPage from "./pages/SellPage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CreateStorePage from "./pages/CreateStorePage";
import MyStoresPage from "./pages/MyStoresPage";
import MyAccountPage from "./pages/MyAccountPage";
import OrdersPage from "./pages/OrdersPage"; // Import OrdersPage
import AddressManagementPage from "./pages/AddressManagementPage";
import ProtectedRoute from "./context/ProtectedRoute";
import StoreDetailPage from "./pages/StoreDetailPage";
import EditStorePage from "./pages/EditStorePage";
import EditProductPage from "./pages/EditProductPage";
import SellerProtectedRoute from "./context/SellerProtectedRoute";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/buy" element={<BuyPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/mystores" element={<MyStoresPage />} />
              <Route path="/account" element={<MyAccountPage />} />
              <Route path="/account/addresses" element={<AddressManagementPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/store/:id" element={<StoreDetailPage />} />
              <Route path="/store/:id/edit" element={<EditStorePage />} />
              <Route path="/product/:id/edit" element={<EditProductPage />} />
            </Route>
            <Route element={<SellerProtectedRoute />}>
              <Route path="/sell" element={<SellPage />} />
              <Route path="/createstore" element={<CreateStorePage />} />
              <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
