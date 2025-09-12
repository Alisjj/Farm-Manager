Of course. Here is the redesigned Technical Design Document in Markdown format.

---

# **Technical Design Document: Egg Production Management System**

**Version:** 2.0
**Date:** September 10, 2025
**Status:** DRAFT

## **1. Introduction**

### **1.1 Project Purpose**

To develop a streamlined, mobile-first management system for a small-scale egg farm. The system's primary goal is to provide the farm owner with **real-time data** on production, sales, and operational costs, enabling data-driven decisions to **maximize profitability**.

### **1.2 Scope**

#### **In Scope**

- **Core Operations:** Daily logging of egg collection, feed consumption, and flock health.
- **Financial Tracking:** Sales, customer management, and payment tracking.
- **Cost Management:** Calculation of feed batch costs, labor payroll, and other operational expenses.
- **Analytics & Reporting:** An owner-facing dashboard with key performance indicators (KPIs), real-time cost-per-egg calculation, and pricing recommendations.

#### **Out of Scope**

- Advanced inventory management for non-feed supplies.
- Integration with third-party accounting software.
- A customer-facing ordering portal.
- IoT sensor integration for environmental monitoring.

### **1.3 Key Stakeholders**

| Role           | Description                       | Key Needs                                                                        |
| :------------- | :-------------------------------- | :------------------------------------------------------------------------------- |
| **Farm Owner** | The primary decision-maker.       | Access to a high-level dashboard, financial reports, and profitability analysis. |
| **Farm Staff** | Responsible for daily data entry. | A simple, fast, and mobile-friendly interface for logging daily activities.      |

---

## **2. System Requirements**

### **2.1 Functional Requirements**

The following requirements define what the system must _do_.

| ID           | Module             | Requirement                                                                                                       | Priority        |
| :----------- | :----------------- | :---------------------------------------------------------------------------------------------------------------- | :-------------- |
| **USER-01**  | User Management    | The system shall support 'Owner' and 'Staff' roles with distinct permissions.                                     | **Must-Have**   |
| **USER-02**  | User Management    | Users shall authenticate using a username and password.                                                           | **Must-Have**   |
| **PROD-01**  | Production Logging | Staff shall log daily egg collection totals, broken down by grade (A, B, C).                                      | **Must-Have**   |
| **PROD-02**  | Production Logging | Staff shall record daily feed consumption and flock mortality per house.                                          | **Must-Have**   |
| **PROD-03**  | Production Logging | All log entries must be timestamped and attributed to the user who created them.                                  | **Must-Have**   |
| **SALES-01** | Sales              | The system shall maintain a database of customers and their contact information.                                  | **Should-Have** |
| **SALES-02** | Sales              | Staff shall record sales transactions, specifying egg quantities, prices, and payment status.                     | **Must-Have**   |
| **FEED-01**  | Feed Management    | The system shall allow for creating feed batches with custom ingredients, quantities, and costs.                  | **Must-Have**   |
| **FEED-02**  | Feed Management    | The system shall automatically calculate the total cost, cost per kg, and cost per bag for each feed batch.       | **Must-Have**   |
| **LABOR-01** | Labor              | The system shall maintain a database of farm laborers and their salary information.                               | **Should-Have** |
| **LABOR-02** | Labor              | The system shall automatically calculate monthly payroll based on recorded attendance.                            | **Should-Have** |
| **COST-01**  | Costing Engine     | The system shall calculate the real-time cost per egg, factoring in feed, labor, and fixed costs.                 | **Must-Have**   |
| **COST-02**  | Costing Engine     | The system shall provide suggested selling prices based on the calculated cost plus a configurable profit margin. | **Must-Have**   |
| **RPT-01**   | Reporting          | The owner shall have access to a dashboard visualizing production trends and key financial metrics.               | **Must-Have**   |
| **RPT-02**   | Reporting          | The system shall allow data export to PDF or Excel formats.                                                       | **Could-Have**  |

### **2.2 Non-Functional Requirements**

The following requirements define the _quality_ and _constraints_ of the system.

| ID          | Category    | Requirement                                                                                           |
| :---------- | :---------- | :---------------------------------------------------------------------------------------------------- |
| **PERF-01** | Performance | All pages shall load in under 3 seconds on a stable 3G connection.                                    |
| **PERF-02** | Performance | The system must support at least 10 users concurrently without performance degradation.               |
| **USE-01**  | Usability   | The interface must be mobile-responsive and optimized for touch input.                                |
| **USE-02**  | Usability   | A new staff user must be able to log a daily entry in under 90 seconds after a 10-minute orientation. |
| **REL-01**  | Reliability | The system shall have a minimum uptime of 99.5%.                                                      |
| **REL-02**  | Reliability | Automated database backups must occur daily.                                                          |
| **SEC-01**  | Security    | All user passwords must be hashed and salted before storage.                                          |
| **SEC-02**  | Security    | The system shall enforce role-based access control (RBAC) on all API endpoints.                       |

---

## **3. System Architecture**

### **3.1 Architectural Model**

The system will use a **three-tier architecture**, separating the user interface (presentation), business logic (application), and data storage. A **Progressive Web App (PWA)** will serve both mobile staff and the desktop-based owner, communicating with the backend via a **RESTful API**.

### **3.2 Technology Stack**

| Component      | Technology                   | Rationale                                                                                                                                                 |
| :------------- | :--------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend**    | **Node.js (Express)**        | Efficient for I/O-bound applications, with a vast ecosystem (npm) for rapid development.                                                                  |
| **Frontend**   | **React.js**                 | A component-based framework ideal for building dynamic, responsive user interfaces. The PWA approach avoids the need for separate native app development. |
| **Database**   | **PostgreSQL**               | A powerful and reliable open-source relational database known for its data integrity and scalability.                                                     |
| **Deployment** | **VPS (e.g., DigitalOcean)** | Provides a cost-effective and scalable hosting solution with full control over the environment.                                                           |

---

## **4. Database Design**

### **4.1 Entity Relationship Diagram (ERD)**

The database schema is designed to be normalized, reducing data redundancy and ensuring integrity. Core entities include `users`, `daily_logs`, `sales`, `feed_batches`, and `laborers`.

### **4.2 Core Schema Snippet (`daily_logs`)**

This table is central to the application, capturing the daily pulse of the farm's production.

```sql
-- Daily production logs
CREATE TABLE daily_logs (
    id SERIAL PRIMARY KEY,
    log_date DATE NOT NULL,
    house_id INTEGER NOT NULL REFERENCES houses(id),
    eggs_total INTEGER NOT NULL DEFAULT 0,
    eggs_grade_a INTEGER NOT NULL DEFAULT 0,
    eggs_grade_b INTEGER NOT NULL DEFAULT 0,
    eggs_grade_c INTEGER NOT NULL DEFAULT 0,
    feed_given_kg DECIMAL(8, 2) NOT NULL DEFAULT 0,
    mortality_count INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    staff_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Ensures only one log per house per day
    UNIQUE(log_date, house_id),

    -- Ensures egg counts are consistent
    CONSTRAINT chk_egg_counts CHECK (eggs_total = eggs_grade_a + eggs_grade_b + eggs_grade_c)
);
```

---

## **5. API Design**

The API will follow **RESTful principles**, using standard HTTP verbs and status codes. All endpoints will be secured and require a valid JSON Web Token (JWT).

| Verb   | Endpoint                 | Description                                          |
| :----- | :----------------------- | :--------------------------------------------------- |
| `GET`  | `/api/daily-logs`        | Fetches daily logs, filterable by date range.        |
| `POST` | `/api/daily-logs`        | Creates a new daily log entry.                       |
| `GET`  | `/api/reports/dashboard` | Retrieves aggregated data for the owner's dashboard. |
| `POST` | `/api/feed/batches`      | Creates a new feed batch and calculates its cost.    |
| `POST` | `/api/auth/login`        | Authenticates a user and returns a JWT.              |

---

## **6. User Interface (UI) Wireframes**

### **6.1 Staff: Daily Logging Screen (Mobile)**

This screen is designed for speed and simplicity, prioritizing the most frequent tasks.

**Design Notes:**

- **Smart Defaults:** The date defaults to today. The house selection defaults to the user's most frequently used house.
- **Clear Calls to Action:** A large, prominent "Save Entry" button is always visible.
- **Immediate Feedback:** A success message ("Log for House 1 saved\!") appears upon submission.

### **6.2 Owner: Main Dashboard (Web)**

This dashboard provides an at-a-glance view of the farm's health and profitability.

**Design Notes:**

- **Visual Hierarchy:** The most important KPIs (Cost per Egg, Daily Profit) are displayed most prominently.
- **Data Visualization:** Charts are used to show trends over time, making patterns easy to spot.
- **Actionable Insights:** "Quick Actions" provide direct links to detailed reports.

---

## **7. Development & Deployment Plan**

### **7.1 Development Phases**

The project will be delivered in three distinct phases:

1.  **Phase 1: Core MVP (4 weeks):** Focus on user authentication, daily logging, and the basic owner dashboard.
2.  **Phase 2: Financials (3 weeks):** Build out sales management, customer tracking, and the feed cost calculator.
3.  **Phase 3: Optimization & Labor (3 weeks):** Implement the complete cost-per-egg engine, labor management, and reporting features.

### **7.2 Deployment Strategy**

- **Environment:** A three-environment setup (Development, Staging, Production) will be used.
- **CI/CD:** A continuous integration/continuous deployment pipeline will be established to automate testing and deployments.
- **Backups:** The production database will be backed up automatically every 24 hours, with backups retained for 14 days.

---

## **8. Risk Assessment**

| Risk                      | Likelihood | Impact | Mitigation Strategy                                                                                                                 |
| :------------------------ | :--------- | :----- | :---------------------------------------------------------------------------------------------------------------------------------- |
| **Low User Adoption**     | Medium     | High   | Involve farm staff in usability testing during development. Provide simple, clear training materials.                               |
| **Inaccurate Data Entry** | High       | Medium | Implement strict server-side validation. Use intuitive UI controls (e.g., steppers instead of free-text fields) to minimize errors. |
| **System Downtime**       | Low        | High   | Use a reliable cloud hosting provider. Implement uptime monitoring with automated alerts.                                           |
| **Scope Creep**           | Medium     | Medium | Adhere strictly to the defined scope. All new feature requests must go through a formal change request process.                     |

---

## **9. Revision History & Implementation Notes**

This section serves as a living changelog for the project.

### **9.1 Summary of Initial Rebuild (August 22, 2025)**

- The legacy codebase was archived into the `legacy/` directory.
- The repository was converted to a `pnpm` workspace to manage shared code.
- A new database schema was designed using Drizzle ORM and migrated (`migrations/0001_design_schema.sql`). Key changes include normalizing the `ingredients` and `daily_logs` tables.
- Initial backend scaffolding was created, connecting the Express server to the new PostgreSQL database schema.
- **Next Steps:** Complete the migration of all server routes to the new schema, implement API endpoints as defined in this document, and begin development of the frontend PWA.
