# Egg Farm Management System - File Architecture

## Project Structure Overview

```
egg-farm-management/
├── backend/                    # Node.js/Express API
├── frontend/                   # React.js Web App
├── shared/                     # Shared types/constants
├── database/                   # Database scripts
├── docs/                       # Documentation
├── docker-compose.yml          # Development setup
└── README.md
```

---

## Backend Architecture (`/backend`)

```
backend/
├── src/
│   ├── controllers/           # Route handlers
│   │   ├── authController.js
│   │   ├── dailyLogController.js
│   │   ├── salesController.js
│   │   ├── feedController.js
│   │   ├── laborController.js
│   │   ├── costController.js
│   │   └── reportController.js
│   │
│   ├── middleware/             # Express middleware
│   │   ├── auth.js            # JWT authentication
│   │   ├── validation.js      # Input validation
│   │   ├── errorHandler.js    # Error handling
│   │   └── logger.js          # Request logging
│   │
│   ├── models/                # Database models (if using ORM)
│   │   ├── User.js
│   │   ├── DailyLog.js
│   │   ├── Sales.js
│   │   ├── FeedBatch.js
│   │   ├── Laborer.js
│   │   └── index.js           # Model exports
│   │
│   ├── routes/                # API routes
│   │   ├── auth.js
│   │   ├── dailyLogs.js
│   │   ├── sales.js
│   │   ├── feed.js
│   │   ├── labor.js
│   │   ├── costs.js
│   │   ├── reports.js
│   │   └── index.js           # Route aggregation
│   │
│   ├── services/              # Business logic
│   │   ├── authService.js
│   │   ├── dailyLogService.js
│   │   ├── salesService.js
│   │   ├── feedService.js
│   │   ├── laborService.js
│   │   ├── costCalculationService.js
│   │   ├── reportService.js
│   │   └── emailService.js    # Future: notifications
│   │
│   ├── utils/                 # Helper functions
│   │   ├── database.js        # DB connection
│   │   ├── validation.js      # Custom validators
│   │   ├── dateHelpers.js     # Date utilities
│   │   ├── costCalculators.js # Cost calculation helpers
│   │   └── constants.js       # App constants
│   │
│   ├── config/               # Configuration
│   │   ├── database.js       # DB config
│   │   ├── auth.js          # JWT config
│   │   └── index.js         # Config exports
│   │
│   └── app.js               # Express app setup
│
├── tests/                   # Test files
│   ├── unit/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── utils/
│   ├── integration/
│   │   ├── api/
│   │   └── database/
│   └── fixtures/            # Test data
│
├── package.json
├── .env.example
├── .gitignore
├── server.js               # Entry point
└── Dockerfile
```

---

## Frontend Architecture (`/frontend`)

```
frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
│
├── src/
│   ├── components/           # Reusable components
│   │   ├── common/          # Generic components
│   │   │   ├── Header.js
│   │   │   ├── Sidebar.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── ErrorBoundary.js
│   │   │   └── ConfirmDialog.js
│   │   │
│   │   ├── forms/           # Form components
│   │   │   ├── DailyEntryForm.js
│   │   │   ├── SalesForm.js
│   │   │   ├── FeedBatchForm.js
│   │   │   ├── LaborerForm.js
│   │   │   └── FormField.js
│   │   │
│   │   └── charts/          # Chart components
│   │       ├── ProductionChart.js
│   │       ├── CostChart.js
│   │       └── SalesChart.js
│   │
│   ├── pages/               # Page components
│   │   ├── auth/
│   │   │   ├── LoginPage.js
│   │   │   └── ProtectedRoute.js
│   │   │
│   │   ├── supervisor/      # Staff pages
│   │   │   ├── DailyEntry.js
│   │   │   ├── WorkerAssignment.js
│   │   │   └── FeedBatchCreation.js
│   │   │
│   │   ├── owner/           # Owner pages
│   │   │   ├── Dashboard.js
│   │   │   ├── ProductionReports.js
│   │   │   ├── SalesReports.js
│   │   │   ├── CostAnalysis.js
│   │   │   ├── LaborManagement.js
│   │   │   └── MonthlyPayroll.js
│   │   │
│   │   └── shared/          # Shared pages
│   │       └── NotFound.js
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useDailyLogs.js
│   │   ├── useSales.js
│   │   └── useCosts.js
│   │
│   ├── services/            # API services
│   │   ├── api.js          # Axios configuration
│   │   ├── authService.js
│   │   ├── dailyLogService.js
│   │   ├── salesService.js
│   │   ├── feedService.js
│   │   ├── laborService.js
│   │   ├── costService.js
│   │   └── reportService.js
│   │
│   ├── context/             # React contexts
│   │   ├── AuthContext.js
│   │   ├── AppContext.js
│   │   └── NotificationContext.js
│   │
│   ├── utils/               # Utility functions
│   │   ├── dateHelpers.js
│   │   ├── formatters.js    # Currency, number formatting
│   │   ├── validators.js
│   │   └── constants.js
│   │
│   ├── styles/              # CSS/SCSS files
│   │   ├── globals.css
│   │   ├── components/
│   │   ├── pages/
│   │   └── variables.css
│   │
│   ├── assets/              # Static assets
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── App.js              # Main App component
│   ├── App.css
│   └── index.js            # Entry point
│
├── package.json
├── .env.example
├── .gitignore
└── Dockerfile
```

---

## Key Architecture Decisions

### **1. Separation of Concerns**

#### Backend Layers:

```javascript
// Request Flow:
Routes → Controllers → Services → Models → Database
  ↓         ↓          ↓         ↓
Routing → Handling → Business → Data → Storage
                    Logic     Access
```

#### Example Implementation:

```javascript
// routes/dailyLogs.js
router.post("/", authenticate, validateDailyLog, dailyLogController.create);

// controllers/dailyLogController.js
exports.create = async (req, res, next) => {
  try {
    const dailyLog = await dailyLogService.createDailyLog(req.body, req.user);
    res.status(201).json({ success: true, data: dailyLog });
  } catch (error) {
    next(error);
  }
};

// services/dailyLogService.js
exports.createDailyLog = async (logData, user) => {
  // Business logic here
  const dailyLog = await DailyLog.create({
    ...logData,
    supervisor_id: user.id,
  });
  await costCalculationService.updateDailyCosts(logData.log_date);
  return dailyLog;
};
```

### **2. Feature-Based Organization**

Each major feature has its own:

- Controller (API endpoints)
- Service (business logic)
- Model (data structure)
- Routes (URL mapping)
- Frontend pages/components

### **3. Reusable Components**

```javascript
// components/forms/FormField.js
export const FormField = ({
  label,
  type = "text",
  value,
  onChange,
  error,
  required = false,
}) => (
  <div className="form-field">
    <label>
      {label} {required && "*"}
    </label>
    <input type={type} value={value} onChange={onChange} />
    {error && <span className="error">{error}</span>}
  </div>
);

// Usage across multiple forms
<FormField
  label="Eggs Collected"
  type="number"
  value={eggsCollected}
  onChange={(e) => setEggsCollected(e.target.value)}
  required
/>;
```

---

## Database Architecture (`/database`)

```
database/
├── migrations/              # Database schema changes
│   ├── 001_initial_schema.sql
│   ├── 002_add_laborers.sql
│   ├── 003_add_cost_calculations.sql
│   └── 004_add_indexes.sql
│
├── seeds/                   # Initial data
│   ├── users.sql           # Default users
│   ├── houses.sql          # Farm houses
│   ├── task_types.sql      # Default task types
│   └── recipes.sql         # Default feed recipes
│
├── scripts/                 # Utility scripts
│   ├── backup.sh           # Database backup
│   ├── restore.sh          # Database restore
│   └── reset.sh            # Reset development DB
│
└── schema.sql              # Complete schema
```

---

## Shared Architecture (`/shared`)

```
shared/
├── types/                  # TypeScript types (if using TS)
│   ├── auth.ts
│   ├── dailyLog.ts
│   ├── sales.ts
│   └── index.ts
│
├── constants/              # Shared constants
│   ├── roles.js           # User roles
│   ├── taskTypes.js       # Labor task types
│   ├── eggGrades.js       # Egg quality grades
│   └── paymentMethods.js  # Payment options
│
└── validators/             # Shared validation rules
    ├── dailyLog.js
    ├── sales.js
    └── laborer.js
```

---

## Configuration Files

### **Environment Variables (.env)**

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/eggfarm
DATABASE_TEST_URL=postgresql://user:pass@localhost:5432/eggfarm_test

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Server
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### **Package.json Scripts**

```json
{
  "scripts": {
    "dev": "concurrently \"npm run backend:dev\" \"npm run frontend:dev\"",
    "backend:dev": "cd backend && nodemon server.js",
    "frontend:dev": "cd frontend && npm start",
    "test": "npm run backend:test && npm run frontend:test",
    "backend:test": "cd backend && jest",
    "frontend:test": "cd frontend && npm test",
    "db:migrate": "cd database && psql $DATABASE_URL -f migrations/latest.sql",
    "db:seed": "cd database && psql $DATABASE_URL -f seeds/all.sql",
    "build": "cd frontend && npm run build",
    "start": "cd backend && npm start"
  }
}
```

---

## Development Workflow

### **1. Adding a New Feature**

Example: Adding "Egg Inventory Tracking"

1. **Backend:**

   ```bash
   # Add database migration
   database/migrations/005_add_egg_inventory.sql

   # Create model
   backend/src/models/EggInventory.js

   # Create service
   backend/src/services/eggInventoryService.js

   # Create controller
   backend/src/controllers/eggInventoryController.js

   # Create routes
   backend/src/routes/eggInventory.js

   # Add tests
   backend/tests/unit/services/eggInventoryService.test.js
   ```

2. **Frontend:**

   ```bash
   # Create service
   frontend/src/services/eggInventoryService.js

   # Create components
   frontend/src/components/inventory/InventoryList.js
   frontend/src/components/inventory/InventoryForm.js

   # Create pages
   frontend/src/pages/owner/EggInventory.js

   # Add hooks
   frontend/src/hooks/useEggInventory.js

   # Add tests
   frontend/src/components/inventory/__tests__/
   ```

### **2. File Naming Conventions**

- **PascalCase:** React components (`DailyEntryForm.js`)
- **camelCase:** Services, utilities (`dailyLogService.js`)
- **kebab-case:** Routes, CSS files (`daily-logs.js`, `form-styles.css`)
- **SCREAMING_SNAKE_CASE:** Constants (`MAX_EGGS_PER_DAY`)

### **3. Import Organization**

```javascript
// External imports first
import React, { useState, useEffect } from "react";
import axios from "axios";

// Internal imports second
import { useAuth } from "../hooks/useAuth";
import { dailyLogService } from "../services/dailyLogService";
import { formatCurrency } from "../utils/formatters";

// Component imports last
import FormField from "../components/forms/FormField";
import LoadingSpinner from "../components/common/LoadingSpinner";
```

---

## Benefits of This Architecture

### **1. Maintainability**

- Clear separation of concerns
- Consistent file organization
- Easy to find and modify code

### **2. Scalability**

- Modular structure allows easy feature additions
- Reusable components reduce duplication
- Service layer abstracts business logic

### **3. Testability**

- Each layer can be tested independently
- Services contain pure business logic
- Components have clear props/state

### **4. Team Collaboration**

- Multiple developers can work on different features
- Clear ownership of files and responsibilities
- Consistent coding patterns

### **5. Future-Proofing**

- Easy to add new features without refactoring
- Migration to TypeScript is straightforward
- Can add new frontend frameworks alongside React

---

## Getting Started Commands

```bash
# Clone and setup
git clone <repo>
cd egg-farm-management

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Setup database
cd ../database
psql -U postgres -c "CREATE DATABASE eggfarm;"
psql -U postgres eggfarm -f schema.sql
psql -U postgres eggfarm -f seeds/initial_data.sql

# Start development
cd ..
npm run dev  # Starts both backend and frontend

# Run tests
npm test

# Build for production
npm run build
```

This architecture will serve you well as you build and expand your egg farm management system!
