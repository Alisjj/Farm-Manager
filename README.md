# Farm Manager

A comprehensive egg farm management system with production tracking, sales management, feed inventory, labor management, and reporting.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js, Sequelize ORM
- **Database**: PostgreSQL (production) / SQLite (development/testing)

## Project Structure

```
/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── shared/      # Shared components
├── context/         # React context providers
├── hooks/           # Custom React hooks
├── lib/             # Frontend utilities & API client
├── types/           # TypeScript type definitions
├── src/             # Backend source code
│   ├── config/      # Configuration (auth, logger, roles)
│   ├── controllers/ # Route handlers
│   ├── middleware/  # Express middleware
│   ├── models/      # Sequelize models
│   ├── routes/      # API routes
│   ├── services/    # Business logic
│   ├── utils/       # Utilities
│   └── validations/ # Request validation
├── tests/           # Test files
├── public/          # Static assets
├── server.js        # Express server (serves API + Next.js in production)
└── package.json     # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (for production) or SQLite (for development)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Farm-Manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database credentials
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

   This starts:
   - Express API server on http://localhost:5001
   - Next.js frontend on http://localhost:3000

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both API and frontend in development mode |
| `npm run dev:api` | Start only the API server |
| `npm run dev:next` | Start only the Next.js frontend |
| `npm run build` | Build the Next.js frontend for production |
| `npm start` | Start production server (serves both API and frontend) |
| `npm test` | Run tests |
| `npm run lint` | Run ESLint |

### Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables for production:
   ```bash
   NODE_ENV=production
   PORT=5001
   # ... database credentials
   ```

3. Start the server:
   ```bash
   npm start
   ```

   The server will serve both the API and the Next.js frontend on a single port.

## Features

- **Dashboard**: Overview of farm operations with key metrics
- **House Management**: Track bird houses, capacity, and status
- **Daily Logs**: Record daily egg production, feed usage, mortality
- **Feed Management**: Manage feed batches, recipes, and inventory
- **Sales Management**: Track sales, customers, and payments
- **Labor Management**: Manage workers, assignments, and payroll
- **Reports**: Generate production and financial reports
- **Role-Based Access**: Admin, Manager, and Staff roles

## API Endpoints

All API endpoints are prefixed with `/api`:

- `/api/auth` - Authentication
- `/api/houses` - House management
- `/api/daily-logs` - Daily production logs
- `/api/feed` - Feed batches and recipes
- `/api/sales` - Sales transactions
- `/api/customers` - Customer management
- `/api/labor` - Labor management
- `/api/reports` - Report generation
- `/api/costs` - Cost tracking
- `/api/staff` - Staff management

## License

MIT
