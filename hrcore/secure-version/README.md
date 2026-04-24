# Secure Version (Part 3)

Copy the backend and frontend from `vulnerable-version/` and apply the remediations from the project outline:

| Vulnerability   | Remediation |
|-----------------|-------------|
| SQL Injection   | Parameterized queries (pg `$1`, `$2`) in search |
| Broken Access   | Auth middleware on `/api/admin/*` verifying JWT role === `admin` |
| Passwords       | bcrypt with salt ≥ 10 |
| JWT secret      | From `.env`, never in code; `.env` in `.gitignore` |
| IDOR            | Check `req.user.id === params.id` or user is admin |
| Role escalation | Role only from server JWT payload; never trust client storage |
| Hardcoded DB Info  | Store DB info in .env |
| No Security Headers| Install helmet |
| Broken Search Route| Check that name input exists |
| No Rate Limit      | Install express-rate-limit |
| Path Traversal     | Validate filepath input |

Then re-run Part 2 PoC scripts and record "after" results in `../security-report/report.md`.
