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

### 3. Set up the database (Neon + Prisma)

The app stores its data in **Neon**, a hosted PostgreSQL database, and uses **Prisma** to read and write it. The database is already created and shared. You only need to connect to it. You do **not** need a Prisma account.

**Database packages** (already installed by `npm install`):

| Package | Used for |
| --- | --- |
| `prisma`, `@prisma/client` | Prisma ORM and its CLI |
| `@prisma/adapter-neon` | Connects Prisma to Neon |
| `dotenv` | Loads the `.env` file |
| `tsx` | Runs the seed script |
| `bcryptjs`, `@types/bcryptjs` | Password hashing |

If any of these are missing from your `node_modules`, install them (Prisma is pinned to version 7 on purpose):

```bash
npm install @prisma/client@7 @prisma/adapter-neon@7 dotenv bcryptjs
npm install -D prisma@7 tsx @types/bcryptjs
```

**a. Pull the latest code and install**

```bash
git pull
npm install
```

**b. Create your `.env` file**

Create a file named `.env` in the repository root (next to `package.json`) with these two lines. The project owner will send you the values:

```dotenv
DATABASE_URL=
DIRECT_URL=
```

**c. Generate the Prisma client**

```bash
npx prisma generate
```

This creates the folder `lib/generated/prisma`. It is not committed to git, so run it once after cloning and again whenever `prisma/schema.prisma` changes. If VS Code shows `Cannot find module '@/lib/generated/prisma/client'`, run this command, then press `Ctrl+Shift+P` and choose **TypeScript: Restart TS Server**.

**d. Check that it works**

```bash
npx prisma studio
```

Prisma Studio opens at [http://localhost:51212](http://localhost:51212). The first table shown may be `_prisma_migrations`, which is Prisma's own history table. Use the left sidebar to open the real tables: `User`, `Client`, `Dog`, `Service`, `Appointment`, `AppointmentService`, `VisitNote`.

**VS Code:** install the official **Prisma** extension (search "Prisma" in the Extensions tab) for syntax highlighting and formatting of `schema.prisma`.

#### Where things live

| Path | What it is |
| --- | --- |
| `prisma/schema.prisma` | The database tables (the data model) |
| `prisma/migrations/` | History of database changes, committed to git |
| `prisma/seed.ts` | Sample data script |
| `prisma7.config.ts` | Prisma settings (reads `.env`) |
| `lib/db.ts` | The shared database client. Import `prisma` from here in API routes and server code |
| `lib/generated/prisma/` | Auto-generated client (git-ignored, created by `npx prisma generate`) |

#### Changing the database

Only change tables through the schema and migrations. Do not edit tables by hand in the Neon dashboard.

1. Edit `prisma/schema.prisma`.
2. Run `npx prisma migrate dev --name short_description`.
3. Commit the schema **and** the new folder in `prisma/migrations/`.
4. Teammates pull, then run `npx prisma migrate deploy` and `npx prisma generate`.

#### Database commands

| Command | What it does |
| --- | --- |
| `npx prisma generate` | Rebuilds the Prisma client (fresh clone or schema change) |
| `npx prisma studio` | Opens the visual database browser |
| `npx prisma migrate deploy` | Applies migrations pulled from git (safe to run any time) |
| `npx prisma migrate dev --name x` | Creates and applies a new migration after you edit the schema |
| `npx prisma migrate status` | Shows whether the database matches the migrations |
| `npx prisma db seed` | Loads sample data (already done, no need to run it) |

The seeded development login is `admin@groomly.test` / `ChangeMe123!`. This is for development only.

#### Database troubleshooting

| Problem | Fix |
| --- | --- |
| `Cannot find module '@/lib/generated/prisma/client'` | Run `npx prisma generate` |
| `Environment variable not found: DATABASE_URL` (or `DIRECT_URL`) | `.env` is missing, misnamed, or not in the repository root |
| Connection error mentioning `channel_binding` | Delete `&channel_binding=require` from the end of the string |
| The first request is slow after a quiet period | Normal. Neon pauses idle databases and wakes them on the next request |
| `migrate dev` asks to reset the database | Stop and ask the team. Use `migrate deploy` if you only pulled changes |
| Authentication failed | The password changed. Ask the project owner for a fresh string |

### 4. Set up authentication (Auth.js)

Anyone can create an account with an email and password. Accounts live in the `User` table in Neon, and passwords are stored as bcrypt hashes (never as plain text). **Every account only sees its own clients, dogs, services and appointments.** A login lasts 8 hours and is extended while you keep using the app. Clicking **Sign out** ends it right away.

**Authentication packages** (already installed by `npm install`):

| Package | Used for |
| --- | --- |
| `next-auth@beta` | Auth.js v5: login sessions and the `/api/auth` routes (install with the `@beta` tag, since v5 is published as a beta) |
| `zod` | Validating the login and sign-up forms |
| `bcryptjs` | Hashing and checking passwords (installed with the database packages) |

If `next-auth` or `zod` is missing from your `node_modules`, install them:

```bash
npm install next-auth@beta zod
```

**a. Update your database after pulling**

The accounts feature changed the database (every client, dog, service and appointment now has an `ownerId`). After pulling, run:

```bash
git pull
npm install
npx prisma migrate deploy
npx prisma generate
```

**b. Create your `AUTH_SECRET` key**

`AUTH_SECRET` is a random string that Auth.js uses to sign login cookies. There is no website or account to get it from. You generate it yourself in the terminal. This works on Windows PowerShell, macOS and Linux:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the line it prints (something like `k3J...=`).

**c. Add it to your `.env` file**

Open the `.env` file in the repository root (the same one that has your database strings) and add one line at the bottom. Your `.env` should now have three values:

```dotenv
DATABASE_URL=
DIRECT_URL=
AUTH_SECRET=paste-the-generated-value-here
```

- Every developer generates **their own** `AUTH_SECRET` for local work. Don't share it, and don't commit `.env` (it is git-ignored).
- The deployed site (Vercel) gets its own different value under **Project Settings > Environment Variables**.
- Restart `npm run dev` after changing `.env`, because Next.js only reads it on startup.
- Optional: add `SIGNUP_CODE=some-phrase` to `.env` and the sign-up page will ask for that invite code. Leave it out for open sign-up.

**d. Test it**

```bash
npm run dev
```

1. Open [http://localhost:3000](http://localhost:3000). You should be sent to `/login` (no sidebar).
2. Sign in with the demo account `admin@groomly.test` / `ChangeMe123!`, or click **Create an account** to make your own.
3. Refresh the page. You should stay signed in.
4. Click **Sign out** at the bottom of the sidebar. You should return to `/login`.

#### Where the auth files live

| Path | What it is |
| --- | --- |
| `proxy.ts` | Sends anyone who isn't signed in to `/login`. It must stay in the project root. On Next.js 15 or older, rename it to `middleware.ts` |
| `lib/auth/auth.ts` | The email and password check against the `User` table |
| `lib/auth/auth.config.ts` | Session length, public pages (`/login`, `/signup`), and role/id in the session |
| `lib/auth/session.ts` | `requireUser()` for pages and `getUserId()` for API routes |
| `lib/auth/actions.ts` | The sign-out server action |
| `lib/auth/next-auth.d.ts` | TypeScript types for `session.user.id` and `session.user.role` |
| `lib/default-services.ts` | The starter price list every new account receives |
| `app/api/auth/[...nextauth]/route.ts` | Auth.js endpoints |
| `app/login/`, `app/signup/` | The login and sign-up pages |
| `components/SignOutButton.tsx` | The sign-out button used in `AppSidebar.tsx` |

#### Rule for every API route and page that reads data

Signing in only proves who someone is. Your code has to keep accounts apart, so **every database query must filter by `ownerId`**:

```ts
import { getUserId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

const userId = await getUserId();
if (!userId) return new Response("Unauthorized", { status: 401 });

// list
const dogs = await prisma.dog.findMany({ where: { ownerId: userId } });

// single record: filter by BOTH id and owner
const dog = await prisma.dog.findFirst({ where: { id, ownerId: userId } });

// create: always set the owner yourself
await prisma.dog.create({ data: { ...fields, ownerId: userId } });
```

Never trust an `ownerId` or `userId` sent from the browser. When you create a dog, check that its `clientId` belongs to the same user.

#### Authentication troubleshooting

| Problem | Fix |
| --- | --- |
| `MissingSecret` error | `AUTH_SECRET` is missing from `.env`, or you didn't restart `npm run dev` |
| You can open pages without logging in | Next.js 15 or older: rename `proxy.ts` to `middleware.ts`. Check with `npm ls next` |
| `Cannot find module 'next-auth'` | Run `npm install` (or `npm install next-auth@beta zod`) |
| `Cannot find module '@/lib/auth/actions'` | Make sure `lib/auth/actions.ts` exists (see the files table above) |
| Redirect loop on `/login` | `/login` and `/signup` must be listed in `PUBLIC_PATHS` in `lib/auth/auth.config.ts` |
| `Unknown argument ownerId` or similar Prisma errors | Run `npx prisma migrate deploy` and `npx prisma generate`, then restart the TS server |
| "Invalid email or password" for a correct login | Emails are stored in lowercase. The account may not exist in your database branch, so run Prisma Studio to check the `User` table |

### 5. Run the development server

```bash
npm run dev
```

### Install commands by package

**You don't need these to set up the project**, because `npm install` already installs everything. Use them only if a package is missing or you're rebuilding the setup.

```bash
# shadcn and UI helpers
npm install shadcn @base-ui/react class-variance-authority cn tw-animate-css

# Icons
npm install lucide-react

# Calendar
npm install react-day-picker date-fns

# Framework
npm install next react react-dom

# Authentication
npm install next-auth@beta zod

# Development tools
npm install -D tailwindcss @tailwindcss/turbopack typescript eslint eslint-config-next @types/node @types/react @types/react-dom
```

These commands may install newer versions than the ones the project uses and change `package.json` and `package-lock.json`.

### shadcn components

The components already in `components/ui` (`button`, `calendar`, `input`, `separator`, `sheet`, `sidebar`, `skeleton`, `tooltip`) are part of the repository, so you don't need to add them again.

To add a new component, replace `card` with the one you need:

```bash
npx shadcn@latest add card
```

You don't need to run `shadcn init`, because the project is already configured in `components.json`. If the command asks to overwrite an existing file, answer no unless you mean to replace it. Commit the new files along with any changes to `package.json` and `package-lock.json`.

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