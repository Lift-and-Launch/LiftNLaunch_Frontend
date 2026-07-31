# 🚀 Lift & Launch SaaS Frontend

This is the responsive, high-performance **React Single Page Application (SPA)** powering the client interface of the **Lift & Launch** SaaS crowdfunding platform. Built on **Vite**, **TypeScript**, **Tailwind CSS**, and **Zustand**, it provides an interactive canvas builder, real-time analytics dashboards, ad connection dashboards, and super admin moderation consoles.

---

## 🛠️ Technology Stack
* **Runtime/Bundler**: Vite + React
* **Styling**: Tailwind CSS & Vanilla CSS (Tailored HSL theme palettes)
* **Icons**: Lucide React
* **Routing**: React Router DOM (v6)
* **State Management**:
  * **AuthContext**: React Context managing session tokens and user state payloads.
  * **Zustand Stores**: High-performance canvas store (`useWebsiteStore`) for managing drag-and-drop elements and styles in the landing page builder.

---

## 📁 Folder Structure

```
frontend-root/
│
├── public/                 # Static assets (favicons, manifest)
├── src/
│   ├── api/                # Axios instance configuration with JWT interceptors
│   ├── components/         # Reusable layouts (Navbar, Sidebar, Modals, Canvas Elements)
│   ├── context/            # Authentication contexts
│   ├── layouts/            # Page shell layouts (MainLayout, DashboardLayout)
│   ├── pages/              # View screens (Home, Profile, Builder, Dashboard, Admin)
│   ├── store/              # Zustand stores (useWebsiteStore)
│   ├── types/              # TypeScript definitions
│   ├── routes.jsx          # Route declarations & Security gate wrappers
│   ├── index.css           # Tailwind base utilities and custom design tokens
│   └── main.jsx            # React root application render
│
├── package.json            # NPM dependencies and build commands
├── tailwind.config.js      # CSS styling variables
├── vite.config.js          # Vite build options
└── README.md               # Frontend documentation
```

---

## 🔐 Route Security Gating

The frontend secures user transitions via three custom wrapper routes in `routes.jsx`:

1. **`ProtectedRoute`**:
   * Blocks non-authenticated users. Redirects anonymous traffic to `/signin`.
2. **`PriceGatedRoute`**:
   * Restricts premium elements (like the drag-and-drop website builder) to paid accounts. Redirects free profiles to the `/pricing` plan tier screen.
3. **`ApprovedRoute`**:
   * Gates users whose account subscriptions are **under admin verification review** or have been **rejected**. Redirects unapproved paid profiles back to `/dashboard` with descriptive warning boxes.

---

## 🚀 Key Modules & Pages

* **Launch Center (`/dashboard`)**:
  * Welcomes users dynamically, presents horizontal statistics grids (Followers, Views, Engagement), lists existing campaigns as cards, and serves OAuth link buttons for Google Ads & Meta Ads.
* **Landing Page Builder (`/dashboard/campaign/builder`)**:
  * A drag-and-drop canvas editing dashboard supporting headings, text blocks, buttons, images, video assets, forms, and custom stylesheet overrides.
* **Account Hub (`/dashboard/profile`)**:
  * Displays account status, active business verification lists, Stripe connected IDs, and computes/visualizes active subscription countdown bars.
* **Super Admin Console (`/admin/dashboard` - via `AdminDashboardView`)**:
  * Features table lists of all registered users and campaigns, audit logs, and handles business verification approvals and campaign live status moderation.

---

## ⚙️ Development & Configurations

### 1. Environment Config
Create a `.env` file at the root:
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Dev Server
```bash
npm run dev
```

### 4. Build for Production
Compiles and bundles minimized chunks inside the `/dist` directory:
```bash
npm run build
```