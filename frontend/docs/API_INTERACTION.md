# API Interaction

The frontend communicates with the backend via a RESTful API using **Axios**.

## Best Practices for API Calls

1.  **Environment Variables:** Always use `import.meta.env.VITE_API_BASE_URL` for the base URL.
2.  **Authorization:** When making requests to protected endpoints, include the JWT token in the `Authorization` header.
    ```javascript
    const response = await axios.get(`${baseUrl}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    ```
3.  **Error Handling:** Use `try-catch` blocks to handle API errors and show appropriate messages to the user via the `ToastContext`.
4.  **Loading States:** Implement loading indicators when fetching data to improve user experience.

## Example Request

```javascript
const fetchProducts = async () => {
  setLoading(true);
  try {
    const response = await axios.get(`${baseUrl}/products`);
    setProducts(response.data);
  } catch (err) {
    showToast("Failed to fetch products", "error");
  } finally {
    setLoading(false);
  }
};
```

Currently, API calls are located within individual page components or context providers.
