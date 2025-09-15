import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import BuyPage from "./components/BuyPage";
import SellPage from "./components/SellPage";
import ProductsPage from "./components/ProductsPage";
import CartPage from "./components/CartPage";
import AboutPage from "./components/AboutPage";
import ProductDetailPage from "./components/ProductDetailPage";
import CreateStorePage from "./components/CreateStorePage";
import MyStoresPage from "./components/MyStoresPage";
import ProtectedRoute from "./context/ProtectedRoute";

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
            <Route element={<ProtectedRoute />}>
              <Route path="/sell" element={<SellPage />} />
              <Route path="/mystores" element={<MyStoresPage />} />
              <Route path="/createstore" element={<CreateStorePage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
