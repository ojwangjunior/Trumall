# State Management

Trumall uses the **React Context API** for global state management. This avoids prop-drilling and provides a centralized way to manage application-wide data.

## Core Contexts

### 1. AuthContext (`src/context/AuthContext.jsx`)
Manages the user's authentication state, including:
- `user`: The current user object.
- `token`: JWT for API authentication.
- `login()`: Function to authenticate the user and store the token.
- `logout()`: Function to clear the session.

### 2. CartProvider (`src/context/CartProvider.jsx`)
Handles the shopping cart functionality:
- `items`: List of products in the cart.
- `addToCart()`: Adds a product to the cart.
- `removeFromCart()`: Removes a product.
- `updateQuantity()`: Adjusts the number of items.
- `clearCart()`: Resets the cart.

### 3. ToastContext (`src/context/ToastContext.jsx`)
Provides a global notification system for success, error, and info messages.

## Usage Pattern

To use any of these contexts in a component:

```javascript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, logout } = useAuth();
  // ...
};
```
