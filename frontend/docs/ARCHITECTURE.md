# Architecture Overview

Trumall's frontend is built with a modern, modular architecture using **React 19** and **Vite**. The project is designed to be scalable, maintainable, and easy to navigate.

## Folder Structure

The code is organized as follows:

-   `src/components/`: Reusable UI components, categorized by feature (e.g., `auth`, `product`, `cart`).
-   `src/pages/`: Top-level page components that correspond to application routes.
-   `src/context/`: React Context providers for global state management (Auth, Cart, Toast).
-   `src/utils/`: Helper functions and utility constants.
-   `src/assets/`: Static assets like images and global stylesheets.
-   `src/App.jsx`: Main entry point where routing and global providers are configured.

## Tech Stack

-   **Framework:** React 19
-   **Build Tool:** Vite
-   **Styling:** Tailwind CSS
-   **Routing:** React Router DOM v7
-   **API Client:** Axios
-   **Icons:** Lucide React & React Icons

## Key Design Principles

1.  **Component-Based:** Every UI element is treated as a component to maximize reusability.
2.  **Unidirectional Data Flow:** Data flows down through props, and actions flow up through callbacks or context.
3.  **Separation of Concerns:** Logic is separated into hooks/context where possible, keep components focused on rendering.
4.  **Responsive Design:** Using Tailwind's utility classes to ensure the app works across all devices.
