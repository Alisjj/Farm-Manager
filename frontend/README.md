# Farm Manager Frontend

A modern React-based frontend for the Egg Production Management System, inspired by farmPilot but tailored specifically for small-scale egg production operations.

## Features

### ✅ Implemented

- **Authentication System**: Login/logout with role-based access (Owner/Staff)
- **Dashboard**: Role-specific overview with key metrics and navigation
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Modern UI Components**: Based on shadcn/ui with Radix UI primitives
- **Type Safety**: Full TypeScript implementation
- **State Management**: React Context for authentication, TanStack Query for server state

### 🚧 Planned Implementation

- **Daily Operations Logging**: Egg collection, feed consumption, mortality tracking
- **Sales Management**: Customer database, transaction recording, payment tracking
- **Feed Management**: Recipe creation, batch costing, ingredient tracking
- **Labor Management**: Worker attendance, payroll processing, task assignment
- **Cost Analysis**: Real-time cost calculations, pricing recommendations
- **Reporting**: Comprehensive analytics and data export

## Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query + React Context
- **Form Handling**: React Hook Form + Zod validation
- **Charts**: Recharts (planned)

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components (Button, Card, Input, etc.)
│   ├── charts/             # Chart components (planned)
│   ├── common/             # Shared components
│   └── forms/              # Form components
├── context/
│   └── AuthContext.tsx     # Authentication state management
├── hooks/
│   ├── use-toast.ts        # Toast notification hook
│   └── ...                 # Custom hooks
├── pages/
│   ├── auth/
│   │   └── LoginPage.tsx   # Login interface
│   ├── Dashboard.tsx       # Main dashboard
│   ├── DailyLogs.tsx       # Daily operations logging
│   ├── Sales.tsx           # Sales management
│   ├── Customers.tsx       # Customer management
│   ├── FeedManagement.tsx  # Feed batch management
│   ├── LaborManagement.tsx # Worker and payroll management
│   ├── CostAnalysis.tsx    # Cost calculations and pricing
│   └── Reports.tsx         # Analytics and reports
├── services/               # API service functions
├── lib/
│   └── utils.ts           # Utility functions
└── styles/                # Global styles and themes
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. **Install dependencies**:

   ```bash
   cd frontend
   npm install
   # or
   pnpm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - API proxy: http://localhost:3000/api (proxies to backend on port 5000)

### Build for Production

```bash
npm run build
# or
pnpm build
```

## Design System

### Color Palette

- **Primary**: Green theme (egg production/farm theme)
- **Secondary**: Neutral grays
- **Success**: Green for positive metrics
- **Warning**: Amber for alerts
- **Destructive**: Red for errors

### User Roles & Permissions

#### Owner Role

- Full access to all features
- Labor management and payroll
- Cost analysis and pricing
- Comprehensive reporting
- System configuration

#### Staff Role

- Daily operations logging
- Sales recording
- Basic feed management
- Limited reporting

## API Integration

The frontend communicates with the backend through RESTful APIs:

- **Authentication**: `/api/auth/*`
- **Daily Operations**: `/api/daily-logs/*`
- **Sales**: `/api/sales/*`
- **Customers**: `/api/customers/*`
- **Feed**: `/api/feed/*`
- **Labor**: `/api/labor/*`
- **Reports**: `/api/reports/*`

## Development Guidelines

### Component Standards

- Use TypeScript for all components
- Follow the shadcn/ui component patterns
- Implement proper error boundaries
- Include loading states and error handling

### Form Handling

- Use React Hook Form for form management
- Implement Zod schemas for validation
- Provide clear error messages
- Include form submission feedback

### State Management

- Use TanStack Query for server state
- Implement optimistic updates where appropriate
- Handle loading and error states consistently
- Cache data appropriately

## Mobile Considerations

The interface is designed mobile-first for staff field use:

- **Touch-friendly**: Large buttons and form elements
- **Offline capability**: Planned for future implementation
- **Progressive Web App**: Planned for app-like experience
- **Responsive design**: Works on all screen sizes

## Customization from farmPilot

While inspired by farmPilot, this frontend is specifically tailored for egg production:

### Differences from farmPilot:

1. **Role Model**: Owner/Staff instead of Admin/Staff
2. **Domain Focus**: Egg production specifics (grades, feed recipes, etc.)
3. **Cost Calculations**: Real-time egg cost calculation engine
4. **Labor Management**: Simplified for small farm operations
5. **Reporting**: Focus on production metrics and profitability

### Retained Elements:

1. **Modern UI Architecture**: Component structure and styling approach
2. **Authentication Flow**: JWT-based authentication pattern
3. **Dashboard Design**: Card-based layout with key metrics
4. **Mobile Responsiveness**: Tailwind CSS responsive design
5. **State Management**: TanStack Query implementation

## Future Enhancements

- **IoT Integration**: Sensor data for temperature, humidity
- **Weather Integration**: Weather data for production correlation
- **Mobile App**: Native iOS/Android applications
- **Advanced Analytics**: Machine learning for production optimization
- **Multi-farm Support**: Manage multiple farm locations

## Contributing

1. Follow the existing code style and patterns
2. Ensure TypeScript compliance
3. Add appropriate error handling
4. Include responsive design considerations
5. Test on mobile devices

## License

Private - Farm Manager Project
