# Meeting Room Booking System

A standalone meeting room booking system built with Preact, TypeScript, and Supabase. This system allows companies to manage meeting rooms, users, teams, and credit allocations for booking rooms.

## Features

- **Company Management**: Multi-tenant system with company-based isolation
- **User Authentication**: Secure authentication with role-based access (admin/user)
- **Team Management**: Group users into teams for better organization
- **Meeting Room Management**: Create and manage meeting rooms with amenities
- **Booking System**: Book meeting rooms with credit tracking
- **Credit System**: Allocate credits to teams/users for room bookings
- **Email Notifications**: Automatic email notifications for bookings
- **Admin Dashboard**: Administrative interface for managing the system

## Tech Stack

- **Frontend**: Preact, TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (Database, Auth, Real-time)
- **Email**: Nodemailer
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Email service (Gmail, SendGrid, etc.)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd meeting-room-booking-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
   - Get your project URL and API keys

4. Configure environment variables:
   - For local development: Copy `env.example` to `.env` and fill in your credentials
   - For production: Configure environment variables in your Netlify dashboard (see Deployment section)

5. Start the development server:
```bash
npm run dev
```

### Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email Configuration
VITE_EMAIL_HOST=smtp.gmail.com
VITE_EMAIL_PORT=587
VITE_EMAIL_USER=your_email@gmail.com
VITE_EMAIL_PASS=your_app_password
```

## Database Schema

The system uses the following main entities:

- **Companies**: Top-level organization units
- **Users**: Individual users within companies with roles
- **Teams**: Groups of users within companies
- **Meeting Rooms**: Bookable rooms with capacity and amenities
- **Bookings**: Room reservations with time slots
- **Credit Allocations**: Credit distribution to teams/users

## Deployment

### Netlify Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Configure environment variables in Netlify dashboard:**
   - Go to your site in Netlify dashboard
   - Navigate to Site settings > Environment variables
   - Add the following variables:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     VITE_EMAIL_HOST=smtp.gmail.com
     VITE_EMAIL_PORT=587
     VITE_EMAIL_USER=your_email@gmail.com
     VITE_EMAIL_PASS=your_app_password
     ```
5. Deploy

### Environment Variables for Production

**Important**: Environment variables for production should be configured in your Netlify dashboard under Site settings > Environment variables, NOT in a `.env` file in your repository. This keeps your sensitive credentials secure.

## Usage

1. **First Time Setup**:
   - Create a company in the database
   - Register the first admin user
   - Set up meeting rooms
   - Allocate credits to teams/users

2. **Admin Functions**:
   - Manage users and teams
   - Create and manage meeting rooms
   - Allocate credits to teams/users
   - View all bookings and system statistics

3. **User Functions**:
   - Book meeting rooms
   - View upcoming bookings
   - Manage team memberships

## Security

- Row Level Security (RLS) enabled on all tables
- Company-based data isolation
- Role-based access control
- Secure authentication via Supabase Auth

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
