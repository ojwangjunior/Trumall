# Routing and Protection

The application uses `react-router-dom` for client-side routing. Routes are defined in `src/App.jsx`.

## Public Routes

These routes are accessible to everyone:
- `/`: Home Page
- `/signin`: Sign In
- `/signup`: Sign Up
- `/buy`: Browse products
- `/products`: Product listing
- `/product/:id`: Product detail
- `/cart`: Shopping cart
- `/search`: Search results
- `/about`: About page

## Protected Routes

The application uses a `ProtectedRoute` component to wrap routes that require an authenticated user.

- `/wishlist`: User's saved items
- `/mystores`: Stores owned by the user
- `/account`: User profile management
- `/account/addresses`: Shipping/Billing addresses
- `/orders`: User order history
- `/store/:id`: Store details
- `/store/:id/edit`: Edit store details
- `/product/:id/edit`: Edit product details

## Seller Protected Routes

Routes that require the user to have a "seller" role are wrapped in `SellerProtectedRoute`.

- `/sell`: Landing page for sellers
- `/createstore`: Create a new store
- `/seller/dashboard`: Dashboard for managing store and products

## Implementation

Routing logic can be found in `src/App.jsx`. Authentication guards are implemented in `src/context/ProtectedRoute.jsx` and `src/context/SellerProtectedRoute.jsx`.
