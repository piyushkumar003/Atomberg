# In-House Goal Setting & Tracking Portal

An enterprise-grade internal Performance Management System (PMS) for goal setting, tracking, and approvals.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, ShadCN UI, Zustand, Recharts.
- **Backend**: NestJS, TypeScript, Prisma ORM, PostgreSQL, JWT.
- **Infrastructure**: Docker, GitHub Actions ready.

## 🛠️ Setup Instructions (Local SQLite Demo)

1.  **Backend Setup**:
    ```bash
    cd server
    npm install
    cp .env.example .env
    # Ensure DATABASE_URL="file:./dev.db" in .env
    npx prisma generate
    npx prisma db push
    # Manually seed users if script fails
    npx prisma db execute --file prisma/manual_seed.sql
    npm run start:dev
    ```

2.  **Frontend Setup**:
    ```bash
    cd client
    npm install
    npm run dev
    ```

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@portal.com` | `admin123` |
| **Manager** | `manager1@portal.com` | `admin123` |
| **Employee** | `employee1@portal.com` | `admin123` |

## 📦 Deployment Instructions

### 1. Backend (Render)
1.  Create a new **Web Service** on Render.
2.  Connect your repository and set the root directory to `server`.
3.  Choose **Docker** as the environment.
4.  Add the following **Environment Variables**:
    *   `DATABASE_URL`: Your managed PostgreSQL URL.
    *   `JWT_SECRET`: A long secure string.
    *   `JWT_REFRESH_SECRET`: Another long secure string.
    *   `NODE_ENV`: `production`

### 2. Frontend (Vercel)
1.  Create a new project on Vercel.
2.  Connect your repository and set the root directory to `client`.
3.  Set the following **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: The URL of your Render backend.
4.  Deploy!

---
