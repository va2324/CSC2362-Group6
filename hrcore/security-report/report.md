# HRCore Security Report — Part 4: The Proof

## Overview
This document records before/after evidence for each vulnerability, impacts and fixes, exploit success on `vulnerable-version` and failure on `secure-version`.

---

## 1. SQL Injection (A03 Injection)

**Where:** `GET /api/employees/search?name=`

**Impact:** An attacker can input an SQL query that returns all employee data via the search endpoint.

**Before (vulnerable):** [Screenshot/recording — exploit succeeds]

![Screenshot](screenshots/SQLInjection.png "SQL Injection")

**Fix:** Validate and parametrize the name input. 

![Screenshot](screenshots/FixedSQL1.png "SQL Input Validation")

**After (secure):** [Screenshot/recording — same payload returns safe results / error]

![Screenshot](screenshots/FixedSQL2.png "No Results Returned")

![Screenshot](screenshots/FixedSQL3.png "Error 400 - Bad Request")

---

## 2. Broken Access Control (A01)

**Where:** `/api/admin/*` — no role middleware.

**Impact:** Without effective access control, any user with an 'employee' role can access the admin routes.

**Before (vulnerable):** [Screenshot — 200 OK, full employee list returned]

![Screenshot](screenshots/BrokenAccessControl1.png "Employee Token")

![Screenshot](screenshots/BrokenAccessControl2.png "Admin Access Granted")

**Fix:** Implement role checks to ensure user had 'admin' role before granting access to admin routes.

![Screenshot](screenshots/FixedAccessControlPic.png "Implemented Admin Middleware")

**After (secure):** [Screenshot — 403 Forbidden]

![Screenshot](screenshots/FixedAccessControl1.png "Employee Token")

![Screenshot](screenshots/FixedAccessControl2.png "Admin Access Denied")

---

## 3. Insecure Password Storage (A02)

**Where:** Plaintext or MD5 passwords in DB.

**Impact:** If an attacker can access the database, they will be able to steal and use all employees' unencrypted passwords.

**Before (vulnerable):** [Screenshot of `users.password` column]

![Screenshot](screenshots/Passwords.png "Unencrypted Passwords")

**Fix**: Install and implement bcrypt to generate and store hashes of passwords in the database. 

![Screenshot](screenshots/FixedHash1.png "Register Using bcrypt")

![Screenshot](screenshots/FixedHash2.png "Login Using bcrypt")

**After (secure):** [Screenshot — bcrypt hashes only]

![Screenshot](screenshots/FixedHash3.png "Encrypted Passwords")

---

## 4. Hardcoded JWT Secret (A02)

**Where:** `JWT_SECRET = "password123"` in backend/routes/auth.js.

**Impact:** Anyone with access to the codebase will be able to forge a token with the known secret to gain 'admin' role.

**Before (vulnerable):** [Screenshot — forged token accepted, admin access]

![Screenshot](screenshots/JWT1.png "Harcoded JWT Secret")

![Screenshot](screenshots/JWT2.png "Forging New Token")

![Screenshot](screenshots/JWT3.png "Gaining Admin Privileges")

**Fix:** Store the JWT secret in .env file.

![Screenshot](screenshots/FixedJWT1.png "JWT Secret in .env")

**After (secure):** [Screenshot — secret from env, JWT secret inaccessible]

![Screenshot](screenshots/FixedJWT2.png "JWT Secret not hardcoded")
---

## 5. IDOR (A01)

**Where:** `GET /api/employees/:id` — any user can fetch any ID.

**Impact:** Without checks on user ID, any user will be able to access any other user's profile information.

**Before (vulnerable):** [Screenshot — all profiles returned]

![Screenshot](screenshots/IDOR1.png "Script")

![Screenshot](screenshots/IDOR2.png "Script Continued")

![Screenshot](screenshots/IDOR3.png "Employee Profiles")

**Fix:** Check for 'admin' role or ensure user ID matches the ID being sought.

![Screenshot](screenshots/FixedIDORPic1.png "Fixed GET route")

![Screenshot](screenshots/FixedIDORPic2.png "Fixed PUT route")

**After (secure):** [Screenshot — 403 for IDs other than own / admin]

![Screenshot](screenshots/FixedIDOR1.png "Script")

![Screenshot](screenshots/FixedIDOR2.png "Script Continued")

![Screenshot](screenshots/FixedIDOR3.png "Denied Access to Other Profiles")

---

## 6. Client-Side Role Escalation (A01)

**Where:** Role stored in AsyncStorage/cookie; user can edit to `admin`.

**Impact:** Any user can access and modify their role in AsyncStorage to `admin`, reload, and then access the admin panel.

**Before (vulnerable):** [Screenshot — admin panel visible and functional]

![Screenshot](screenshots/EscalateRole1.png "Employee Dashboard")

![Screenshot](screenshots/EscalateRole2.png "Employee Role in Storage")

![Screenshot](screenshots/EscalateRole3.png "Role Escalation to Admin")

![Screenshot](screenshots/EscalateRole4.png "Admin Dashboard")

**Fix:** Remove the role from the cookie and place it in the JWT token for secure storage.

![Screenshot](screenshots/FixedEscalationPic.png "Moved Role from Cookie to JWT token")

**After (secure):** [Screenshot — role from JWT only; editing storage has no effect, 403 on admin API]

![Screenshot](screenshots/FixedEscalation1.png "Employee Dashboard")

![Screenshot](screenshots/FixedEscalation2.png "Employee Role in Storage")

![Screenshot](screenshots/FixedEscalation3.png "Role Escalation to Admin")

![Screenshot](screenshots/FixedEscalation4.png "Nothing Happens")

---

## 7. Hardcoded Database Password

**Where:** Password hardcoded in backend/db.js file.

**Impact:** An attacker can access the database with hardcoded password and steal/destroy data.

**Before (vulnerable):** [Screenshot — hardcoded database password]

![Screenshot](screenshots/DBPassword1.png "Hardcoded Database Info")

![Screenshot](screenshots/DBPassword2.png "Successful Database Login")

**Fix:** Store the database information securely in .env file.

![Screenshot](screenshots/FixedDBInfo1.png "Database Info in .env file")

**After (secure):** [Screenshot — database info hidden in .env]

![Screenshot](screenshots/FixedDBInfo2.png "Environment Variable Check")

---

## 8. Missing Security Headers

**Where:** server.js does not establish any security headers for the application.

**Impact:** Without security headers, application is vulnerable to unauthorized access and data exposure.

**Before (vulnerable):** [Screenshot — No security headers at all]

![Screenshot](screenshots/Headers1.png "No Security Headers")

**Fix:** Install and implement helmet to establish security headers for the application.

![Screenshot](screenshots/FixedHeaders1.png "Installed & Implemented helmet")

**After (secure):** [Screenshot — Security headers established with helmet]

![Screenshot](screenshots/FixedHeaders2.png "Security Headers from helmet")

---

## 9. Incomplete Search Route

**Where:** `GET /api/employees/search?name=`

**Impact:** Incomplete search route with no name input causes the application to default to exposing all employee data.

**Before (vulnerable):** [Screenshot — No check on name input]

![Screenshot](screenshots/SearchRoute1.png "Regular Search Works")

![Screenshot](screenshots/SearchRoute2.png "Incomplete Search Route Exposes All Data")

**Fix:** Check that the name input actually exists before querying the database.

![Screenshot](screenshots/FixedRoute1.png "Checks for Name Input")

**After (secure):** [Screenshot — Checks that name input exists and gives 400 error if not]

![Screenshot](screenshots/FixedRoute2.png "Incomplete Search Route - 400 Error")

---

## 10. No Rate Limit

**Where:** `POST /api/auth/login`

**Impact:** No rate limit on login attempts makes the login route vulnerable to brute-force attacks. 

**Before (vulnerable):** [Screenshot — No rate limit on login]

![Screenshot](screenshots/RateLimitScript.png "Brute Force Script")

![Screenshot](screenshots/NoRateLimit.png "Unlimited Login Attempts")

**Fix**: Install and implement express-rate-limit to limit login attempts and prevent brute-force attacks.

![Screenshot](screenshots/FixedRateLimitPic.png "Installed & Implemented express-rate-limit")

**After (secure):** [Screenshot — Rate Limit on Login - 429 Too Many Requests]

![Screenshot](screenshots/RateLimitScript.png "Brute Force Script")

![Screenshot](screenshots/FixedRateLimit.png "Rate Limit on Login Attempts")

---

## 11. Path Traversal

**Where:** `POST /api/documents`

**Impact:** No path validation allows attackers to input filepaths that could traverse directories and access privileged files. 

**Before (vulnerable):** [Screenshot — No filepath validation]

![Screenshot](screenshots/BadPath.png "Invalid Path Input")

![Screenshot](screenshots/PathAccepted.png "Invalid Path Accepted")

**Fix**: Validate the filepath input to ensure it is not a malicious filepath.

![Screenshot](screenshots/PathTraversalFix.png "Input Validation for Filepath")

**After (secure):** [Screenshot — Filepath Validation - 400 Bad Request]

![Screenshot](screenshots/BadPath.png "Invalid Path Input")

![Screenshot](screenshots/PathRejected.png "Invalid Path Rejected")

---

## Regression Testing (secure version)

| Test | Result |
|------|--------|
| Login works for real users | ✅ |
| Employee can view own profile | ✅ |
| Admin can access admin panel via legitimate login | ✅ |
| Leave submission still works | ✅ |
| Search returns correct results (safely) | ✅ |

---

*Fill in screenshots/recordings and check regression boxes when completing Part 4.*
