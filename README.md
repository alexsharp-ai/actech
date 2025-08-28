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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

### 1. Import the project
Go to https://vercel.com/new and import this Git repository (push it to GitHub first if you haven't).

### 2. Set environment variables
Add (Settings → Environment Variables):

```
OPENAI_API_KEY=sk-...your real key...
OPENAI_MODEL=gpt-4o-mini
```

You can also copy `.env.example` to set them locally as `.env.local`.

### 3. Build settings
No custom settings needed. Vercel auto-detects Next.js 15. Leave build command empty (defaults to `next build`).

### 4. Deploy
Click Deploy. After build finishes, open the production URL. The floating support chat widget will call the `/api/support-chat` route and leverage OpenAI if the key is present.

### 5. (Optional) Preview & protection
Use Preview deployments for QA. Protect production by enabling Password Protection or GitHub approvals if needed.

### 6. Rate limits & persistence
Current rate limiting and message storage are in-memory only (reset per serverless instance). For production resilience, plan a persistent store (e.g., Vercel KV, Redis, or a database) if you need to keep 'Leave a message' submissions. For now you can view them temporarily via the GET endpoint at `/api/support-leave-message` (remove before going live).

### 7. Custom domain
Add your domain in Vercel → Domains and set DNS as prompted.

---

Need streaming answers, DB storage, or email notifications for messages? Extend the API routes accordingly.
