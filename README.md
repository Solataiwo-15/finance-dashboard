# FinDash - A Finance Management Dashboard

This project is a technical assessment for the Talentra Africa internship program. It's a single-page web application that allows small business owners to manage invoices and track key financial metrics.

### [Live Demo Link](YOUR_VERCEL_DEPLOYMENT_LINK_HERE)

### [Demo Video Link](YOUR_LOOM_OR_YOUTUBE_LINK_HERE)

![Screenshot of the FinDash Dashboard](./screenshot.png)
_(You should add a screenshot of your finished dashboard to the `public` folder and name it `screenshot.png`)_

---

## Features

- **Secure Authentication:** Users can sign up and log in using a secure, email/password-based system powered by Appwrite Auth.
- **Real-Time CRUD:** Create, Read, Update, and Delete invoices instantly. The UI updates in real-time without needing a page refresh.
- **Interactive Dashboard:** An at-a-glance overview of key financial metrics, including Total Revenue, Pending Payments, and VAT collected.
- **Data Visualization:** A responsive bar chart that visualizes the status of all invoices (Paid vs. Unpaid).
- **Responsive Design:** A clean and modern UI that works seamlessly on both desktop and mobile devices.

---

## Tech Stack

- **Framework:** Next.js (with App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** ShadCN/UI
- **Backend as a Service (BaaS):** Appwrite (for Auth and Database)
- **State Management:** Zustand
- **Charting:** Recharts
- **Deployment:** Vercel

---

## Getting Started Locally

To run this project on your local machine, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/[YourUsername]/[YourRepoName].git
    cd [YourRepoName]
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    - Create a file named `.env.local` in the root of the project.
    - Add your Appwrite project credentials:

    ```env
    NEXT_PUBLIC_APPWRITE_PROJECT_ID="YOUR_PROJECT_ID"
    NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
    NEXT_PUBLIC_APPWRITE_DATABASE_ID="YOUR_DATABASE_ID"
    NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID="YOUR_COLLECTION_ID"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.
