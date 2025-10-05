# Role-Based Integration Guide
## Frontend ↔ Backend Connection Documentation

---

## 🎯 Overview

This guide documents the complete role-based authentication and authorization system connecting the Trumall frontend and backend.

**Status**: ✅ **Fully Aligned and Working**

---

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Backend Implementation](#backend-implementation)
3. [Frontend Implementation](#frontend-implementation)
4. [API Contract](#api-contract)
5. [Role-Based Features](#role-based-features)
6. [Testing Guide](#testing-guide)
7. [Common Issues](#common-issues)

---

## System Architecture

### Role Flow Diagram

```
User Registration
     ↓
Backend creates User with roles: ["buyer"] or ["seller"]
     ↓
JWT generated with roles claim
     ↓
Frontend stores JWT in localStorage
     ↓
Frontend fetches /api/me → receives user with roles array
     ↓
Role-based routing and UI rendering
```

### Supported Roles

| Role | Value | Capabilities |
|------|-------|--------------|
| Buyer | `"buyer"` | Browse, purchase, cart, orders |
| Seller | `"seller"` | All buyer + create stores, list products, manage orders |
| Admin | `"admin"` | All seller + shipping management, platform administration |

**Note**: Users can have multiple roles simultaneously (e.g., `["buyer", "seller"]`)

---

## Backend Implementation

### User Model

**File**: `internal/models/models.go`

```go
type User struct {
    ID           uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
    Email        string         `gorm:"uniqueIndex;not null" json:"email"`
    PasswordHash string         `gorm:"not null" json:"-"`
    Name         string         `json:"name"`
    Roles        pq.StringArray `gorm:"type:text[]" json:"roles"` // PostgreSQL array
    CreatedAt    time.Time      `json:"created_at"`
    UpdatedAt    time.Time      `json:"updated_at"`
    Addresses    []Address      `json:"addresses" gorm:"foreignKey:UserID"`
}
```

**Key Points:**
- Field name: `Roles` (capital R, plural)
- JSON key: `"roles"` (lowercase, plural)
- Type: `[]string` via `pq.StringArray`
- Database: PostgreSQL `text[]` array column

### Authentication Handlers

**File**: `internal/handlers/auth.go`

#### Registration Endpoint
```go
POST /api/auth/register

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer"  // Single role as string
}

Response:
{
  "data": {
    "token": "eyJhbGc..." // JWT with roles claim
  }
}
```

**Backend Logic:**
```go
role := "buyer"
if body.Role == "seller" {
    role = "seller"
}

user := models.User{
    // ...
    Roles: pq.StringArray{role}, // Converts to array
}

token, err := generateToken(user.ID.String(), user.Roles)
```

#### Login Endpoint
```go
POST /api/auth/login

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "data": {
    "token": "eyJhbGc..."
  }
}
```

#### Get Current User
```go
GET /api/me
Headers: Authorization: Bearer <token>

Response:
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "roles": ["buyer", "seller"], // Array of roles
  "created_at": "2025-10-01T12:00:00Z",
  "updated_at": "2025-10-01T12:00:00Z"
}
```

### JWT Token Structure

```json
{
  "sub": "user-uuid-here",
  "roles": ["buyer", "seller"], // Array
  "exp": 1735689600
}
```

### Middleware

**File**: `internal/middleware/auth.go`

#### RequireAuth Middleware
- Validates JWT token
- Extracts user ID and roles from claims
- Fetches user from database
- Attaches to context: `c.Locals("user", user)` and `c.Locals("user_roles", roles)`

#### RequireRole Middleware
```go
func RequireRole(role string) fiber.Handler {
    return func(c *fiber.Ctx) error {
        roles := c.Locals("user_roles").([]string)
        for _, r := range roles {
            if r == role {
                return c.Next()
            }
        }
        return c.Status(403).JSON(fiber.Map{"error": "forbidden"})
    }
}
```

### Protected Endpoints

#### Seller-Only Endpoints
```go
// Requires "seller" role
POST   /api/stores/:id/products          - Create product
GET    /api/seller/products               - List seller's products
DELETE /api/seller/products/:id           - Delete product
GET    /api/seller/orders                 - View seller orders
PUT    /api/seller/orders/:id             - Update order status
POST   /api/createstore                   - Create store
GET    /api/my-stores                     - View my stores
```

#### Admin-Only Endpoints
```go
// Requires "admin" role
POST   /api/admin/shipping/methods        - Create shipping method
GET    /api/admin/shipping/methods        - List shipping methods
PUT    /api/admin/shipping/methods/:id    - Update shipping method
DELETE /api/admin/shipping/methods/:id    - Delete shipping method
POST   /api/admin/shipping/zones          - Create shipping zone
GET    /api/admin/shipping/zones          - List shipping zones
PUT    /api/admin/shipping/zones/:id      - Update shipping zone
DELETE /api/admin/shipping/zones/:id      - Delete shipping zone
POST   /api/admin/shipping/rules          - Create shipping rule
GET    /api/admin/shipping/rules          - List shipping rules
PUT    /api/admin/shipping/rules/:id      - Update shipping rule
DELETE /api/admin/shipping/rules/:id      - Delete shipping rule
```

#### Authenticated (Any Role)
```go
// Requires valid JWT (any role)
GET    /api/me                            - Get current user
POST   /api/cart/add                      - Add to cart
GET    /api/cart                          - View cart
POST   /api/cart/checkout                 - Checkout
GET    /api/orders                        - View orders
POST   /api/addresses                     - Create address
GET    /api/addresses                     - List addresses
POST   /api/shipping/calculate            - Calculate shipping
```

---

## Frontend Implementation

### Auth Context

**File**: `frontend/src/context/AuthContext.jsx`

```javascript
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user from /api/me
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await axios.get(`/api/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data); // Contains roles array
    }
  }, []);

  // Registration
  const register = async (name, email, password, role) => {
    const response = await axios.post('/api/auth/register', {
      name, email, password, role  // Single role string
    });
    const { token } = response.data.data;
    localStorage.setItem("token", token);
    await fetchUser(); // Fetches user with roles array
  };

  // Login
  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', {
      email, password
    });
    const { token } = response.data.data;
    localStorage.setItem("token", token);
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Key Points:**
- `register()` sends single `role` string
- `fetchUser()` receives `user` with `roles` array
- `user.roles` is always an array: `["buyer"]`, `["seller"]`, or `["buyer", "seller"]`

### Role Utilities

**File**: `frontend/src/utils/roleHelpers.js`

```javascript
// Get primary role for display
export const getPrimaryRole = (roles) => {
  if (!roles || roles.length === 0) return 'buyer';
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('seller')) return 'seller';
  return roles[0] || 'buyer';
};

// Check if user has specific role
export const hasRole = (roles, role) => {
  return roles && roles.includes(role);
};

// Format role for display
export const formatRole = (role) => {
  if (!role) return '';
  return role.charAt(0).toUpperCase() + role.slice(1);
};
```

### Protected Routes

**File**: `frontend/src/context/ProtectedRoute.jsx`

```javascript
const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/signin" />;
};
```

**File**: `frontend/src/context/SellerProtectedRoute.jsx`

```javascript
const SellerProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/signin" />;

  // Check roles array
  if (!user.roles || !user.roles.includes('seller')) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};
```

### Route Configuration

**File**: `frontend/src/App.jsx`

```javascript
<Routes>
  {/* Public routes */}
  <Route path="/" element={<HomePage />} />
  <Route path="/signin" element={<SigninPage />} />
  <Route path="/signup" element={<SignupPage />} />
  <Route path="/buy" element={<BuyPage />} />
  <Route path="/products" element={<ProductsPage />} />

  {/* Authenticated routes (any role) */}
  <Route element={<ProtectedRoute />}>
    <Route path="/account" element={<MyAccountPage />} />
    <Route path="/orders" element={<OrdersPage />} />
    <Route path="/cart" element={<CartPage />} />
  </Route>

  {/* Seller-only routes */}
  <Route element={<SellerProtectedRoute />}>
    <Route path="/sell" element={<SellPage />} />
    <Route path="/createstore" element={<CreateStorePage />} />
    <Route path="/mystores" element={<MyStoresPage />} />
    <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
  </Route>
</Routes>
```

### Role-Based UI Components

#### Account Dropdown
**File**: `frontend/src/components/layout/header/AccountDropdown.jsx`

```javascript
import { getPrimaryRole, formatRole } from '../../../utils/roleHelpers';

// Display user role
<p className="text-xs text-orange-500">
  {formatRole(getPrimaryRole(user.roles))}
</p>
```

#### Seller Dashboard Card
**File**: `frontend/src/components/account/SellerDashboardCard.jsx`

```javascript
const SellerDashboardCard = ({ user }) => {
  return (
    user.roles && user.roles.includes("seller") && (
      <Link to="/seller/dashboard">
        {/* Seller dashboard card content */}
      </Link>
    )
  );
};
```

---

## API Contract

### Registration

**Endpoint**: `POST /api/auth/register`

**Frontend Sends:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "buyer"  // or "seller"
}
```

**Backend Returns:**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Frontend Action:**
1. Store token in `localStorage`
2. Call `/api/me` to fetch user with roles
3. Redirect to dashboard

### Login

**Endpoint**: `POST /api/auth/login`

**Frontend Sends:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Backend Returns:**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User

**Endpoint**: `GET /api/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Backend Returns:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@example.com",
  "name": "John Doe",
  "roles": ["buyer", "seller"],  // Array
  "created_at": "2025-10-01T12:00:00Z",
  "updated_at": "2025-10-01T12:00:00Z",
  "addresses": []
}
```

---

## Role-Based Features

### Buyer Features

✅ **Available to All Users (Default)**

- Browse products
- Search and filter
- Add to cart
- Checkout
- View orders
- Manage addresses
- View shipping options
- Payment processing

### Seller Features

✅ **Available to Users with "seller" Role**

All buyer features PLUS:

- Create stores
- List products
- Upload product images
- Edit products
- Delete products
- View seller dashboard
- Manage seller orders
- Update order status

**UI Changes:**
- Seller Dashboard card visible on account page
- "Sell" navigation link visible
- "My Stores" link visible

### Admin Features

✅ **Available to Users with "admin" Role**

All seller features PLUS:

- Manage shipping methods
- Manage shipping zones
- Manage shipping rules
- Platform-wide settings

---

## Testing Guide

### Test Scenarios

#### 1. Buyer Registration & Login
```bash
# Register as buyer
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Buyer",
    "email": "buyer@test.com",
    "password": "password123",
    "role": "buyer"
  }'

# Response: { "data": { "token": "..." } }

# Get user details
curl -X GET http://localhost:8080/api/me \
  -H "Authorization: Bearer <token>"

# Response: { "roles": ["buyer"], ... }
```

#### 2. Seller Registration & Access
```bash
# Register as seller
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Seller",
    "email": "seller@test.com",
    "password": "password123",
    "role": "seller"
  }'

# Access seller-only endpoint
curl -X GET http://localhost:8080/api/seller/products \
  -H "Authorization: Bearer <token>"

# Should succeed with 200 OK
```

#### 3. Role-Based Access Control
```bash
# Try to access seller endpoint as buyer
curl -X GET http://localhost:8080/api/seller/products \
  -H "Authorization: Bearer <buyer-token>"

# Should fail with 403 Forbidden
# Response: { "error": "forbidden: insufficient role" }
```

### Frontend Testing

#### 1. Buyer Flow
1. Visit `/signup`
2. Select "Buyer - I want to shop"
3. Complete registration
4. Verify redirect to home
5. Check account dropdown shows "Buyer"
6. Verify no "Sell" link in navigation
7. Verify no seller dashboard card on account page

#### 2. Seller Flow
1. Visit `/signup`
2. Select "Seller - I want to sell products"
3. Complete registration
4. Verify redirect to home
5. Check account dropdown shows "Seller"
6. Verify "Sell" link visible in navigation
7. Click "Sell" → should access sell page
8. Visit `/account` → should see seller dashboard card

#### 3. Protected Routes
1. Try to access `/sell` without login
   - Expected: Redirect to `/signin`
2. Login as buyer
3. Try to access `/sell`
   - Expected: Redirect to `/unauthorized`
4. Logout and login as seller
5. Access `/sell`
   - Expected: Success, show sell page

---

## Common Issues & Solutions

### Issue 1: Role Shows as "undefined"

**Symptom**: User role displays as `undefined` in UI

**Cause**: Using `user.role` instead of `user.roles`

**Solution**:
```javascript
// ❌ Wrong
<p>{user.role}</p>

// ✅ Correct
import { getPrimaryRole, formatRole } from '../utils/roleHelpers';
<p>{formatRole(getPrimaryRole(user.roles))}</p>
```

### Issue 2: Seller Can't Access Seller Routes

**Symptom**: Seller user redirected to `/unauthorized`

**Causes**:
1. JWT doesn't contain roles claim
2. Backend not returning roles in `/api/me`
3. Frontend checking wrong field

**Debug Steps**:
```javascript
// 1. Check JWT payload
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('JWT roles:', payload.roles);

// 2. Check user object
console.log('User roles:', user.roles);

// 3. Check protection logic
if (!user.roles || !user.roles.includes('seller')) {
  console.log('Missing seller role');
}
```

### Issue 3: 401 Unauthorized on Protected Endpoints

**Symptom**: API calls return 401

**Causes**:
1. Token missing from request headers
2. Token expired
3. Token invalid

**Solution**:
```javascript
// Ensure Authorization header is set
axios.get('/api/me', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

// Or use axios interceptor
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Issue 4: Role Not Updating After Database Change

**Symptom**: User role changed in database but frontend still shows old role

**Solution**:
```javascript
// Force refetch user data
const { refetchUser } = useContext(AuthContext);
await refetchUser();

// Or clear cache and re-login
localStorage.removeItem('token');
// User logs in again
```

---

## Best Practices

### 1. Always Check Roles Array
```javascript
// ✅ Good
if (user.roles && user.roles.includes('seller')) {
  // Show seller feature
}

// ❌ Bad
if (user.role === 'seller') {
  // Won't work - user.role doesn't exist
}
```

### 2. Use Role Helper Functions
```javascript
import { hasRole, isSeller, getPrimaryRole } from '../utils/roleHelpers';

// ✅ Good - Clean and maintainable
if (isSeller(user.roles)) {
  // Show seller feature
}

// ❌ Bad - Repeated logic
if (user.roles && user.roles.includes('seller')) {
  // Show seller feature
}
```

### 3. Secure Both Frontend and Backend
```javascript
// Frontend protection (UX)
<Route element={<SellerProtectedRoute />}>
  <Route path="/sell" element={<SellPage />} />
</Route>

// Backend protection (Security)
app.Post("/api/stores/:id/products",
  middleware.RequireAuth(dbConn),
  middleware.RequireRole("seller"),  // ✅ Essential
  handlers.CreateProductHandler(dbConn)
)
```

### 4. Handle Multiple Roles Gracefully
```javascript
// Display primary role
const primaryRole = getPrimaryRole(user.roles);

// Check for specific capability
const canSell = hasRole(user.roles, 'seller');
const canBuy = hasRole(user.roles, 'buyer');
```

---

## Summary Checklist

### Backend ✅
- [x] User model has `roles` field (array)
- [x] JWT contains `roles` claim (array)
- [x] Registration accepts `role` (string)
- [x] Registration converts to `roles` array
- [x] Middleware validates roles
- [x] `RequireRole` checks array membership
- [x] Protected endpoints work correctly

### Frontend ✅
- [x] AuthContext sends `role` to register
- [x] AuthContext receives user with `roles`
- [x] ProtectedRoute checks authentication
- [x] SellerProtectedRoute checks `user.roles.includes('seller')`
- [x] Role helpers created and used
- [x] AccountDropdown displays role from `user.roles`
- [x] MobileMenu displays role from `user.roles`
- [x] All components use `user.roles` (not `user.role`)

### Integration ✅
- [x] API contract documented
- [x] Registration flow tested
- [x] Login flow tested
- [x] Role-based routing works
- [x] Role-based UI rendering works
- [x] Seller protection works
- [x] Admin protection works

---

## Support & Maintenance

### When Adding New Roles
1. Update backend: Add role to valid roles list
2. Update migrations if needed
3. Add role constants to frontend
4. Create new ProtectedRoute if needed
5. Update role helpers
6. Add to this documentation

### When Adding Role-Based Features
1. Check backend endpoint is protected
2. Add frontend route protection if needed
3. Update UI to show/hide based on role
4. Test with all role combinations
5. Document in this guide

---

**Document Version**: 1.0
**Last Updated**: 2025-10-01
**Maintained By**: Development Team
