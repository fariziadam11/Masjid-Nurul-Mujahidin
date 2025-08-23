# Masjid Al-Hidayah Website

A modern mosque website built with React, TypeScript, and Supabase, featuring admin dashboard for managing mosque data.

## Features

### Public Features
- **Home Page**: Welcome page with mosque information
- **Prayer Schedule**: Daily prayer times
- **Leadership**: Mosque leadership information
- **Announcements**: Public announcements
- **Financial Reports**: Transparent financial records
- **Multilingual**: Indonesian and English support

### Admin Features
- **Secure Login**: Admin authentication system
- **CRUD Operations**: Full Create, Read, Update, Delete functionality for:
  - Leadership management
  - Prayer schedule management
  - Financial records management
  - Announcements management
- **User Management**: Admin user system with role-based access

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Icons**: Lucide React
- **Routing**: React Router

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 2. Clone and Install

```bash
git clone <repository-url>
cd masjid
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Database Setup

1. **Run Migrations**: Apply the database migrations in Supabase:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the migration files in order:
     - `supabase/migrations/20250823031420_sparkling_beacon.sql`
     - `supabase/migrations/20250123000000_add_users_table.sql`
           - `supabase/migrations/20250123000001_fix_rls_policies.sql`
      - `supabase/migrations/20250123000002_fix_all_rls_policies.sql`
      - `supabase/migrations/20250123000003_fix_users_table_policy.sql`

2. **Create Admin User**: Run the setup script:
   ```bash
   node setup-admin.js
   ```

3. **Fix RLS Policies** (if you get 500 errors):
   ```bash
   node fix-all-tables.js
   node fix-users-table.js
   ```
   Then run the generated SQL in Supabase SQL Editor.

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Admin Access

### Default Admin Credentials
- **Email**: admin@mosque.com
- **Password**: admin123

### Changing Admin Password

#### Method 1: From Admin Dashboard
1. Login to admin dashboard
2. Click "Change Password" button in the header
3. Enter current password and new password
4. Click "Save"

#### Method 2: Using Setup Script
```bash
node setup-admin.js update-password your_new_password
```

#### Method 3: Via Supabase Dashboard
1. Go to Supabase Dashboard → Authentication → Users
2. Find `admin@mosque.com` user
3. Click Edit → Update password

### Admin Dashboard Features

1. **Leadership Management**
   - Add, edit, delete leadership members
   - Manage roles and photos

2. **Prayer Schedule Management**
   - Set daily prayer times
   - Manage prayer schedule updates

3. **Financial Records Management**
   - Track income and expenditure
   - Manage financial transparency

4. **Announcements Management**
   - Create and manage public announcements
   - Schedule announcement dates

## Database Schema

### Tables

1. **users** - Admin user management
   - id (uuid, primary key)
   - email (text, unique)
   - full_name (text)
   - role (admin/super_admin)
   - is_active (boolean)

2. **leadership** - Mosque leadership
   - id (uuid, primary key)
   - name (text)
   - role (text)
   - photo_url (text)

3. **prayer_schedule** - Daily prayer times
   - id (uuid, primary key)
   - prayer_name (text)
   - time (text)
   - date (date)

4. **financial_records** - Financial transparency
   - id (uuid, primary key)
   - type (income/expenditure)
   - description (text)
   - amount (numeric)
   - date (date)

5. **announcements** - Public announcements
   - id (uuid, primary key)
   - title (text)
   - content (text)
   - date (date)

## Security Features

- **Row Level Security (RLS)**: All tables have RLS enabled
- **Role-based Access**: Admin-only access to CRUD operations
- **Authentication**: Supabase Auth integration
- **Input Validation**: Form validation and sanitization

## Troubleshooting

### Error 500 on API calls
If you get 500 errors when accessing the admin dashboard:

1. **Run the fix script**:
   ```bash
   node fix-all-tables.js
   ```

2. **Copy the generated SQL** and run it in Supabase SQL Editor

3. **Alternative manual fix**:
   - Go to Supabase Dashboard → SQL Editor
   - Run the migration: `supabase/migrations/20250123000002_fix_all_rls_policies.sql`

### Admin Login Issues
If admin login fails:

1. **Check if user exists in auth**:
   - Go to Supabase Dashboard → Authentication → Users
   - Look for `admin@mosque.com`

2. **Create user manually if needed**:
   - Click "Add User"
   - Email: `admin@mosque.com`
   - Password: `admin123`
   - Auto confirm: ✅

3. **Update users table**:
   ```bash
   node setup-admin.js
   ```

### Database Connection Issues
If you can't connect to the database:

1. **Check environment variables** in `.env` file
2. **Verify Supabase project settings**
3. **Check if tables exist** in Supabase Dashboard → Table Editor

## Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Other Platforms

The application can be deployed to any platform that supports React applications (Netlify, Railway, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.
