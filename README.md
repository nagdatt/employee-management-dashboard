# Employee Management Dashboard

## Project Overview

The Employee Management Dashboard is a robust, single-page web application designed for HR administrators to manage employee records efficiently. It provides a professional interface for performing CRUD (Create, Read, Update, Delete) operations, visualizing staff statistics, and generating printable assets like ID cards and employee lists.

The application features a mock authentication system and uses the browser's Local Storage for data persistence, allowing it to function completely offline without a backend server.

### Key Features
*   **Authentication**: Secure login interface (mock authentication).
*   **Dashboard**: Real-time statistics showing total, active, and inactive employees.
*   **Employee Management**: Add, edit, and remove employee profiles with validation.
*   **Search & Filter**: Filter employees by gender, status, or search by name.
*   **Print Functionality**: 
    *   Generate professional Employee ID cards with a specific print layout.
    *   Print clean, formatted lists of employees for reporting.
*   **Responsive Design**: Fully functional on desktop and mobile devices.

## Tech Stack

*   **Frontend Framework**: React 18 (TypeScript)
*   **State Management**: Redux Toolkit
*   **Styling**: Tailwind CSS
*   **Routing**: React Router DOM
*   **Build Tool**: Vite
*   **Icons**: Lucide React
*   **Persistence**: Local Storage API

## Steps to Run the Project Locally

1.  **Clone the repository** to your local machine.

2.  **Install Dependencies**:
    Open your terminal in the project directory and run:
    ```bash
    npm install
    ```

3.  **Run the Development Server**:
    Start the application in development mode:
    ```bash
    npm run dev
    ```

4.  **Open the Application**:
    The terminal will show a local URL (usually `http://localhost:5173`). Open this link in your web browser.

5.  **Login**:
    You can use any email and password to log in (e.g., `admin@company.com` / `password`).

## Assumptions & Design Decisions

*   **Data Persistence**: To keep the application lightweight and easy to run without backend dependencies, `localStorage` is used as the primary data source. This ensures data persists across browser refreshes but remains local to the user's browser.
*   **Authentication**: The login system is simulated. It checks for non-empty credentials and stores a session token in `localStorage` to handle protected routes via the `ProtectedRoute` component.
*   **Design Philosophy**: A "Corporate Professional" aesthetic was chosen. Gradient colors were explicitly avoided to maintain a clean, flat, and readable UI suitable for business environments. A standard blue color palette (`bg-blue-600`) is used for primary actions to convey trust.
*   **Print Optimization**: 
    *   **ID Cards**: The print view for ID cards constructs a specific HTML structure injected into a new window to ensure the card fits standard dimensions and hides browser UI elements.
    *   **Reports**: The main list view utilizes `@media print` CSS queries to hide navigation bars, buttons, and search inputs, ensuring only the relevant data table is printed.
*   **Component Structure**: The application uses a centralized Redux store to prevent prop drilling, particularly useful for sharing employee state between the list view, add/edit forms, and statistical widgets.
*   **Performance**: Large images are converted to Base64 strings for local storage compatibility. A file size limit (5MB) is enforced to prevent `localStorage` quota overflow.
