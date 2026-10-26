# AURA — Fine Art, Architectural & Editorial Photography Portfolio

A responsive full-stack photography and art portfolio built for visual artist **Mohammed Kotbi**, upgraded for **Assignment 3** with a **Node.js + Express (MVC) backend**, **PostgreSQL database**, **JWT authentication with persistent sessions**, and a componentized **React + Tailwind CSS** frontend.

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
Run both backend and frontend together with a single command:
```bash
npm run dev
```
- **Backend API:** `http://localhost:5000` (Healthcheck: `http://localhost:5000/api/health`)
- **Frontend App:** `http://localhost:5173`

---

## Testing Credentials

For quick evaluation during assessment:
- **Email:** `demo@auragallery.com`
- **Password:** `password123`
*(Or click the **"Click here to auto-fill Demo Account"** button inside the Sign In modal).*

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