require("dotenv").config();

module.exports = {
  apps: [
    {
      name: "myapp",
      script: "npm",
      args: "start",
      watch: true,
      env: {
        NODE_ENV: "production",
        DB_USER: process.env.DB_USER,
        DB_NAME: process.env.DB_NAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DATABASE_URL: process.env.DATABASE_URL,
        AUTH_SECRET: process.env.AUTH_SECRET,
        AUTH_URL: process.env.AUTH_URL,
        AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
      },
    },
  ],
};
