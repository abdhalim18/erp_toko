# VetMed ERP - Veterinary Medicine Store Management System

A comprehensive ERP system built with Next.js, TypeScript, and MySQL for managing veterinary medicine stores.

## Features

### Core Modules

1. **Inventory & Stock Management**
   - Monitor inventory for medicines, vaccines, vitamins, supplements, pet food, and accessories
   - Low stock alert system with notifications
   - Batch number & expiry date tracking
   - Product categorization

2. **Purchasing & Supplier Management**
   - Supplier database with contact information
   - Automatic purchase order generation
   - Purchase history tracking

3. **Sales Management**
   - Customer management
   - Sales tracking and invoicing
   - Payment processing

4. **Reporting & Dashboard**
   - Interactive dashboard with charts
   - Sales reports (daily, weekly, monthly)
   - Best-selling products analysis
   - Profit margin calculations

5. **User Management**
   - Role-based authentication (Admin, Staff)
   - Secure login system

## Technical Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone and setup the project:**
   ```bash
   cd /Applications/XAMPP/xamppfiles/htdocs/ERP_toko-hewan/vet-erp
   npm install
   ```

2. **Set up the database:**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE vetmed_erp;
   EXIT;
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your database credentials:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/vetmed_erp"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Run database migrations:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database (optional):**
   ```bash
   # Create initial admin user
   npx prisma db seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Default Credentials

- **Admin**: admin@vetmed.com / admin123
- **Staff**: staff@vetmed.com / staff123

## Project Structure

```
vet-erp/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Authentication page
│   └── ...
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...
├── lib/                  # Utility libraries
├── prisma/               # Database schema and migrations
└── hooks/                # Custom React hooks
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open database browser

### Key Components

- **Authentication**: NextAuth.js with credentials provider
- **Database**: Prisma ORM with MySQL
- **UI**: shadcn/ui components with Tailwind CSS
- **Charts**: Recharts for data visualization

## Features in Detail

### Inventory Management
- Product catalog with categories
- Stock level tracking
- Batch management with expiry dates
- Low stock alerts
- Barcode support

### Purchase Management
- Supplier management
- Purchase order creation
- Purchase history tracking
- Automatic reordering

### Sales Management
- Customer database
- Sales transaction recording
- Invoice generation
- Payment tracking

### Reporting
- Dashboard with key metrics
- Sales analytics
- Inventory reports
- Profit analysis

## Security

- Role-based access control
- Secure password hashing
- Session management
- Input validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
