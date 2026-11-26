This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Install Node.js

You need **Node.js 22 or newer** (npm is included). Download it from [nodejs.org](https://nodejs.org), then check your version:

```bash
node -v
```

### 2. Install the dependencies

From the repository root (the folder that contains `package.json`), run:

```bash
npm install
```

This installs everything the project needs, so you don't have to install packages one by one or globally. Run it again after pulling changes that modify `package.json` or `package-lock.json`.

The main packages are:

| Package | Used for |
| --- | --- |
| `next`, `react`, `react-dom` | The app framework |
| `tailwindcss`, `@tailwindcss/turbopack`, `tw-animate-css` | Styling and animations |
| `shadcn`, `@base-ui/react`, `class-variance-authority`, `cn` | UI components in `components/ui` |
| `lucide-react` | Icons |
| `react-day-picker`, `date-fns` | The appointment calendar |
| `typescript`, `eslint` | Type checking and linting |

### 3. Run the development server

```bash
npm run dev
```

### Moving from the old `groomly/` folder

The app used to live in `groomly/` and is now at the repository root. If you still have a `groomly/` folder after pulling, move any files of your own out of it (such as uncommitted work or `.env` files), delete it, and run `npm install` from the root.

### Hydration warnings from browser extensions

Extensions such as Grammarly can cause a hydration mismatch error that mentions attributes on `<body>`. To check whether an extension is the cause, open the site in a private window with extensions turned off.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
