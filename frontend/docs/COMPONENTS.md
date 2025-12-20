# Component System

The frontend follows a feature-based organization for components to make it easier to find and manage related UI elements.

## Component Directory Structure (`src/components/`)

-   `account/`: Components related to user profile and settings.
-   `address/`: Components for managing shipping and billing addresses.
-   `auth/`: Components for login, signup, and authentication forms.
-   `buy/`: Components specifically for the buying experience.
-   `cart/`: Cart-related components, including the mini-cart and payment modals.
-   `common/`: Generic reusable UI elements (Buttons, Inputs, Spinners).
-   `layout/`: Structural components like `Header`, `Footer`, and Navigation.
-   `orders/`: Components for displaying and managing order history.
-   `product/`: Product listing, product cards, and details components.
-   `sell/`: Components for the "Start Selling" flow.
-   `seller/`: Seller dashboard and store management components.
-   `store/`: Components for store display and browsing.

## Component Standards

-   **Naming:** Components use **PascalCase** (e.g., `ProductCard.jsx`).
-   **Structure:** Each file usually contains one main component.
-   **Props:** Use descriptive prop names and provide default values where appropriate.
-   **Styling:** Use Tailwind utility classes directly in the JSX.
