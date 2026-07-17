# 📅 EventFlow - Sync Calendar

A modern, full-featured calendar application built with React, TypeScript, and Supabase. Features collaborative event management, sharing capabilities, email notifications, and responsive design.

## 🚀 Features

### Core Functionality
- **Multiple Calendar Views** - Month, Week, and Day views with intuitive navigation
- **Event Management** - Create, edit, delete, and organize events with color coding
- **Event Sharing** - Share events with other users via email invitations
- **Real-time Collaboration** - Live updates across all connected users
- **User Authentication** - Secure login/signup with profile management
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### Advanced Features
- **Email Notifications** - Automated email sending for event sharing
- **Dashboard Analytics** - Quick stats and upcoming events overview
- **Shared Calendars** - Collaborate on calendars with permission management
- **Profile Management** - User profiles with customizable settings
- **Modern UI/UX** - Beautiful interface with smooth animations

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast development server and build tool
- **TailwindCSS** - Utility-first styling with custom design system
- **shadcn/ui** - Beautiful, accessible UI components
- **React Router** - Client-side routing
- **React Hook Form** - Form management with validation
- **Lucide React** - Modern icon library

### Backend & Services
- **Supabase** - Complete backend-as-a-service
  - PostgreSQL database with Row Level Security
  - Authentication and user management
  - Edge Functions for serverless logic
  - Real-time subscriptions
- **EmailJS** - Client-side email delivery service
- **Socket.io** - Real-time communication

### Development Tools
- **ESLint** - Code linting and formatting
- **Zod** - Runtime type validation
- **React Query** - Server state management
- **Date-fns** - Date utility library

## 🏗️ Project Structure

```
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   │   ├── AuthPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── ForgotPasswordModal.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── calendar/          # Calendar view components
│   │   │   ├── CalendarView.tsx
│   │   │   ├── CalendarGrid.tsx
│   │   │   ├── MonthView.tsx
│   │   │   ├── WeekView.tsx
│   │   │   ├── DayView.tsx
│   │   │   └── ViewSelector.tsx
│   │   ├── dashboard/         # Dashboard components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── QuickStats.tsx
│   │   │   └── UpcomingEvents.tsx
│   │   ├── events/            # Event management
│   │   │   ├── EventModal.tsx
│   │   │   └── RecentEvents.tsx
│   │   ├── shared/            # Shared calendar features
│   │   │   ├── ShareEventModal.tsx
│   │   │   └── SharedCalendars.tsx
│   │   ├── layout/            # Layout components
│   │   │   └── Navbar.tsx
│   │   ├── profile/           # User profile
│   │   │   └── ProfilePage.tsx
│   │   └── ui/                # Reusable UI components (shadcn/ui)
│   ├── contexts/              # React contexts
│   │   ├── AuthContext.tsx
│   │   └── SocketContext.tsx
│   ├── integrations/supabase/ # Supabase configuration
│   │   ├── client.ts
│   │   └── types.ts
│   ├── api/                   # API layer
│   │   ├── auth.ts
│   │   ├── events.ts
│   │   └── events-supabase.ts
│   ├── services/              # Service layer
│   │   └── emailService.ts
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/                   # Utility functions
│   │   └── utils.ts
│   └── pages/                 # Main application pages
│       ├── Index.tsx
│       └── NotFound.tsx
├── supabase/
│   ├── functions/             # Edge functions
│   └── config.toml            # Supabase configuration
├── public/                    # Static assets
├── server/                    # Legacy Node.js server (deprecated)
└── docs/                      # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account ([supabase.com](https://supabase.com))
- EmailJS account for email functionality ([emailjs.com](https://www.emailjs.com))

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd eventflow-sync-calendar
npm install
```

### 2. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Update `src/integrations/supabase/client.ts` with your credentials
4. The database schema and RLS policies will be automatically created

### 3. Email Service Configuration
1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Create an **Email Service** (e.g., Gmail) and note the **Service ID**
3. Create an **Email Template** and note the **Template ID**
4. Find your **Public Key** in Account → General
5. Add these values to your `.env` file:
   ```
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   ```
6. Make sure your EmailJS template includes these variables:
   - `{{to_email}}`, `{{to_name}}`, `{{from_email}}`, `{{from_name}}`
   - `{{subject}}`, `{{message}}`
   - `{{event_title}}`, `{{event_date}}`, `{{event_time}}`, `{{event_location}}`, `{{permission_type}}`

### 4. Start Development
```bash
npm run dev
```

### 5. Access Your Application
- **Frontend**: http://localhost:8080
- **Supabase Dashboard**: Your project dashboard for monitoring

## 📋 Key Features Overview

### Calendar Management
- **Multi-View Calendar**: Switch between Month, Week, and Day views
- **Event Creation**: Rich event creation with title, description, date/time, and location
- **Color Coding**: Organize events with customizable colors
- **Drag & Drop**: Intuitive event manipulation (planned feature)

### User Authentication
- **Secure Login/Signup**: Email and password authentication via Supabase
- **Profile Management**: User profiles with customizable information
- **Protected Routes**: Secure access to authenticated features
- **Password Recovery**: Forgot password functionality

### Event Sharing & Collaboration
- **Email Invitations**: Share events via email with automatic notifications
- **Shared Calendars**: Collaborate on calendars with other users
- **Permission Management**: Control access levels for shared content
- **Real-time Updates**: Live synchronization across all users

### Dashboard & Analytics
- **Quick Stats**: Overview of total events, shared calendars, and activity
- **Upcoming Events**: Next 5 upcoming events display
- **Recent Activity**: Track recent event changes and shares

## 🔧 Configuration

### Required Environment Variables
```
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
```

### Supabase Configuration
- **Database**: PostgreSQL with automatic migrations
- **Authentication**: Built-in user management
- **Edge Functions**: Serverless functions for email processing
- **Row Level Security**: Enabled on all user data tables

## 📱 API Documentation

### Email Service

Event-share emails are sent directly from the browser using the EmailJS SDK. No backend Edge Function is required.

**Service file**: `src/services/emailjsService.ts`

**Template variables sent to EmailJS**:
```json
{
  "to_email": "user@example.com",
  "to_name": "user@example.com",
  "from_email": "sender@example.com",
  "from_name": "Sender Name",
  "subject": "Calendar Event Shared: Team Meeting",
  "message": "Sender Name has shared a calendar event with you.",
  "event_title": "Team Meeting",
  "event_date": "1/15/2024",
  "event_time": "10:00 AM - 11:00 AM",
  "event_location": "Conference Room A",
  "permission_type": "view"
}
```

## 🔒 Security Features

- **Row Level Security (RLS)**: All database tables are secured with user-specific access
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation using Zod schemas
- **CORS Protection**: Proper CORS headers on all edge functions
- **API Key Security**: Secure management of third-party API keys

## 🧪 Testing & Debugging

### Testing Email Functionality
1. Create a test event in the calendar
2. Share the event with a valid email address
3. Check the recipient's inbox for the notification
4. Monitor edge function logs for successful delivery

### Debugging Common Issues

#### Email Not Sending
- Verify `VITE_EMAILJS_PUBLIC_KEY`, `VITE_EMAILJS_SERVICE_ID`, and `VITE_EMAILJS_TEMPLATE_ID` are set in your `.env` file
- Check the browser console for EmailJS error details
- Confirm the EmailJS service and template IDs match your EmailJS dashboard
- Ensure the recipient email format is valid
- Verify your EmailJS account has not exceeded its monthly send limit

#### Authentication Issues
- Check Supabase project settings
- Verify user authentication is enabled
- Review RLS policies for proper permissions

#### Database Connection
- Monitor Supabase dashboard for connection status
- Check API key configuration
- Review database logs for errors

## 📊 Monitoring & Analytics

### Supabase Dashboard Monitoring
- **Database Performance**: Query execution times and usage
- **Authentication Metrics**: User signups, logins, and activity
- **Edge Function Logs**: Real-time function execution and errors
- **Storage Usage**: File upload and storage metrics

### Application Monitoring
- Real-time event updates and synchronization
- Email delivery success rates
- User engagement and feature usage

## 🚀 Deployment

### Production Deployment
1. **Frontend**: Deploy to Vercel, Netlify, or similar static hosting
2. **Backend**: Supabase handles all backend services automatically
3. **Environment**: Configure production secrets in Supabase dashboard
4. **Domain**: Set up custom domain if required

### Build Commands
```bash
# Production build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

## 🛣️ Roadmap

### Completed Features
- [x] Multi-view calendar (Month, Week, Day)
- [x] Event creation and management
- [x] User authentication and profiles
- [x] Event sharing via email
- [x] Real-time collaboration
- [x] Responsive design
- [x] Email notifications with EmailJS
- [x] Dashboard with analytics

### Planned Features
- [ ] Google Calendar integration
- [ ] Recurring events with advanced patterns
- [ ] Mobile app (React Native)
- [ ] Calendar import/export (ICS format)
- [ ] Advanced permission system
- [ ] Team workspaces
- [ ] Calendar themes and customization
- [ ] SMS notifications
- [ ] Third-party calendar sync
- [ ] Advanced reporting and analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use the existing component structure
- Maintain responsive design principles
- Write comprehensive tests for new features
- Update documentation for significant changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Resources

### Helpful Links
- [Supabase Dashboard](https://supabase.com/dashboard/project/stfbdqokdracgyguqzmo) - Monitor your project
- [EmailJS Dashboard](https://dashboard.emailjs.com/) - Manage email templates and services

### Getting Help
- Create GitHub issues for bugs and feature requests
- Use GitHub discussions for questions and community support
- Check Supabase documentation for backend-related questions
- Review React and TypeScript documentation for frontend issues

---

**EventFlow** - Making calendar management and collaboration simple and beautiful. Built with modern web technologies for optimal performance and user experience.