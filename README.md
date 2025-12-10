This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment Guide

### 1. Environment Variables
For production deployment, you must configure the following environment variables in your Vercel project settings:

- `NEXTAUTH_URL`: Your production URL (e.g., `https://your-project.vercel.app`)
- `NEXTAUTH_SECRET`: A secure random string. You can generate one using:
  ```bash
  openssl rand -base64 32
  ```

### 2. Deploy to Vercel
You can deploy using the Vercel CLI or by connecting your GitHub repository.

**Option A: Connect GitHub (Recommended)**
1. Push your code to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and "Add New Project".
3. Import your repository.
4. Add the Environment Variables mentioned above.
5. Click **Deploy**.

**Option B: Vercel CLI**
1. Install Vercel CLI: `npm i -g vercel`
2. Run deployment:
   ```bash
   vercel --prod
   ```
3. Follow the prompts and set the environment variables when asked.

### 3. CI/CD
This project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that automatically runs linting and build checks on every push to `main`.

### 4. Security
- **Headers**: Security headers (CSP, HSTS, etc.) are configured in `vercel.json`.
- **Authentication**: Admin routes are protected by NextAuth.js and Middleware.

