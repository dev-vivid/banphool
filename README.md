# Node.js REST API

> Prisma · MySQL · JWT · Audit Logging · CRON Tasks · Security Hardened

---

## 📁 Project Structure

```
node-app/
│
├── prisma/
│   ├── schema.prisma              ← All models: User, Product, AuditLog, RefreshToken
│   └── seed.js                    ← Seeds admin user + sample products
│
├── scripts/
│   ├── createAdmin.js             ← Interactive CLI to create admin user
│   └── checkDb.js                 ← Check DB connection + table row counts
│
├── src/
│   ├── server.js                  ← Entry point: Express app + security stack
│   │
│   ├── config/
│   │   ├── env.js                 ← Centralised env config (fails fast if missing)
│   │   └── prisma.js              ← Prisma client singleton
│   │
│   ├── constants/
│   │   └── index.js               ← ROLES, AUDIT_ACTIONS, HTTP codes, MESSAGES
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js      ← authenticate() + authorize()
│   │   ├── validate.js            ← express-validator error collector
│   │   ├── rateLimiter.js         ← Global + auth-specific rate limits
│   │   └── errorHandler.js        ← Global error + 404 handler
│   │
│   ├── services/                  ← Shared services (used across modules)
│   │   ├── auditService.js        ← writeAudit() — logs to audit_logs table
│   │   └── tokenService.js        ← JWT sign/verify + refresh token DB ops
│   │
│   ├── shared/
│   │   ├── utils/
│   │   │   ├── logger.js          ← Winston logger (console + rotating files)
│   │   │   └── response.js        ← Standardised JSON response helpers
│   │   └── helpers/
│   │       ├── pagination.js      ← parsePagination() + buildPaginationMeta()
│   │       └── ipHelper.js        ← getClientIp() — proxy-aware
│   │
│   ├── tasks/
│   │   ├── index.js               ← Registers + starts all CRON tasks
│   │   └── cleanupTokens.js       ← Daily task: delete expired refresh tokens
│   │
│   ├── routes/
│   │   └── index.js               ← Master router: mounts all module routes
│   │
│   └── modules/
│       ├── auth/
│       │   ├── controller/
│       │   │   └── authController.js
│       │   ├── routes/
│       │   │   └── authRoutes.js
│       │   ├── usecase/
│       │   │   └── authUseCase.js
│       │   ├── validation/
│       │   │   └── authValidation.js
│       │   └── service/
│       │       └── authService.js
│       │
│       └── product/
│           ├── controller/
│           │   └── productController.js
│           ├── routes/
│           │   └── productRoutes.js
│           ├── usecase/
│           │   └── productUseCase.js
│           ├── validation/
│           │   └── productValidation.js
│           └── service/
│               └── productService.js
│
├── logs/                          ← Auto-generated log files (gitignored)
├── .env.example
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── nodemon.json
└── package.json
```

### Layer Responsibilities

| Layer | File | Responsibility |
|---|---|---|
| **routes** | `*Routes.js` | URL definitions, attach validation + middleware chain |
| **validation** | `*Validation.js` | Input shape & type rules (express-validator) |
| **controller** | `*Controller.js` | Parse request → call use-case → send response |
| **usecase** | `*UseCase.js` | Business logic, rules, orchestration, audit logging |
| **service** | `*Service.js` | Database queries only (Prisma). No business logic |

---

## 🚀 Step-by-Step Setup & Run

### Step 1 — Check prerequisites

```bash
node --version    # Must be v18 or higher
npm --version     # Must be v9 or higher
mysql --version   # Must be MySQL 8+
```

Download Node from https://nodejs.org if needed.

---

### Step 2 — Install dependencies

```bash
npm install
```

This installs all packages including Prisma, Express, JWT, bcrypt, Winston, node-cron, helmet, etc.

---

### Step 3 — Create your .env file

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=3000
NODE_ENV=development

# Prisma connection string
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/node_api_db"

# JWT — change both secrets to random 32+ char strings!
JWT_SECRET=my_super_secret_key_change_this_32chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=my_refresh_secret_key_change_this_32chars
JWT_REFRESH_EXPIRES_IN=30d

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
BCRYPT_ROUNDS=12
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
LOG_LEVEL=debug
```

---

### Step 4 — Create the database in MySQL

```bash
mysql -u root -p
```

```sql
CREATE DATABASE node_api_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

---

### Step 5 — Generate Prisma client

```bash
npx prisma generate
```

This reads `prisma/schema.prisma` and generates the typed Prisma client in `node_modules/@prisma/client`.

---

### Step 6 — Run Prisma migrations (creates all tables)

```bash
npx prisma migrate dev --name init
```

This creates all tables: `users`, `products`, `audit_logs`, `refresh_tokens`.

> **Tip:** To see your schema in a browser UI, run: `npx prisma studio`

---

### Step 7 — Seed the database

```bash
npm run prisma:seed
```

Creates:
- Admin user: `admin@example.com` / `Admin@123`
- 5 sample products

---

### Step 8 — Create the logs folder

```bash
mkdir -p logs
```

---

### Step 9 — Start the server

```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

You should see:
```
[10:00:00] info: 🚀 Server → http://localhost:3000  [development]
[10:00:00] info: ⏰ Token cleanup task scheduled (daily at midnight UTC)
[10:00:00] info: ✅ All background tasks started
```

---

### Step 10 — Verify

```bash
curl http://localhost:3000/health
```

```json
{ "status": "ok", "timestamp": "...", "env": "development" }
```

---

## 📡 API Reference

### Auth  (`/api/auth`)

| Method | URL | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register |
| POST | `/api/auth/login` | — | Login → tokens |
| POST | `/api/auth/refresh` | — | Refresh access token |
| POST | `/api/auth/logout` | Bearer | Revoke all refresh tokens |
| GET  | `/api/auth/me` | Bearer | Current user |

#### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{ "name": "Alice", "email": "alice@test.com", "password": "Secret123", "role": "ADMIN" }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "alice@test.com", "password": "Secret123" }'
```

Returns `accessToken` and `refreshToken`. Use `accessToken` as:
```
Authorization: Bearer <accessToken>
```

---

### Products  (`/api/products`)

| Method | URL | Role | Description |
|---|---|---|---|
| GET    | `/api/products` | any | List all (paginated) |
| GET    | `/api/products/:id` | any | Get one |
| POST   | `/api/products` | ADMIN | Create |
| PUT    | `/api/products/:id` | ADMIN | Update |
| DELETE | `/api/products/:id` | ADMIN | Soft delete |

#### List with filters
```
GET /api/products?page=1&limit=10&search=phone&category=Electronics&sortBy=price&sortOrder=asc
```

#### Response shape (paginated)
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 45, "page": 1, "limit": 10,
    "totalPages": 5, "hasNext": true, "hasPrev": false
  }
}
```

---

## 🛠 Utility Scripts

```bash
# Interactive: create an admin user
node scripts/createAdmin.js

# Check DB connection + row counts
node scripts/checkDb.js

# Open Prisma Studio (visual DB browser)
npx prisma studio

# Reset database completely (WARNING: deletes all data)
npx prisma migrate reset

# Push schema changes without migration file
npx prisma db push
```

---

## 🔐 Security Features

| Feature | Detail |
|---|---|
| `helmet` | 14+ security HTTP headers |
| CORS | Origin whitelist via `ALLOWED_ORIGINS` |
| Rate Limiting | Global: 100/15min — Auth: 10/15min |
| Body limit | 10KB max payload |
| HPP | HTTP Parameter Pollution protection |
| Mongo Sanitize | Strips `$` and `.` from inputs |
| Parameterised queries | Prisma ORM — no raw SQL string building |
| Bcrypt | Password hashing (configurable rounds) |
| Soft delete | Records marked inactive, never deleted |
| UUID IDs | Non-guessable primary keys |
| Audit trail | Every write logs IP, user, old/new values |
| CRON cleanup | Expired tokens purged daily at midnight |

---

## ➕ Adding a New Module

```bash
mkdir -p src/modules/order/{controller,routes,usecase,validation,service}
```

Create 5 files following the same pattern as `auth` or `product`, then register in `src/routes/index.js`:

```js
router.use('/orders', require('../modules/order/routes/orderRoutes'));
```
