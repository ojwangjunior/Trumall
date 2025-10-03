# Role-Based System - Quick Reference

## 📋 Quick Facts

| Backend Field | Frontend Field | Type | Example |
|---------------|----------------|------|---------|
| `user.Roles` (Go) | `user.roles` (JS) | Array | `["buyer", "seller"]` |
| N/A | ~~`user.role`~~ | ❌ Doesn't exist | `undefined` |

---

## 🔑 Code Snippets

### Check if User is Seller
```javascript
// ✅ Correct
import { hasRole, isSeller } from '../utils/roleHelpers';

if (isSeller(user.roles)) {
  // User is a seller
}

// OR
if (hasRole(user.roles, 'seller')) {
  // User is a seller
}

// ❌ Wrong
if (user.role === 'seller') {
  // Won't work - user.role doesn't exist
}
```

### Display User Role
```javascript
// ✅ Correct
import { getPrimaryRole, formatRole } from '../utils/roleHelpers';

<p>{formatRole(getPrimaryRole(user.roles))}</p>
// Shows: "Buyer", "Seller", or "Admin"

// ❌ Wrong
<p>{user.role}</p>
// Shows: undefined
```

### Protect Seller Routes
```javascript
// ✅ Correct
import SellerProtectedRoute from './context/SellerProtectedRoute';

<Route element={<SellerProtectedRoute />}>
  <Route path="/sell" element={<SellPage />} />
</Route>

// SellerProtectedRoute.jsx checks:
if (!user.roles || !user.roles.includes('seller')) {
  return <Navigate to="/unauthorized" />;
}
```

---

## 🎯 API Quick Reference

### Registration
```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer"  # or "seller"
}
→ Returns: { "data": { "token": "..." } }
→ Creates user with roles: ["buyer"]
```

### Get Current User
```bash
GET /api/me
Authorization: Bearer <token>
→ Returns: {
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "roles": ["buyer"],  ← Array!
  "created_at": "...",
  "updated_at": "..."
}
```

---

## 🛡️ Protected Endpoints

### Seller Only
```
POST   /api/stores/:id/products          - Create product
GET    /api/seller/products               - List products
DELETE /api/seller/products/:id           - Delete product
GET    /api/seller/orders                 - View orders
PUT    /api/seller/orders/:id             - Update order
```

### Admin Only
```
All /api/admin/shipping/* endpoints (12 total)
```

---

## ✅ Checklist for New Components

When creating components that check user roles:

- [ ] Import role helpers: `import { getPrimaryRole, hasRole } from '../utils/roleHelpers'`
- [ ] Check `user.roles` (array), not `user.role` (doesn't exist)
- [ ] Use `hasRole(user.roles, 'seller')` to check membership
- [ ] Use `getPrimaryRole(user.roles)` for display
- [ ] Use `formatRole()` to capitalize for UI

---

## 🐛 Common Mistakes

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| `user.role` | `user.roles` |
| `user.roles === 'seller'` | `user.roles.includes('seller')` |
| `{user.role}` | `{formatRole(getPrimaryRole(user.roles))}` |

---

## 📂 Key Files

### Backend
- `internal/models/models.go` - User model with `Roles` field
- `internal/handlers/auth.go` - Registration/login with roles
- `internal/middleware/auth.go` - `RequireAuth` and `RequireRole`
- `cmd/server/main.go` - Protected route definitions

### Frontend
- `src/context/AuthContext.jsx` - Auth state management
- `src/context/SellerProtectedRoute.jsx` - Seller route protection
- `src/utils/roleHelpers.js` - **Role utility functions (USE THIS!)**
- `src/components/layout/header/AccountDropdown.jsx` - Role display
- `src/components/layout/header/MobileMenu.jsx` - Role display

---

## 🔗 Full Documentation

- **Audit Report**: `ROLE_BASED_AUDIT_REPORT.md`
- **Integration Guide**: `ROLE_BASED_INTEGRATION_GUIDE.md`
- **Implementation Summary**: `ROLE_IMPLEMENTATION_SUMMARY.md`

---

**Last Updated**: 2025-10-01
**Status**: ✅ Production Ready
