# HRCore Security Report — Part 4: The Proof

## Overview
This document records before/after evidence for each of the 7 intentional vulnerabilities: exploit success on `vulnerable-version` and failure on `secure-version`.

---

## 1. SQL Injection (A03 Injection)

**Where:** `GET /api/employees/search?name=`

**PoC (vulnerable):** Script that dumps all salaries via search endpoint.

**Before (vulnerable):** [Screenshot/recording — exploit succeeds]

![Screenshot](screenshots/SQLInjection.png "SQL Injection")

**After (secure):** [Screenshot/recording — same payload returns safe results / error]

![Screenshot](screenshots/FixedSQL1.png "SQL Input Validation")

![Screenshot](screenshots/FixedSQL2.png "No Results Returned")

![Screenshot](screenshots/FixedSQL3.png "Error 400 - Bad Request")

---

## 2. Broken Access Control (A01)

**Where:** `/api/admin/*` — no role middleware.

**PoC (vulnerable):** `curl` hitting `/api/admin/all-employees` with a regular user token.

**Before (vulnerable):** [Screenshot — 200 OK, full employee list returned]

![Screenshot](screenshots/BrokenAccessControl1.png "Employee Token")

![Screenshot](screenshots/BrokenAccessControl2.png "Admin Access Granted")

**After (secure):** [Screenshot — 403 Forbidden]

![Screenshot](screenshots/FixedAccessControlPic.png "Implemented Admin Middleware")

![Screenshot](screenshots/FixedAccessControl1.png "Employee Token")

![Screenshot](screenshots/FixedAccessControl2.png "Admin Access Denied")

---

## 3. Insecure Password Storage (A02)

**Where:** Plaintext or MD5 passwords in DB.

**PoC (vulnerable):** Screenshot of DB showing plaintext or weak hash.

**Before (vulnerable):** [Screenshot of `users.password` column]

![Screenshot](screenshots/Passwords.png "Unencrypted Passwords")

**After (secure):** [Screenshot — bcrypt hashes only]

![Screenshot](screenshots/FixedHash1.png "Register Using bcrypt")

![Screenshot](screenshots/FixedHash2.png "Login Using bcrypt")

![Screenshot](screenshots/FixedHash3.png "Encrypted Passwords")

---

## 4. Hardcoded JWT Secret (A02)

**Where:** `JWT_SECRET = "password123"` in source.

**PoC (vulnerable):** Forge a token with the known secret to become admin.

**Before (vulnerable):** [Screenshot — forged token accepted, admin access]

![Screenshot](screenshots/JWT1.png "Harcoded JWT Secret")

![Screenshot](screenshots/JWT2.png "Forging New Token")

![Screenshot](screenshots/JWT3.png "Gaining Admin Privileges")

**After (secure):** [Screenshot — secret from env, forged token rejected]

![Screenshot](screenshots/FixedJWT1.png "JWT Secret in .env")

![Screenshot](screenshots/FixedJWT2.png "JWT Secret not hardcoded")
---

## 5. IDOR (A01)

**Where:** `GET /api/employees/:id` — any user can fetch any ID.

**PoC (vulnerable):** Script that iterates `/api/employees/1` … `/api/employees/100`.

**Before (vulnerable):** [Screenshot — all profiles returned]

![Screenshot](screenshots/IDOR1.png "Script")

![Screenshot](screenshots/IDOR2.png "Script Continued")

![Screenshot](screenshots/IDOR3.png "Employee Profiles")

**After (secure):** [Screenshot — 403 for IDs other than own / admin]

![Screenshot](screenshots/FixedIDORPic1.png "Fixed GET route")

![Screenshot](screenshots/FixedIDORPic2.png "Fixed PUT route")

![Screenshot](screenshots/FixedIDOR1.png "Script")

![Screenshot](screenshots/FixedIDOR2.png "Script Continued")

![Screenshot](screenshots/FixedIDOR3.png "Denied Access to Other Profiles")

---

## 6. Client-Side Role Escalation (A01)

**Where:** Role stored in AsyncStorage/cookie; user can edit to `admin`.

**PoC (vulnerable):** Modify AsyncStorage `role` to `admin`, reload, access admin screen.

**Before (vulnerable):** [Screenshot — admin panel visible and functional]

![Screenshot](screenshots/EscalateRole1.png "Employee Dashboard")

![Screenshot](screenshots/EscalateRole2.png "Employee Role in Storage")

![Screenshot](screenshots/EscalateRole3.png "Role Escalation to Admin")

![Screenshot](screenshots/EscalateRole4.png "Admin Dashboard")

**After (secure):** [Screenshot — role from JWT only; editing storage has no effect, 403 on admin API]

![Screenshot](screenshots/FixedEscalationPic.png "Moved Role from Cookie to JWT token")

![Screenshot](screenshots/FixedEscalation1.png "Employee Dashboard")

![Screenshot](screenshots/FixedEscalation2.png "Employee Role in Storage")

![Screenshot](screenshots/FixedEscalation3.png "Role Escalation to Admin")

![Screenshot](screenshots/FixedEscalation4.png "Nothing Happens")

---

## 7. Hardcoded Database Password

**Where:** Password hardcoded in backend/db.js file.

**PoC (vulnerable):** Attacker can access the database with hardcoded password and steal/destroy data.

**Before (vulnerable):** [Screenshot — hardcoded database password]

![Screenshot](screenshots/DBPassword1.png "Hardcoded Database Info")

![Screenshot](screenshots/DBPassword2.png "Successful Database Login")


**After (secure):** [Screenshot — database info stored safely in .env]

![Screenshot](screenshots/FixedDBInfo1.png "Database Info in .env file")

![Screenshot](screenshots/FixedDBInfo2.png "Environment Variable Check")

---

## 8. Missing Security Headers

**Where:** server.js does not establish any security headers for the application.

**PoC (vulnerable):** Without security headers, application is vulnerable to unauthorized access and data exposure.

**Before (vulnerable):** [Screenshot — No security headers at all]

![Screenshot](screenshots/Headers1.png "No Security Headers")

**After (secure):** [Screenshot — Security headers established with helmet]

![Screenshot](screenshots/FixedHeaders1.png "Installed & Implemented helmet")

![Screenshot](screenshots/FixedHeaders2.png "Security Headers from helmet")

---

## 9. Incomplete Search Route

**Where:** `GET /api/employees/search?name=`

**PoC (vulnerable):** Incomplete search route exposes all employee data.

**Before (vulnerable):** [Screenshot — No check on name input]

![Screenshot](screenshots/SearchRoute1.png "Regular Search Works")

![Screenshot](screenshots/SearchRoute2.png "Incomplete Search Route Exposes All Data")

**After (secure):** [Screenshot — Checks that name input exists and gives 400 error if not]

![Screenshot](screenshots/FixedRoute1.png "Checks for Name Input")

![Screenshot](screenshots/FixedRoute2.png "Incomplete Search Route - 400 Error")

---

## 10. No Rate Limit

**Where:** `POST /api/auth/login`

**PoC (vulnerable):** No rate limit on login attempts makes the login route vulnerable to brute-force attacks. 

**Before (vulnerable):** [Screenshot — No rate limit on login]

![Screenshot](screenshots/RateLimitScript.png "Brute Force Script")

![Screenshot](screenshots/NoRateLimit.png "Unlimited Login Attempts")

**After (secure):** [Screenshot — Rate Limit on Login - 429 Too Many Requests]

![Screenshot](screenshots/FixedRateLimitPic.png "Installed & Implemented express-rate-limit")

![Screenshot](screenshots/RateLimitScript.png "Brute Force Script")

![Screenshot](screenshots/FixedRateLimit.png "Rate Limit on Login Attempts")

---

## 11. Path Traversal

**Where:** `POST /api/documents`

**PoC (vulnerable):** No path validation allows attackers to input filepaths that could traverse directories and access privileged files. 

**Before (vulnerable):** [Screenshot — No filepath validation]

![Screenshot](screenshots/BadPath.png "Invalid Path Input")

![Screenshot](screenshots/PathAccepted.png "Invalid Path Accepted")

**After (secure):** [Screenshot — Filepath Validation - 400 Bad Request]

![Screenshot](screenshots/PathTraversalFix.png "Input Validation for Filepath")

![Screenshot](screenshots/BadPath.png "Invalid Path Input")

![Screenshot](screenshots/PathRejected.png "Invalid Path Rejected")

---

## Regression Testing (secure version)

| Test | Result |
|------|--------|
| Login works for real users | ☐ |
| Employee can view own profile | ☐ |
| Admin can access admin panel via legitimate login | ☐ |
| Leave submission still works | ☐ |
| Search returns correct results (safely) | ☐ |

---

*Fill in screenshots/recordings and check regression boxes when completing Part 4.*
