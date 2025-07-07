# 🦷 ENTNT Dental Center Dashboard

A modern, responsive dental center management system built with **React**, **TypeScript**, and **TailwindCSS**. This project enables role-based access for **Admin**, **Doctor**, and **Patient** with full functionality like appointment scheduling, patient profiles, and revenue tracking.


## 🚀 Project Setup

### 🧰 Prerequisites
- Node.js ≥ 18
- pnpm (or npm/yarn)
- Modern browser

### 📦 Installation
bash
npm install

### 🔧 Run the Development Server
bash
pnpm dev
```

Then visit: <http://localhost:5173>

---

## 🗂 Folder Structure & Architecture

```
dental-center-dashboard/
│
├── public/               # Static files (favicon, index.html)
├── src/
│   ├── assets/           # Images, logos, icons
│   ├── components/       # Reusable UI components (Buttons, Cards, Inputs)
│   ├── context/          # Global contexts (AuthContext, DataContext)
│   ├── pages/            # Route pages (Dashboard, Appointments, Patients, Profile)
│   ├── services/         # LocalStorage logic (auth.ts, storage.ts)
│   ├── styles/           # Global Tailwind styles (globals.css)
│   ├── types/            # TypeScript types and interfaces
│   ├── utils/            # Helper utilities (formatters, validators)
│   └── App.tsx           # Main route and layout config
│
├── tailwind.config.ts    # Tailwind config
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite dev server config
└── README.md             # You're reading it!
```

---

## 🔐 Role-Based Access Control (RBAC)

| Role    | Access Features                                                                 |
|---------|----------------------------------------------------------------------------------|
| Admin   | Dashboard + Patients + Appointments + Calendar + Revenue Insights               |
| Doctor  | Limited appointment views, profile access                                       |
| Patient | **Only sees their profile** (My Profile tab only)                               |

Navigation and routes are conditionally rendered based on the authenticated role.

---

##  Data Layer: LocalStorage

- Appointments, Users, and Patients are stored in `localStorage`.
- Utility wrappers for `getItem`, `setItem`, and `removeItem` live under `src/utils/storage.ts`.

localStorage.setItem("appointments", JSON.stringify(appointmentsArray));

## 📊 Dashboard Features (Admin Only)

- Total Patients
- Completed / Scheduled Appointments
- Total Revenue (calculated from all appointment costs)
- Monthly Revenue Chart (BarChart)
- Status Distribution
- Top Patients by Spending
- Today’s and Upcoming Appointments

> Revenue is dynamically computed based on appointment costs. Example: ₹80 + ₹150 = **₹230**


## Responsive Design

- Built mobile‑first using **TailwindCSS**
- Fully responsive layout for:
  - Small Screens (mobile)
  - Tablets
  - Desktop Dashboards
- Scrollbars, dynamic font scaling, and animations handled in `globals.css`

---

## Technical Decisions

| Area                  | Decision                                                         |
|-----------------------|------------------------------------------------------------------|
| UI Framework          | TailwindCSS — clean utility‑first responsive design             |
| Component Library     | Custom‑built, minimal dependency UI                             |
| State Management      | React Context (`AuthContext`, `DataContext`)                    |
| Auth & Session        | Simulated login with localStorage, supports role and ID         |
| Data Storage          | No backend; localStorage for users, patients, appointments      |
| Charting              | `recharts` used for bar charts and visual stats                 |
| Types                 | Centralised in `src/types/types.ts`                             |
| Routing               | Role‑based routing with `react-router-dom` and guards           |

---

##  Known Issues

- **No real authentication** — users can manipulate `localStorage` manually  
- **No cross‑device persistence** (local only)  
- File uploads are local blob URLs only  
- No server or database — front‑end demo project  
- Limited mobile testing on very old devices  


## Future Improvements

- Firebase / Express backend for persistence  
- Search & filter in patient / appointment tables  
- Form validation enhancements  
- Dedicated Doctor vs Admin dashboards  
- Cloud file uploads (Firebase Storage / Cloudinary)  

## Default Login Credentials

| Role    | Email                | Password   |
|---------|----------------------|-----------|
| Admin   | admin@entnt.com      | admin123  |
| Doctor  | doctor@entnt.com     | doc123    |
| Patient | patient1@entnt.com   | patient123|


![Dashboard](public/screenshots/admin-dashboard.png)

## 📄 License

MIT — feel free to fork and learn!
