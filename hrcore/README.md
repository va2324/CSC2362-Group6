# HRCore — HR Management Platform

Internal HR portal: employees view profiles, submit leave, upload documents; admins manage payroll, roles, and personnel.

**Stack:** React Native (Expo) · Node.js/Express · PostgreSQL

## Repository layout

- **`vulnerable-version/`** — Part 1 build with intentional vulnerabilities for Part 2 (The Break).
- **`secure-version/`** — Part 3 fixes; use for Part 4 (The Proof).
- **`database/`** — PostgreSQL schema.
- **`security-report/`** — Part 4 evidence template (`report.md`).

## Database setup

1. Create a PostgreSQL database (e.g. `hrcore`). 
If needed, install from https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

2. Run the schema:
   ```bash
   psql -U postgres -d hrcore -f database/schema.sql
   ```
3. (Optional) Seed an admin user:
   ```sql
   INSERT INTO users (name, email, password, role, department, salary)
   VALUES ('Admin User', 'admin@hrcore.com', 'admin123', 'admin', 'HR', 100000);
   ```

## Vulnerable version (Part 1 & 2)

### Backend

Ensure you have NodeJS installed with ```node -v```. If not, install from https://nodejs.org/en/download.

```bash
cd vulnerable-version/backend
npm install
node server.js
```
Runs at `http://localhost:3000`. 

Set Database Info if needed: export DB_HOST=localhost DB_NAME=hrcore DB_USER=postgres DB_PASSWORD=postgres

You may hardcode DB info in db.js in vulnerable-version.

You must store DB info in .env file in secure-version

Follow .env.example to create your own .env file. Store JWT secret in .env in the secure-version.

### Frontend

```bash
cd vulnerable-version/frontend
npm install
npx expo start
```

Create an `assets` folder with `icon.png`, `splash.png`, and `adaptive-icon.png` if Expo complains (or copy from a new Expo app). 

Create a .env file and set `EXPO_PUBLIC_API_URL` to your backend URL when using a device (e.g. `http://192.168.1.x:3000`).

## Secure version (Part 3 & 4)

Apply remediations from the project outline (parameterized queries, bcrypt, JWT from env, role middleware, IDOR checks, role from JWT only, input sanitization). Then run the same flows and record “after” evidence in `security-report/report.md`.

## Vulnerabilities (Part 2)

| # | Vulnerability         | Location |
|---|-----------------------|----------|
| 1 | SQL Injection         | `/api/employees/search?name=` |
| 2 | Broken Access Control | `/api/admin/*` (no role check) |
| 3 | Insecure Passwords    | Plaintext/MD5 in DB |
| 4 | Hardcoded JWT Secret  | Backend source |
| 5 | IDOR                  | `GET /api/employees/:id` |
| 6 | Role Escalation       | Role in AsyncStorage/cookie |
| 7 | Hardcoded DB Info     | backend/db.js |
| 8 | No Security Headers   | server.js |
| 9 | Broken Search Route   | `GET /api/employees/search?=name` |
| 10 | No Rate Limit        | server.js |
| 11 | Path Traversal       | `POST /api/documents/` |

See `security-report/report.md` for PoC and before/after evidence.
