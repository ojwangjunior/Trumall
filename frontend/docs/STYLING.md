# Styling Guide

The project uses **Tailwind CSS**, a utility-first CSS framework. This approach allows for rapid UI development and consistent design without leaving the HTML/JSX.

## Configuration

Tailwind settings (colors, fonts, etc.) are defined in `tailwind.config.js`.

## Styling Patterns

-   **Responsiveness:** Use mobile-first design. Always apply base styles for mobile and use breakpoints (`md:`, `lg:`, `xl:`) for larger screens.
    ```jsx
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    ```
-   **Typography:** Use the utility classes for fonts, sizes, and colors consistently.
-   **Layout:** Use Flexbox and Grid utilities for all layout needs. Avoid custom CSS for positioning unless absolutely necessary.
-   **Animations:** Use Tailwind's built-in transition and animation classes (e.g., `transition-all duration-300`, `hover:scale-105`).

## Dark Mode

The current theme focuses on a clean, professional aesthetic. When implementing dark mode, use the `dark:` variant provided by Tailwind.
