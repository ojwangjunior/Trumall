# Getting Started

Welcome to the Trumall Frontend documentation. This guide will help you get the project up and running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/trumall.git
    cd trumall/frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the `frontend` root directory and add the necessary environment variables:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```
    *(Adjust the URL according to your local backend setup)*

## Development

To start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The output will be in the `dist` folder.

## Linting

To check the code for linting errors:

```bash
npm run lint
```
