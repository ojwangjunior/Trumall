import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { CartProvider } from './context/CartProvider';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext'; // Import ToastProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider> {/* ToastProvider should wrap CartProvider */}
        <CartProvider>
          <App />
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
);
