# AURA — Fine Art, Architectural & Editorial Photography Portfolio

A responsive full-stack photography and art portfolio built for visual artist **Mohammed Kotbi**, featuring **Assignment 4: Real payments with Stripe Checkout (test mode)** on top of a **Node.js + Express (MVC) backend**, **PostgreSQL database**, **JWT authentication with persistent sessions**, and a componentized **React + Tailwind CSS** frontend.

---

## Assignment 4: Stripe Checkout & Payments Architecture Checklist

| Assignment 4 Step | Implementation Details | Status |
| :--- | :--- | :---: |
| **1. Database Schema (`orders` & `orderItems`)** | `orders` table (one row per purchase, with `stripe_session_id`, `stripe_payment_intent_id`, `status`) and `order_items` table (snapshot item title, quantity, and verified price) with `"orderItems"` SQL view. | ✓ |
| **2. Stripe Account & Keys in `.env`** | Stripe SDK configured in test mode. Secret keys (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) loaded securely from `server/.env`. | ✓ |
| **3. Auth Middleware Checkout Gate** | `authenticateToken` middleware strictly blocks checkout for unauthenticated visitors (`HTTP 401`). Frontend prompts sign-in before checkout. | ✓ |
| **4. Tamper-Proof Checkout Route** | `POST /api/checkout/create-session` looks up real prices directly from PostgreSQL `ItemModel.findById()`, records the order as `'pending'`, and creates the Stripe Checkout Session. | ✓ |
| **5. Verified Webhook Route** | `POST /api/checkout/webhook` mounted with `express.raw()` to cryptographically verify Stripe's signature with `stripe.webhooks.constructEvent()`. **The webhook is the only mechanism permitted to mark an order as `paid`.** | ✓ |
| **6. "Buy Now" Wired to Stripe** | Integrated "Buy Now" buttons in `GalleryItem.jsx`, `ArtworkModal.jsx`, the active order summary banner, and `BookingSection.jsx` that redirect to Stripe's hosted checkout page. | ✓ |
| **7. Order Lookup & Success Page** | Success page at `/success?session_id=...&order_id=...` that polls `GET /api/checkout/order/:id` with retry logic to display confirmed `PAID` status once the webhook completes. | ✓ |
| **8. Production & Stripe CLI Ready** | Supports local testing with Stripe CLI forwarding and production webhook endpoints for deployed environments. | ✓ |

---

## Assignment 3 Architecture & Requirements Checklist

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Client / Server Split** | Repository split into `/client` (Vite, React 18, Tailwind CSS) and `/server` (Node.js, Express, PostgreSQL). | ✓ |
| **No TypeScript** | Built purely with modern JavaScript (ES modules, `.jsx` and `.js`). | ✓ |
| **MVC Backend** | Clean Model-View-Controller architecture (`/server/src/models`, `/server/src/controllers`, `/server/src/routes`). | ✓ |
| **Real PostgreSQL Database** | Managed cloud PostgreSQL instance with 4 structured tables (`users`, `items`, `services`, `orders`). | ✓ |
| **Plain-English Schema** | Relational schema connecting users, portfolio items, photography packages, and inquiries. | ✓ |
| **Secrets in `.env` (Excluded from Git)** | Sensitive credentials (`DATABASE_URL`, `JWT_SECRET`) kept in `server/.env`. `.gitignore` excludes `.env`. | ✓ |
| **Automated Seed Script** | `npm run seed` creates tables and seeds Week 2 gallery artworks, service packages, and a demo account. | ✓ |
| **Working RESTful API** | Endpoints for `/api/health`, `/api/items`, `/api/services`, `/api/orders`, and `/api/auth`. | ✓ |
| **Real Authentication & Sessions** | Signup, login, password hashing with bcrypt, JWT token verification, and sessions that **survive page refresh**. | ✓ |
| **UI Reflects Auth State** | Header dynamically displays "Sign In" when logged out, and the user's name badge & "Sign Out" button when logged in. | ✓ |
| **React Connected to Live API** | `MainContent.jsx` and `ServicesSection.jsx` fetch data dynamically from Express + PostgreSQL. | ✓ |
| **Live Deployment Ready** | Configurations provided for Railway (Backend) + Vercel (Frontend). | ✓ |

---

## Assessment Guide: Explaining Your Project at Assessment

Use this section to confidently explain your code, folder structure, database schema, and authentication during oral examination.

### 1. Folder Structure Walkthrough

```text
portfolio-gallery/
├── client/                     # FRONTEND (React 18 + Tailwind CSS + Vite)
│   ├── public/assets/images/   # High-resolution artwork assets
│   ├── src/
│   │   ├── components/         # Modular UI components
│   │   │   ├── Header.jsx      # Top navigation displaying Auth state (Sign In / User Avatar + Sign Out)
│   │   │   ├── Hero.jsx        # Landing hero banner with typography & stats
│   │   │   ├── MainContent.jsx # Live gallery fetching from /api/items with category filter
│   │   │   ├── GalleryItem.jsx # Artwork card featuring controlled QuantityStepper
│   │   │   ├── QuantityStepper.jsx # Controlled stepper (value + onChange, no internal state)
│   │   │   ├── AddArtworkModal.jsx # Modal to add new artworks directly into PostgreSQL
│   │   │   ├── ArtworkModal.jsx # Detail lightbox showing medium format camera specs
│   │   │   ├── AboutSection.jsx # Artist bio & accolades
│   │   │   ├── ServicesSection.jsx # Commission packages fetched from /api/services
│   │   │   ├── BookingSection.jsx  # Inquiry form submitting orders to PostgreSQL /api/orders
│   │   │   ├── AuthModal.jsx   # Luxury modal with Sign In / Register tabs & demo auto-fill
│   │   │   └── Footer.jsx      # Semantic footer with navigation links
│   │   ├── context/
│   │   │   └── AuthContext.jsx # React context managing user session, login, signup, and logout
│   │   ├── services/
│   │   │   └── api.js          # Unified HTTP client interacting with the Express backend
│   │   ├── data/
│   │   │   └── items.js        # Fallback data & categories
│   │   ├── App.jsx             # Root layout wrapped in AuthProvider
│   │   ├── index.css           # Tailwind directives & smooth animations
│   │   └── main.jsx            # React DOM mounting entry point
│   ├── .env.example            # Frontend environment template (VITE_API_URL)
│   ├── package.json            # Client dependencies and scripts
│   ├── tailwind.config.js      # Custom theme tokens (aura-base, aura-accent, etc.)
│   ├── vercel.json             # SPA routing rewrite rule for Vercel
│   └── vite.config.js          # Vite bundler configuration
│
├── server/                     # BACKEND (Node.js + Express + PostgreSQL MVC)
│   ├── src/
│   │   ├── models/             # MODEL LAYER (Direct database queries via pg.Pool)
│   │   │   ├── User.js         # User queries: findByEmail, findById, create
│   │   │   ├── Item.js         # Portfolio items queries: findAll, findById
│   │   │   ├── Service.js      # Photography services queries: findAll
│   │   │   └── Order.js        # Client orders & inquiries: create, findByUserId
│   │   ├── controllers/        # CONTROLLER LAYER (Business logic & HTTP responses)
│   │   │   ├── authController.js    # signup, login, getMe session check
│   │   │   ├── itemsController.js   # getItems, getItemById
│   │   │   ├── servicesController.js# getServices
│   │   │   └── ordersController.js  # createOrder, getUserOrders
│   │   ├── routes/             # ROUTE LAYER (Maps HTTP methods & URLs to controllers)
│   │   │   ├── auth.js         # /api/auth routes
│   │   │   ├── items.js        # /api/items routes
│   │   │   ├── services.js     # /api/services routes
│   │   │   └── orders.js       # /api/orders routes
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT verification middleware (authenticateToken, optionalAuth)
│   │   ├── db.js               # PostgreSQL connection pool with cloud SSL support
│   │   ├── schema.sql          # SQL schema definition file
│   │   ├── seed.js             # Seeding script populating initial artworks & demo user
│   │   └── index.js            # Express application entry point (CORS, JSON, route mounts)
│   ├── .env                    # Secrets (IGNORED BY GIT: DATABASE_URL, JWT_SECRET)
│   ├── .env.example            # Safe template for environment variables
│   ├── package.json            # Server dependencies and scripts
│   └── Procfile                # Deployment start command for Railway/Render
│
├── .gitignore                  # Confirms .env and credentials are never committed
├── package.json                # Root package with concurrently dev scripts
└── README.md                   # Project documentation & assessment walkthrough
```

---

### 2. The Database Schema in Plain English

The PostgreSQL database is organized into **4 relational tables**:

```sql
-- 1. USERS: Stores registered client & collector accounts
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ITEMS: Stores photography portfolio works (formerly hardcoded in Week 2)
CREATE TABLE items (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  filter_category VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  camera VARCHAR(255),
  image VARCHAR(255) NOT NULL,
  alt TEXT NOT NULL,
  featured VARCHAR(50) DEFAULT 'standard',
  description TEXT NOT NULL,
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  price NUMERIC(10, 2) NOT NULL,
  edition VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. SERVICES: Stores photography commission packages & deliverables
CREATE TABLE services (
  id VARCHAR(100) PRIMARY KEY,
  tag VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  price VARCHAR(100) NOT NULL,
  rate_unit VARCHAR(100),
  badge VARCHAR(100),
  description TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ORDERS: Stores print purchases and booking inquiries linked to users
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### How to explain each table at assessment:
1. **`users` Table:** Stores user credentials. Passwords are **never stored in plain text**; they are hashed using `bcryptjs` with 10 salt rounds. Each user has a unique email.
2. **`items` Table:** Contains all 7 fine art photography items. Column `filter_category` is indexed and queried when filtering by category. `specs` is stored as a PostgreSQL `JSONB` array for flexible camera and exposure details.
3. **`services` Table:** Stores the commercial photography packages (Architectural, Editorial, Portraiture) and their deliverable features.
4. **`orders` Table:** Connects print orders and shoot inquiries to the registered user via `user_id` foreign key (`REFERENCES users(id)`). If a user is not logged in, they can still submit as a guest (`user_id` is nullable).

---

### 3. How MVC (Model-View-Controller) is Wired Up

Our Express backend strictly separates concerns:

1. **Models (`/server/src/models`)**:
   - Only layer that communicates with PostgreSQL via `pool.query()`.
   - Encapsulates SQL queries (`SELECT`, `INSERT`, `UPDATE`).
   - Example: `UserModel.findByEmail(email)` executes `SELECT * FROM users WHERE LOWER(email) = LOWER($1);`.

2. **Controllers (`/server/src/controllers`)**:
   - Contains business logic and request handling.
   - Extracts data from `req.body`, `req.query`, or `req.params`.
   - Performs validation, hashes passwords, generates JWT tokens, and formats HTTP responses (`res.json()`, `res.status()`).

3. **Routes (`/server/src/routes`)**:
   - Maps HTTP methods (`GET`, `POST`) and URLs to controller functions.
   - Applies middleware (e.g. `authenticateToken` to protect `/api/auth/me`).

4. **Views (React Client)**:
   - In a modern decoupled REST API, the React client acts as the View layer, consuming JSON responses emitted by the controllers.

---

### 4. How Authentication & Persistent Sessions Work

#### Registration (`POST /api/auth/signup`)
1. Client sends `{ name, email, password }`.
2. `authController.signup` checks if the email already exists in `users`.
3. Password is encrypted using `bcrypt.hash(password, 10)`.
4. User is inserted into PostgreSQL.
5. Server generates a signed JWT token containing `{ id, email, name, role }` with a 7-day expiration:
   ```javascript
   jwt.sign({ id, email, name, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
   ```
6. Response returns `{ user, token }`.

#### Login (`POST /api/auth/login`)
1. Client sends `{ email, password }`.
2. `UserModel.findByEmail` fetches the user and their `password_hash`.
3. `bcrypt.compare(password, user.password_hash)` securely validates the credentials.
4. If valid, a new JWT token is issued.

#### Session Persistence Across Page Refreshes (`GET /api/auth/me`)
1. When a user logs in, the client saves the JWT in browser storage: `localStorage.setItem('aura_auth_token', token)`.
2. When the user **refreshes the page**, `AuthContext.jsx` runs an initial `useEffect`.
3. If a stored token exists, it makes a request to `GET /api/auth/me` with header:
   ```http
   Authorization: Bearer <token>
   ```
4. The Express `authenticateToken` middleware verifies the token signature against `JWT_SECRET`.
5. The server queries `UserModel.findById(req.user.id)` and returns the user object.
6. React populates the `user` state, and the UI immediately renders the signed-in header (`Demo Collector` avatar + "Sign Out" button).
7. If the token is invalid or expired, `localStorage` is cleared and the user remains logged out.

---

## Local Development Setup

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **PostgreSQL Database** (e.g. Aiven or Neon connection URI)

### 2. Environment Setup
Create `server/.env` with your PostgreSQL database URL and JWT secret:
```env
PORT=5000
DATABASE_URL=postgres://user:password@host:port/defaultdb?sslmode=require
JWT_SECRET=your_secure_random_jwt_secret_key_2026
CLIENT_URL=http://localhost:5173
```

*(Note: `server/.env` is strictly excluded from Git via `.gitignore`.)*

### 3. Install Dependencies
From the repository root:
```bash
npm run install:all
```

### 4. Seed Database
Run the seed script to create tables and insert portfolio data & demo user:
```bash
npm run seed
```

Output:
```text
🌱 Starting database seed script...
✅ Schema tables verified/created (users, items, services, orders).
🖼️  Seeding 7 gallery artworks...
✅ Artworks successfully seeded.
💼 Seeding 3 photography service packages...
✅ Services successfully seeded.
👤 Seeded demo user: demo@auragallery.com (Password: password123)
🎉 Database seeding completed successfully!
```

### 5. Start Development Servers
Start your backend server:
```bash
npm run dev
# Starts Express API at http://localhost:5000 (Healthcheck: http://localhost:5000/api/health)
```

In a second terminal, start the React client:
```bash
cd client && npm run dev
# Starts Vite frontend at http://localhost:5173
```

---

## Testing Credentials

For quick evaluation during assessment:
- **Email:** `demo@auragallery.com`
- **Password:** `password123`
*(Or click the **"Click here to auto-fill Demo Account"** button inside the Sign In modal).*

---

## Assignment 4: Stripe Checkout & Webhook Guide

### 1. Stripe Setup (Test Mode)
1. Sign up for a free Stripe account at [stripe.com](https://stripe.com).
2. Ensure you toggle the switch at the top to **Test Mode**.
3. Go to **Developers > API Keys** and copy your **Secret Key** (`sk_test_...`).
4. Add it to `server/.env`:
   ```bash
   STRIPE_SECRET_KEY=sk_test_51...
   ```

### 2. Testing Webhooks Locally with the Stripe CLI
Stripe sends asynchronous webhooks when payments succeed. To receive them locally on Windows/Mac/Linux:

1. **Install Stripe CLI** (via scoop, choco, brew, or [direct download](https://github.com/stripe/stripe-cli/releases)):
   ```bash
   # Windows (Scoop / Chocolatey)
   scoop install stripe
   # or
   choco install stripe-cli
   ```
2. **Login to Stripe**:
   ```bash
   stripe login
   ```
3. **Forward Webhook Events to your local Express server**:
   In recent versions of Stripe CLI, specify the events or snapshot mode:
   ```bash
   stripe listen --forward-to localhost:5000/api/checkout/webhook --events checkout.session.completed
   ```
   *(Or forward all snapshot events: `stripe listen --forward-to localhost:5000/api/checkout/webhook --all-snapshot`)*
4. Copy the webhook signing secret displayed by the CLI (starts with `whsec_...`) into your `server/.env`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
5. In your app, click **"Buy Now"**, log in with the demo account, and enter Stripe's official test card:
   - **Card Number:** `4242 4242 4242 4242`
   - **Expiration:** Any future date (e.g. `12/30`)
   - **CVC:** Any 3 digits (e.g. `123`)
   - **Postal Code:** Any valid ZIP/postal code (e.g. `10115` or `90210`)
6. Complete payment. Stripe will redirect you to the **Success Page** (`/success?session_id=...&order_id=...`), the webhook will fire in your CLI terminal, and the order will automatically display as **PAID** with a green badge and receipt breakdown.

### 3. Automated Payments Test Suite
Run the automated verification suite to test PostgreSQL schema, price tamper-proofing, transaction insertions, webhook marking as paid, and order receipts:
```bash
cd server
npm run test:payments
```

---

## Oral Assessment Explanation Guide: Farshid's Questions

Prepare for these exact assessment questions:

### Q1: "Walk me through how your checkout flow is wired up."
> *"When a user selects an artwork print and clicks 'Buy Now', the frontend first checks if the user is authenticated via our `AuthContext`. If not, checkout is strictly blocked and they are prompted to sign in.*
> *Once authenticated, the frontend calls `POST /api/checkout/create-session` sending only the artwork ID and quantity.*
> *Our backend `createCheckoutSession` controller receives the request, verifies the JWT token via `authenticateToken` middleware to extract the real user ID, and queries PostgreSQL `ItemModel.findById` to fetch the authentic database price — never trusting any price sent from the browser.*
> *The controller creates an initial order record in `orders` with status `'pending'` and line items in `order_items` inside a database transaction.*
> *It then starts a Stripe Checkout Session with `stripe.checkout.sessions.create()`, stores the returned `stripe_session_id` in the order, and returns the session URL to the browser, which redirects the user to Stripe's hosted payment page."*

### Q2: "How does your webhook work, and why is it the ONLY thing that marks an order as paid?"
> *"We mount `POST /api/checkout/webhook` before `express.json()` using `express.raw({ type: 'application/json' })` so that we have the raw binary request buffer.*
> *We verify Stripe's cryptographic signature using `stripe.webhooks.constructEvent(req.body, sig, webhookSecret)`. This guarantees the request genuinely originated from Stripe and hasn't been intercepted or forged.*
> *When we receive the `checkout.session.completed` event, we extract `session.metadata.order_id` and call `OrderModel.markAsPaid()`, which executes an SQL update: `UPDATE orders SET status = 'paid', stripe_payment_intent_id = ... WHERE id = ...`.*
> *The webhook is the only place allowed to update status to 'paid' because redirect URLs can be manipulated by malicious users simply visiting `/success` directly without actually completing payment. The webhook is the authoritative source of truth."*

### Q3: "Why can the success page land on 'pending' first, and how does your code handle it?"
> *"Because Stripe redirects the user's browser immediately upon payment completion, the redirect can reach our frontend a fraction of a second before the asynchronous webhook HTTP request finishes processing on our server.*
> *To handle this real-world race condition, our `<OrderSuccess />` component calls `GET /api/checkout/order/:id` and polls the database status every 1.5 seconds (up to 8 attempts) until the webhook updates the status to 'paid'. Once 'paid', the status badge turns emerald green and displays the final receipt."*

### Q4: "Show me your orders and order_items tables in PostgreSQL."
> *"We separated purchases into two relational tables:*
> 1. `orders`: *stores one row per purchase with `id`, `user_id` (foreign key to `users.id`), `customer_name`, `customer_email`, `total_price`, `currency`, `status` ('pending' / 'paid'), `stripe_session_id`, and `stripe_payment_intent_id`.*
> 2. `order_items`: *stores individual items purchased with `order_id` (foreign key to `orders.id`), `item_id` (foreign key to `items.id`), `title`, snapshot `price` at the moment of acquisition, and `quantity`.*
> *We also defined a SQL view `\"orderItems\"` matching the assignment naming."*

---

## Public Deployment Guide (Step-by-Step)

### Step A: Deploy the Backend to Railway
1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project** → **Deploy from GitHub repo** → Select this repository.
3. In **Settings** → **Root Directory**, set to: `/server`.
4. In **Variables**, add:
   - `PORT`: `5000`
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `JWT_SECRET`: A long secure string.
   - `CLIENT_URL`: Your Vercel frontend URL (or `*`).
5. Click **Deploy**. Railway will run `Procfile` (`node src/index.js`) and generate a public domain (e.g., `https://aura-api.up.railway.app`).
6. Verify your API health by visiting: `https://aura-api.up.railway.app/api/health`.

### Step B: Deploy the Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New Project** → Select your repository.
3. In **Root Directory**, click Edit and select: `client`.
4. In **Environment Variables**, add:
   - `VITE_API_URL`: Your Railway backend URL (e.g., `https://aura-api.up.railway.app`).
5. Click **Deploy**.
6. Vercel will build the React app and deploy to a live URL (e.g., `https://aura-gallery.vercel.app`).

---

## Git Safety & Secrets Confirmation

To verify secrets are excluded from Git:
```bash
# Check that .env is ignored
git status --ignored

# Verify .env rule
git check-ignore -v server/.env
# Output: .gitignore:21:server/.env    server/.env
```
No `.env` file or database password has ever been committed.