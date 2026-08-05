# ExpenseTracker — Assignment 1

**Name:** Warda
**Bootcamp:** TechnerLab Bootcamp · MERN Stack + AI Engineering
**Stack:** Node.js · Express · fs module · React (Vite) · Tailwind CSS v3

A full-stack personal expense tracker. The backend stores data in a local
`expenses.json` file (no database, no ORM — pure `fs` module), and the
React frontend talks to it over a REST API.

---

## Folder structure

```
Warda_Assignment1/
├── expensetracker-backend/     ← Express + fs API
├── expensetracker-frontend/    ← React + Tailwind UI
└── README.md                   ← this file
```

---

## 1. Running the backend

```bash
cd expensetracker-backend
npm install
npm run dev        # starts with nodemon on http://localhost:3000
```

- `npm run dev` — starts the server with nodemon (auto-restart on save)
- `npm start` — starts the server normally with `node server.js`
- The server reads `PORT` from `.env` (defaults to `3000`)
- `data/expenses.json` is created automatically the first time you `POST`
  a new expense — you don't need to create it yourself

### API quick reference

| Method | Route                     | Description                                  |
|--------|----------------------------|-----------------------------------------------|
| GET    | `/api/health`              | Health check                                  |
| GET    | `/api/expenses`            | List expenses (supports filters below)        |
| GET    | `/api/expenses/stats`      | Spending summary                              |
| GET    | `/api/expenses/export`     | Download all expenses as CSV (bonus)          |
| GET    | `/api/expenses/:id`        | Get a single expense                          |
| POST   | `/api/expenses`            | Create an expense                             |
| PUT    | `/api/expenses/:id`        | Partially update an expense                   |
| DELETE | `/api/expenses/:id`        | Delete an expense                             |

Query filters on `GET /api/expenses` (combinable): `?category=`, `?search=`,
`?minAmount=`, `?maxAmount=`

---

## 2. Running the frontend

Open a **second terminal** (keep the backend running in the first one):

```bash
cd expensetracker-frontend
npm install
npm run dev         # starts on http://localhost:5173
```

Then open **http://localhost:5173** in your browser. The frontend is
pre-configured to call the backend at `http://localhost:3000`, and the
backend's CORS is pre-configured to allow `http://localhost:5173` — so
as long as both are running, everything talks to each other out of the box.

**Try the bonus features:**
- Click any expense's **title or amount** in the list to edit it inline (press Enter to save, Esc to cancel)
- Click the **🌙 Dark mode** button in the top-right to switch themes

---

## Design notes

The UI uses a clean, professional dashboard style — neutral light-gray
canvas, white cards with subtle borders and shadows, a single teal accent
colour for actions/highlights, and Manrope (headings) paired with Inter
(body/UI). The expense list is laid out as clearly labelled, aligned
columns (Description / Category / Date / Amount) rather than loose cards,
so it's easy to scan at a glance. Category badges are flat, solid-colour
pills (no rotation or decorative clutter). Full dark mode is supported via
the toggle in the top bar.

## Screenshot ExpenseTracker 

<img width="1542" height="3084" alt="screenshot png" src="https://github.com/user-attachments/assets/9bbdeb3c-f7ab-4257-9aeb-846a5f0590e8" />




