# Home Click Class

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). The application is designed for managing and administering online English classes. It supports three types of users: admin, teacher, and student.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered and static web applications.
- **Prisma**: An ORM (Object-Relational Mapping) tool for database management.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **Docker**: A platform for developing, shipping, and running applications in containers.
- **PM2**: A production process manager for Node.js applications.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

## Main Routes

- `/admin`: Admin dashboard for managing users, classes, and other administrative tasks.
- `/classes`: Teacher ans student dashboard for managing their.

## Environment Variables

The application uses the following environment variables. Note that the actual values should be kept private and not shared publicly.

- `NODE_ENV`: The environment in which the application is running (e.g., development, production).
- `DB_USER`: The database user.
- `DB_NAME`: The database name.
- `DB_PASSWORD`: The database password.
- `DATABASE_URL`: The URL for connecting to the database.
- `DIRECT_URL`: he URL for connecting to the database in production.
- `AUTH_SECRET`: The secret key for authentication.
- `AUTH_URL`: The URL for the authentication service.
- `AUTH_TRUST_HOST`: The trusted host for authentication.

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine.
- Node.js and npm installed on your machine.

### Steps to Initialize the Project

1. **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd home-click-class
    ```

2. **Set up environment variables**:
    Create a `.env` file in the root directory and add the required environment variables.

3. **Initialize Docker Compose**:
    ```bash
    docker-compose up -d
    ```

4. **Install dependencies**:
    ```bash
    npm install
    ```

5. **Generate Prisma client**:
    ```bash
    npx prisma generate
    ```

6. **Push the database schema**:
    ```bash
    npx prisma db push
    ```

7. **Seed the database with an admin user**:
    ```bash
    npm run seed-create-user
    ```

8. **Run the development server**:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.