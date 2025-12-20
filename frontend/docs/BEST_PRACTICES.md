# Coding Best Practices

To maintain code quality and consistency, please follow these guidelines when contributing to the Trumall frontend.

## 1. Component Design
-   Keep components small and focused on a single task.
-   If a component is getting too large, break it down into smaller sub-components.
-   Use functional components with React Hooks.

## 2. Code Consistency
-   Follow the ESLint rules configured in `eslint.config.js`.
-   Use Prettier for automatic code formatting.
-   Use meaningful variable and function names.

## 3. State Management
-   Use local state (`useState`) for UI-only state.
-   Use global state (Context) only for data that is truly shared across multiple parts of the app (like auth, cart).
-   Prefer passing props for simple parent-child communication.

## 4. API and Data Fetching
-   Handle all API errors gracefully.
-   Always cleanup `useEffect` hooks if they perform async operations.
-   Show loading states during data fetching.

## 5. Security
-   Never store sensitive information (like passwords) in plain text or in local storage (use the JWT token approach instead).
-   Always sanitize user input before rendering (React does this by default for the most part, but be careful with `dangerouslySetInnerHTML`).
-   Use HTTPS for all API calls in production.
