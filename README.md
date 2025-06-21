# planus-app-backend

This is the backend for the Planus Energia application, built with Next.js and Firebase.

## Getting Started

To get started with development:

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Run the development server:
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Firebase App Hosting Backend Setup

To deploy this backend and connect it to a GitHub repository, follow these general steps within the Firebase Console:

1.  **Navigate to App Hosting:** In your Firebase project, go to **Build > App Hosting**.
2.  **Create a New Backend:** Start the process to create a new backend.
3.  **Connect to GitHub:** Authorize Firebase to access your GitHub account and select the repository for this project (e.g., `planus-app-backend`).
4.  **Configure Deployment:**
    *   **Active branch:** Set this to your production branch (e.g., `main` or `master`).
    *   **Root directory:** Set this to `/` if your `package.json` is in the root, which is the standard setup for this project.
5.  **Complete Setup:** Finalize the setup. Firebase will then automatically deploy your backend whenever you push changes to the configured branch.
