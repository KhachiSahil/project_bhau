# project_bhau — Travel Agency CRM

A full-stack Customer Relationship Management system built for travel agencies, enabling structured enquiry management, hotel/cab booking tracking, follow-up scheduling, and role-based dashboards for admin and employee users.

**Live deployment:** [project-bhau.vercel.app](https://project-bhau.vercel.app)

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Folder Structure](#folder-structure)
6. [Installation](#installation)
7. [Environment Variables](#environment-variables)
8. [Scripts](#scripts)
9. [API Documentation](#api-documentation)
10. [Database Design](#database-design)
11. [Authentication & Authorization](#authentication--authorization)
12. [Validation](#validation)
13. [Error Handling](#error-handling)
14. [Security](#security)
15. [Performance](#performance)
16. [Configuration](#configuration)
17. [Design Decisions](#design-decisions)
18. [Future Improvements](#future-improvements)
19. [Troubleshooting](#troubleshooting)
20. [Contributing](#contributing)
21. [License](#license)
22. [Acknowledgements](#acknowledgements)
23. [Author](#author)
24. [Project Status](#project-status)
25. [Summary](#summary)

---

## Overview

Travel agencies typically operate across scattered spreadsheets, WhatsApp threads, and phone notes. **project_bhau** consolidates this workflow into a single platform: enquiries are captured and tracked, hotels and cab bookings are linked to those enquiries, and employees can log follow-ups with timestamped history. Admins get cross-team visibility via dashboard reporting.

**Target users:** Travel agency admins and their employee teams.

**Real-world use case:** A small-to-medium travel agency receives 20–50 enquiries per week. Admins assign them to employees, employees log follow-ups, and managers pull reports on conversion rates, booking volumes, and pending actions — all without leaving the application.

---

## Features

### Authentication
- Credential-based login via NextAuth v4
- JWT session strategy with role (`admin` / `employee`) embedded in the token
- Protected routes via Edge-compatible middleware

### Authorization
- Role-based access control enforced at the middleware layer
- Admin routes (`/Admin/*`) accessible only to `admin` role
- Employee routes (`/Employee/*`) accessible only to `employee` role
- All `/api/*` routes return `401 Unauthorized` for unauthenticated requests

### Enquiry Management
- Create, read, update, and delete customer enquiries
- Enquiries linked to hotels, cab bookings, and follow-ups

### Hotel & Cab Booking Tracking
- Attach hotel and cab booking records to enquiries
- Track booking status, dates, and relevant details

### Follow-Up Management
- Log timestamped follow-ups against enquiries
- Employee-level follow-up history

### Dashboard & Reporting
- Role-specific dashboards for Admin and Employee
- Data visualization using Recharts

### Email Notifications
- Transactional email support via Nodemailer

### Calendar & Date Handling
- Inline calendar components using `react-calendar` and `react-date-range`
- Date utilities via `date-fns`

### Performance
- Vercel Speed Insights integrated for real user monitoring

### Planned / Not Yet Implemented
- Unit and integration test suite
- Rate limiting on API routes
- Background job processing
- Real-time notifications (WebSockets)
- File/document upload support
- Audit logging

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | Next.js (App Router) | 16.1.7 |
| **Language** | TypeScript | ^5 |
| **Runtime** | Node.js | — |
| **Styling** | Tailwind CSS | ^4 |
| **UI Components** | Lucide React | ^0.577.0 |
| **Charts** | Recharts | ^3.8.0 |
| **Calendar** | react-calendar, react-date-range | ^6 / ^2 |
| **ORM** | Prisma (v7, new client architecture) | ^7.5.0 |
| **DB Driver** | @prisma/adapter-pg | ^7.5.0 |
| **Database** | PostgreSQL | — |
| **Authentication** | NextAuth v4 | ^4.24.13 |
| **Email** | Nodemailer | ^7.0.13 |
| **Date Utilities** | date-fns | ^4.1.0 |
| **Linting** | ESLint + eslint-config-next | ^9 / 16.1.7 |
| **CSS Processing** | PostCSS + @tailwindcss/postcss | ^4 |
| **Deployment** | Vercel | — |
| **Monitoring** | @vercel/speed-insights | ^2.0.0 |
| **Build Bundler** | Turbopack (dev) | Bundled with Next.js |
| **Package Manager** | npm | — |

**Not currently implemented:** Redis/caching, Docker, CI/CD pipelines, testing frameworks.

---

## Architecture

### Overview

project_bhau is a **monolithic Next.js App Router application** where the frontend and backend coexist in a single codebase. API routes (`app/api/`) serve as the backend layer, consumed by Server and Client Components in the same application.

```
Browser
  │
  ▼
Next.js Edge Middleware (middleware.ts)
  │  — JWT verification via getToken()
  │  — Role-based route guarding
  │  — 401 for unauthenticated API requests
  ▼
Next.js App Router
  ├── Server Components (data fetching, SSR)
  ├── Client Components (interactivity, forms)
  └── Route Handlers (app/api/**)
          │
          ▼
        Prisma Client (ORM)
          │
          ▼
        PostgreSQL (via @prisma/adapter-pg)
```

### Request Flow

```mermaid
sequenceDiagram
    participant Browser
    participant Middleware
    participant AppRouter
    participant API
    participant Prisma
    participant PostgreSQL

    Browser->>Middleware: HTTP Request
    Middleware->>Middleware: getToken() — verify JWT
    alt No token & API route
        Middleware-->>Browser: 401 Unauthorized
    else No token & page route
        Middleware-->>Browser: 302 Redirect to /signin
    else Wrong role
        Middleware-->>Browser: 302 Redirect to /signin
    else Valid token + correct role
        Middleware->>AppRouter: next()
        AppRouter->>API: Route Handler
        API->>Prisma: Query
        Prisma->>PostgreSQL: SQL
        PostgreSQL-->>Prisma: Result
        Prisma-->>API: Typed response
        API-->>Browser: JSON Response
    end
```

### Role-Based Access Flow

```mermaid
flowchart TD
    A[Incoming Request] --> B{In middleware matcher?}
    B -- No --> C[Route handler — no auth check]
    B -- Yes --> D{JWT token present?}
    D -- No, API --> E[401 Unauthorized JSON]
    D -- No, Page --> F[Redirect /signin]
    D -- Yes --> G{Role check required?}
    G -- /Admin/* --> H{role === admin?}
    G -- /Employee/* --> I{role === employee?}
    G -- /api/* --> J[Pass through to handler]
    H -- No --> F
    H -- Yes --> J
    I -- No --> F
    I -- Yes --> J
    J --> K[Route Handler Executes]
```

### Layered Architecture

```
┌──────────────────────────────────────────┐
│            Presentation Layer             │
│   Next.js Pages, Server/Client Components │
│   Tailwind CSS, Lucide, Recharts          │
├──────────────────────────────────────────┤
│             API Layer                     │
│   app/api/** Route Handlers               │
│   NextAuth — /api/auth/**                 │
├──────────────────────────────────────────┤
│             Data Access Layer             │
│   Prisma Client (db/index.ts)             │
│   @prisma/adapter-pg                      │
├──────────────────────────────────────────┤
│             Database Layer                │
│   PostgreSQL                              │
└──────────────────────────────────────────┘
```

---

## Folder Structure

```
project_bhau/
├── app/                        # Next.js App Router root
│   ├── api/                    # Backend route handlers
│   │   ├── auth/               # NextAuth endpoints (/api/auth/*)
│   │   ├── enquiry/            # Enquiry CRUD
│   │   ├── hotel/              # Hotel booking CRUD
│   │   ├── cabBooking/         # Cab booking CRUD
│   │   └── followup/           # Follow-up CRUD
│   ├── Admin/                  # Admin-only pages (protected)
│   │   └── (authenticated)/    # Route group — shares admin layout
│   ├── Employee/               # Employee-only pages (protected)
│   │   └── (authenticated)/    # Route group — shares employee layout
│   │       ├── Enquiries/
│   │       ├── FollowUps/
│   │       └── Reports/
│   ├── Website/                # Public-facing pages (no auth required)
│   ├── signin/                 # Login page
│   └── layout.tsx              # Root layout
│
├── components/                 # Shared React components
│   └── ...                     # UI elements used across Admin/Employee
│
├── db/                         # Prisma client singleton
│   └── index.ts                # Exports PrismaClient instance
│
├── prisma/                     # Database schema & migrations
│   ├── schema.prisma           # Data model definitions
│   └── migrations/             # Migration history
│
├── public/                     # Static assets (images, icons)
│
├── middleware.ts               # Edge middleware — auth + role enforcement
├── next.config.ts              # Next.js configuration
├── prisma.config.ts            # Prisma CLI configuration (v7 style)
├── tsconfig.json               # TypeScript compiler options
├── eslint.config.mjs           # ESLint flat config
├── postcss.config.mjs          # PostCSS config (Tailwind v4)
├── vercel.json                 # Vercel deployment config
└── package.json
```

### Directory Responsibilities

| Directory | Purpose |
|---|---|
| `app/api/` | REST-style route handlers; all require a valid JWT (enforced by middleware) |
| `app/Admin/` | Admin dashboard pages; rendered only for `role === admin` |
| `app/Employee/` | Employee workflow pages; rendered only for `role === employee` |
| `app/Website/` | Public marketing or landing pages; unprotected |
| `components/` | Reusable UI components shared across role-specific layouts |
| `db/` | Singleton Prisma client to avoid connection pool exhaustion in serverless environments |
| `prisma/` | Source of truth for the database schema and all migration files |

---

## Installation

### Prerequisites

- Node.js 18+
- npm
- A PostgreSQL database (local or hosted, e.g., Supabase, Neon, Railway)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/KhachiSahil/project_bhau.git
cd project_bhau

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your actual values (see Environment Variables section)

# 4. Generate Prisma Client
npx prisma generate

# 5. Run database migrations
npx prisma migrate dev

# 6. Start the development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build   # runs prisma generate && next build
npm run start
```

**Note:** Docker is not currently configured. Deployment is handled via Vercel.

---

## Environment Variables

> No `.env.example` file was found in the repository. The variables below are inferred from the codebase.

| Variable | Purpose | Required | Example |
|---|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string for Prisma | ✅ | `postgresql://user:pass@host:5432/dbname` |
| `NEXTAUTH_SECRET` | Secret used to sign/verify JWT tokens | ✅ | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Canonical URL of the app (used by NextAuth) | ✅ | `http://localhost:3000` |
| `NEXT_PUBLIC_WEBSITE_URL` | Base URL used for redirect construction in middleware | ✅ | `http://localhost:3000/` |
| `EMAIL_HOST` | SMTP host for Nodemailer | ✅ (if email used) | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | ✅ (if email used) | `587` |
| `EMAIL_USER` | SMTP username / sender address | ✅ (if email used) | `you@example.com` |
| `EMAIL_PASS` | SMTP password or app password | ✅ (if email used) | `yourpassword` |

> ⚠️ Never commit `.env` to version control. Add it to `.gitignore` (already present in this repo).

---

## Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `next dev --turbopack` | Starts development server with Turbopack bundler |
| `build` | `prisma generate && next build` | Generates Prisma client, then builds for production |
| `start` | `next start` | Starts the production server (requires prior build) |
| `lint` | `next lint` | Runs ESLint across the project |

---

## API Documentation

All API routes are under `/api/` and are protected by the Edge middleware. A valid NextAuth session cookie must be present, or the request receives `401 Unauthorized`.

> The exact route file names and request/response shapes below are inferred from the domain model and folder structure. Verify against the actual route handler implementations.

### Auth

| Method | Route | Purpose | Auth Required |
|---|---|---|---|
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth sign-in, sign-out, session | No (NextAuth-managed) |

### Enquiry

| Method | Route | Purpose | Auth Required |
|---|---|---|---|
| `GET` | `/api/enquiry` | List all enquiries (scoped by role) | ✅ |
| `POST` | `/api/enquiry` | Create a new enquiry | ✅ |
| `GET` | `/api/enquiry/[id]` | Get a single enquiry | ✅ |
| `PUT` | `/api/enquiry/[id]` | Update an enquiry | ✅ |
| `DELETE` | `/api/enquiry/[id]` | Delete an enquiry | ✅ |

### Hotel Booking

| Method | Route | Purpose | Auth Required |
|---|---|---|---|
| `GET` | `/api/hotel` | List hotel bookings | ✅ |
| `POST` | `/api/hotel` | Create a hotel booking | ✅ |
| `PUT` | `/api/hotel/[id]` | Update a hotel booking | ✅ |
| `DELETE` | `/api/hotel/[id]` | Delete a hotel booking | ✅ |

### Cab Booking

| Method | Route | Purpose | Auth Required |
|---|---|---|---|
| `GET` | `/api/cabBooking` | List cab bookings | ✅ |
| `POST` | `/api/cabBooking` | Create a cab booking | ✅ |
| `PUT` | `/api/cabBooking/[id]` | Update a cab booking | ✅ |
| `DELETE` | `/api/cabBooking/[id]` | Delete a cab booking | ✅ |

### Follow-Up

| Method | Route | Purpose | Auth Required |
|---|---|---|---|
| `GET` | `/api/followup` | List follow-ups | ✅ |
| `POST` | `/api/followup` | Log a new follow-up | ✅ |
| `DELETE` | `/api/followup/[id]` | Delete a follow-up | ✅ |

### Error Responses

| Status | Meaning |
|---|---|
| `401` | No valid session token |
| `403` | Authenticated but insufficient role |
| `400` | Malformed request body |
| `404` | Resource not found |
| `500` | Internal server error |

---

## Database Design

> The schema below is inferred from the domain model (Enquiry, Hotel, CabBooking, FollowUp) and Prisma's presence in the stack. Verify against `prisma/schema.prisma` for exact field names and constraints.

### Entities

**User** — CRM users with role-based access.

**Enquiry** — Core entity representing a customer travel enquiry.

**Hotel** — Hotel booking record linked to an enquiry.

**CabBooking** — Cab/transport booking record linked to an enquiry.

**FollowUp** — Timestamped follow-up note on an enquiry, authored by a user.

### ER Diagram

```mermaid
erDiagram
    User {
        String id PK
        String name
        String email
        String password
        String role
        DateTime createdAt
    }

    Enquiry {
        String id PK
        String customerName
        String contactNumber
        String destination
        DateTime travelDate
        String status
        String assignedToId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Hotel {
        String id PK
        String enquiryId FK
        String hotelName
        DateTime checkIn
        DateTime checkOut
        String status
        DateTime createdAt
    }

    CabBooking {
        String id PK
        String enquiryId FK
        String cabType
        DateTime pickupDate
        String pickupLocation
        String dropLocation
        String status
        DateTime createdAt
    }

    FollowUp {
        String id PK
        String enquiryId FK
        String userId FK
        String note
        DateTime followUpDate
        DateTime createdAt
    }

    User ||--o{ Enquiry : "assigned to"
    User ||--o{ FollowUp : "logs"
    Enquiry ||--o{ Hotel : "has"
    Enquiry ||--o{ CabBooking : "has"
    Enquiry ||--o{ FollowUp : "has"
```

### Notes
- Prisma v7 uses the new `prisma-client` generator with a custom `output` path and `prisma.config.ts` for CLI configuration — this is the modern Prisma architecture as of v7.
- The `@prisma/adapter-pg` package provides the PostgreSQL driver adapter, enabling direct pg connections without the legacy query engine binary.

---

## Authentication & Authorization

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant SignInPage
    participant NextAuth
    participant DB

    User->>SignInPage: Submit credentials
    SignInPage->>NextAuth: POST /api/auth/signin
    NextAuth->>DB: Lookup user by email
    DB-->>NextAuth: User record
    NextAuth->>NextAuth: Verify password hash
    NextAuth->>NextAuth: Build JWT (include role)
    NextAuth-->>User: Set session cookie (next-auth.session-token)
```

### JWT Strategy

NextAuth is configured with the **JWT session strategy**. The session cookie holds a signed JWT containing the user's `id`, `email`, and `role`. No server-side session store is needed — all session state lives in the cookie.

### Token Verification in Middleware

`getToken()` from `next-auth/jwt` decodes and verifies the JWT on every matched request using `NEXTAUTH_SECRET`. This runs at the Edge (no Node.js runtime required), making it fast and serverless-compatible.

### Role System

| Role | Access |
|---|---|
| `admin` | `/Admin/**`, `/api/**` |
| `employee` | `/Employee/**`, `/api/**` |

Both roles can access all API routes (auth-gated at middleware). Further resource-level scoping (e.g., employees only seeing their own enquiries) should be implemented inside route handlers.

### Password Handling

Password hashing strategy is implemented within NextAuth's `authorize` callback. The exact hashing library is not visible from the public file list — confirm in `app/api/auth/[...nextauth]/route.ts`.

---

## Validation

Not currently implemented via a dedicated validation library (e.g., Zod, Yup). Input validation, if present, is handled inline within route handlers.

**Recommendation:** Introduce Zod schemas co-located with route handlers for consistent request validation and type-safe parsing.

---

## Error Handling

- API routes return appropriate HTTP status codes (`400`, `401`, `403`, `404`, `500`) with JSON error bodies.
- Middleware returns `401` JSON for unauthenticated API requests and `302` redirects for unauthenticated page requests.
- No global error boundary or centralized error logging middleware is currently implemented.
- Next.js App Router `error.tsx` boundaries can be added per-segment for UI-level error recovery.

---

## Security

| Measure | Status | Notes |
|---|---|---|
| JWT authentication | ✅ Implemented | Via NextAuth + `getToken()` |
| Role-based access control | ✅ Implemented | Enforced in middleware |
| API route protection | ✅ Implemented | 401 returned for missing token |
| HTTPS | ✅ (Vercel) | Enforced by Vercel platform |
| Environment secrets | ✅ | Via `.env`, excluded from git |
| Prisma parameterized queries | ✅ | SQL injection protection by default |
| Input validation / sanitization | ❌ Not implemented | Recommend adding Zod |
| Rate limiting | ❌ Not implemented | Recommend Upstash or middleware-level limiting |
| CSRF protection | Handled by NextAuth | NextAuth includes CSRF token for form submissions |
| Helmet / security headers | ❌ Not configured | Add via `next.config.ts` headers() |
| Dependency audit | Not documented | Run `npm audit` regularly |

---

## Performance

- **Turbopack** is used in development (`next dev --turbopack`) for faster HMR and cold starts.
- **Prisma Client** with `@prisma/adapter-pg` avoids spawning a separate query engine process, reducing cold-start latency in serverless environments.
- **Vercel Speed Insights** (`@vercel/speed-insights`) is integrated for real-user performance monitoring in production.
- **Pagination:** Not currently visible in the public API signatures — recommended for all list endpoints.
- **Caching:** Not currently implemented (no Redis, no Next.js `cache()` wrappers observed).
- **Database indexes:** Depend on the Prisma schema — foreign keys on `enquiryId`, `userId` fields should be indexed.

---

## Configuration

### `next.config.ts`
Minimal configuration — no custom rewrites, redirects, or image domains are defined. The default Next.js App Router setup is used as-is.

### `tsconfig.json`
Standard Next.js TypeScript configuration. Path aliases and strict mode settings should be verified directly in the file.

### `eslint.config.mjs`
Flat ESLint config format (ESLint v9+). Extends `eslint-config-next` for Next.js-specific rules.

### `postcss.config.mjs`
Uses `@tailwindcss/postcss` for Tailwind CSS v4 integration via PostCSS.

### `prisma.config.ts`
Prisma v7 CLI configuration file. Defines the schema path, migrations directory, and datasource URL binding — separating CLI config from the Prisma schema itself.

### `vercel.json`
Vercel deployment configuration. Exact contents not publicly visible; likely defines region, function config, or environment overrides.

---

## Design Decisions

**1. Middleware-level auth over per-route `getServerSession`**
Using `getToken()` in middleware is stateless and runs at the Edge, making it faster than calling `getServerSession()` in every route handler. For this application's role-gating needs, middleware is sufficient — route handlers don't need to repeat auth checks.

**2. Prisma v7 with `@prisma/adapter-pg`**
The project uses the modern Prisma v7 architecture with the new `prisma-client` generator and a pg driver adapter. This removes the Rust-based query engine binary, reducing deployment bundle size and cold-start times — particularly important on Vercel serverless functions.

**3. Next.js App Router monolith**
Keeping frontend and backend in one Next.js application simplifies deployment (single Vercel project), eliminates CORS complexity, and allows Server Components to query the database directly without an HTTP round-trip.

**4. Route groups `(authenticated)` for layout sharing**
Using Next.js route groups allows Admin and Employee sections to each have their own layout (sidebar, nav) without affecting the URL structure — clean separation of UI concerns without path pollution.

**5. Singleton Prisma client in `db/`**
Exporting a module-level singleton prevents connection pool exhaustion in Next.js development (which hot-reloads modules), a well-known pitfall when instantiating Prisma directly in route handlers.

---

## Future Improvements

### Short-term
- Add Zod validation to all API route handlers
- Add `npm audit` to CI or pre-commit hooks
- Create a `.env.example` file documenting all required variables
- Add `error.tsx` and `loading.tsx` per route segment for better UX
- Implement pagination on all list API endpoints

### Medium-term
- Add rate limiting to API routes (Upstash Redis + `@upstash/ratelimit`)
- Add a global error logging solution (Sentry or similar)
- Implement a test suite (Vitest + React Testing Library for components; Playwright for E2E)
- Add HTTP security headers in `next.config.ts` (`X-Frame-Options`, `CSP`, `X-Content-Type-Options`)
- Role-level data scoping inside route handlers (employees should only access their assigned enquiries)

### Long-term
- Real-time follow-up notifications using WebSockets or Server-Sent Events
- File attachment support for booking documents (via Vercel Blob or S3)
- Audit log table tracking all CRM mutations with actor, timestamp, and diff
- Admin analytics dashboard with conversion funnel metrics
- Voice AI agent integration for automated enquiry intake (Pipecat + Groq + Deepgram)
- Docker Compose setup for local development parity
- GitHub Actions CI pipeline (lint → type-check → test → deploy)

---

## Troubleshooting

**`prisma generate` fails during `npm run build`**
Ensure `DATABASE_URL` is set in your environment. On Vercel, add it under Project → Settings → Environment Variables.

**`NEXTAUTH_SECRET` error on startup**
NextAuth requires this variable to be set in all environments. Generate one with `openssl rand -base64 32`.

**Redirect loop on `/signin`**
Occurs when `NEXT_PUBLIC_WEBSITE_URL` is missing a trailing slash or points to the wrong origin. Ensure the value ends with `/`, e.g., `http://localhost:3000/`.

**`/api/auth/*` routes returning 401**
If you add `/api/:path*` to the middleware matcher without excluding NextAuth's own routes, the auth endpoints will reject themselves. Add an early return:
```typescript
if (pathname.startsWith('/api/auth')) return NextResponse.next();
```

**Prisma client not found after clone**
Run `npx prisma generate` before starting the dev server. The generated client is not committed to git.

**Port 3000 already in use**
```bash
lsof -i :3000 | grep LISTEN   # find the process
kill -9 <PID>
```
Or start on a different port: `next dev --port 3001`.

**Database connection refused**
Verify PostgreSQL is running and `DATABASE_URL` is correctly formatted. Test the connection string directly:
```bash
psql "postgresql://user:pass@host:5432/dbname"
```

---

## Contributing

1. Fork the repository and create a feature branch from `master`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes. Follow existing code conventions (TypeScript strict, Tailwind for styling).
3. Run lint before committing:
   ```bash
   npm run lint
   ```
4. Open a pull request against `master` with a clear description of the change and its motivation.
5. One open pull request is currently pending — check existing PRs before starting overlapping work.

---

## License

No license currently specified.

---

## Acknowledgements

This project is built on the following open-source libraries and platforms:

- [Next.js](https://nextjs.org) — React framework with App Router
- [Prisma](https://www.prisma.io) — Type-safe ORM for PostgreSQL
- [NextAuth.js](https://next-auth.js.org) — Authentication for Next.js
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS framework
- [Recharts](https://recharts.org) — Composable charting library for React
- [Lucide React](https://lucide.dev) — Icon library
- [Nodemailer](https://nodemailer.com) — Email sending for Node.js
- [date-fns](https://date-fns.org) — Date utility library
- [react-calendar](https://github.com/wojtekmaj/react-calendar) — Calendar component
- [react-date-range](https://github.com/hypeserver/react-date-range) — Date range picker
- [Vercel](https://vercel.com) — Deployment and hosting platform

---

## Author

**Sahil Khachi**
B.Tech → M.Tech CSE (NIT Jalandhar, 2026)
Research interests: NLP, LLMs

- GitHub: [@KhachiSahil](https://github.com/KhachiSahil)
- Live project: [project-bhau.vercel.app](https://project-bhau.vercel.app)

---

## Project Status

**MVP — actively developed.**

The core domain (enquiries, bookings, follow-ups, role-based access) is functional and deployed to production on Vercel. Authentication and authorization are correctly implemented. The codebase lacks automated tests, input validation middleware, and observability tooling — areas that would need to be addressed before classifying this as production-ready for a client-facing deployment at scale.

---

## Summary

project_bhau is a role-gated travel agency CRM built as a Next.js 16 App Router monolith. It uses Prisma v7 with a PostgreSQL adapter for type-safe data access, NextAuth v4 with JWT sessions for authentication, and Edge middleware for fast, stateless route protection. The application enforces a two-role system (`admin` / `employee`) at the routing layer without per-handler session checks, keeping route handlers lean. The stack is intentionally minimal — no Redis, no background queues, no separate API service — making it straightforward to deploy and maintain as a single Vercel project. Future iterations should prioritize input validation (Zod), automated testing, and rate limiting before onboarding live agency data.
