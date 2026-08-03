# Hospital Management System

A full-stack hospital management system built with Spring Boot, MySQL, and vanilla JavaScript, featuring role-based authentication and seven independent CRUD modules.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Modules](#modules)
- [Roles & Permissions](#roles--permissions)
- [Getting Started](#getting-started)
- [Demo Accounts](#demo-accounts)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [Known Limitations & Future Improvements](#known-limitations--future-improvements)
- [Contributors](#contributors)

## Tech Stack

**Backend**
- Java 17
- Spring Boot 4.1.0 (Spring Web, Spring Data JPA)
- Spring Security (form login, BCrypt password hashing, role-based authorization)
- Hibernate (JPA implementation)

**Database**
- MySQL, with a shared relational schema enforcing foreign key integrity across modules

**Frontend**
- HTML, CSS, vanilla JavaScript (Fetch API)
- A shared design system (`/css/styles.css`) applied consistently across every module

**Build & Tooling**
- Maven
- IntelliJ IDEA
- Git / GitHub (branch-per-module workflow)

## Features

- Secure login with hashed passwords and session-based authentication
- Role-based dashboards — each user only sees the modules relevant to their role
- Server-side access control enforced on both pages and API endpoints (not just hidden UI)
- Doctors see only medical records for their own patients, resolved via a link between their login account and their staff record
- Admin panel to create and delete user accounts, with safeguards against self-deletion
- Consistent, unified interface across all modules

## Modules

Each module below has full Create, Read, Update, and Delete functionality.

| Module | Description | Base Endpoint |
|---|---|---|
| Staff | Manage doctors, nurses, and support staff | `/staff` |
| Patients | Patient registration and demographics | `/api/patients` |
| Appointments | Scheduling between patients and doctors | `/api/appointments` |
| Medical Records (EHR) | Diagnoses and treatment plans | `/api/medical-records` |
| Wards & Room Allocation | Ward capacity and bed assignment | `/api/wards`, `/api/allocations` |
| Pharmacy Inventory | Medicine stock, batches, expiration dates | `/api/inventory` |
| Billing | Patient invoices and payment status | `/api/bills` |

## Roles & Permissions

| Role | Access |
|---|---|
| **Admin** | Full access to every module, plus user account management |
| **Doctor** | Appointments, Patients, and their own Medical Records only |
| **Nurse** | Patients, Wards & Room Allocation, Pharmacy Inventory |
| **Receptionist** | Patients, Appointments, Billing |

Access control is enforced at the Spring Security level (`SecurityConfig.java`) — a role attempting to access a page or API endpoint outside its permissions receives a 403/redirect, regardless of how the request is made.

## Getting Started

### Prerequisites
- Java 17 (JDK)
- MySQL (running locally, or update the connection URL for a remote instance)
- Maven (bundled with the project via the Maven Wrapper — no separate install required)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Hospital-Management-System
   ```

2. **Create your local configuration**

   Copy the template and fill in your own database credentials (this file is git-ignored and never committed):
   ```bash
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   ```
   Edit `application.properties` with your MySQL username/password.

3. **First-time database seed**

   On first run only, set:
   ```properties
   spring.sql.init.mode=always
   ```
   Run the application once — this creates the schema and seeds demo data (see [Demo Accounts](#demo-accounts) below).

   **Immediately after that first successful run**, change it back to:
   ```properties
   spring.sql.init.mode=never
   ```
   and restart. This prevents the seed data from re-running on every startup, which would otherwise cause auto-increment ID drift.

   Leave `spring.jpa.hibernate.ddl-auto=none` as-is at all times — this stops Hibernate from silently altering the schema.

4. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```
   or run `HospitalManagementSystemApplication` directly from IntelliJ.

5. **Open the app**

   Navigate to `http://localhost:8080` — this serves the public landing page, which links to the login page.

## Demo Accounts

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | Admin |
| `dr.smith` | `doctor123` | Doctor |
| `nurse.joy` | `nurse123` | Nurse |
| `frontdesk` | `reception123` | Receptionist |

> Change these before any real deployment. They exist for local development and demonstration only.

## Project Structure

```
src/main/java/com/hospital/sys/
├── auth/            # Authentication, User entity, Spring Security config
├── staff/            # Staff module
├── patient/           # Patient module
├── appointment/        # Appointment module
├── ehr/             # Medical records module
├── ward/            # Ward & room allocation module
├── inventory/         # Pharmacy inventory module
├── billing/           # Billing module
└── HospitalManagementSystemApplication.java

src/main/resources/
├── static/
│   ├── index.html      # Public landing page
│   ├── login.html      # Login page
│   ├── css/           # Shared and per-page stylesheets
│   └── pages/          # Module pages (dashboard, staff, ehr, etc.)
├── application.properties.example
├── schema.sql
└── data.sql
```

## API Overview

All endpoints (except `/`, `/index.html`, `/login.html`, and static assets) require authentication. Most also enforce role restrictions — see `SecurityConfig.java` for the full mapping.

**Authentication**
- `POST /perform-login` — log in
- `POST /logout` — log out
- `GET /api/auth/me` — current logged-in user's username, role, and linked staff ID
- `GET /api/auth/users` — list all accounts *(Admin only)*
- `POST /api/auth/register` — create a new account *(Admin only)*
- `DELETE /api/auth/users/{id}` — delete an account *(Admin only)*

**Each module** follows a standard REST pattern:
- `GET /{resource}` — list all
- `GET /{resource}/{id}` — get one
- `POST /{resource}` — create
- `PUT /{resource}/{id}` — update
- `DELETE /{resource}/{id}` — delete

The Medical Records module additionally scopes `GET /api/medical-records` to the logged-in doctor's own records (unless the caller is Admin).

## Known Limitations & Future Improvements

- Stricter server-side input validation (`@NotNull`, `@Email`, etc.) has not been added to every module
- No database migration tool (e.g. Flyway/Liquibase) — schema changes are managed manually via `schema.sql`
- Ward occupancy counts are not automatically updated on patient admission/discharge
- No referential validation preventing an appointment or record from referencing a non-existent patient/doctor ID beyond the database's own foreign key constraints
- CSRF protection is disabled for development simplicity
- No automated test suite
- No pagination on endpoints returning large lists

## Contributors

| Name | Contribution |
|---|---|
| *(K.G. Thanthilage)* | Authentication & role-based access control system, EHR module, unified frontend design system, database configuration and integrity fixes, cross-team code review and Git integration |
| *(Vithanage H.I.)* | Staff module |
| *(M.L.Y.A. Jayakody)* | Billing module |
| *(W.K.T. Nilmini)* | Ward & Room Allocation module |
| *(T.H.S. Hansanie)* | Appointment module |
| *(J.M.B.P.K. Jayasundara)* | Patient module |
| *(Pramudi U. Perera)* | Pharmacy Inventory module |

---

*Mini project — Spring Boot & MySQL, submitted for [IT 3003- Advanced Programming Techniques].*
