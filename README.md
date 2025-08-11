# 📅 Full-Stack Shared Calendar Application

A modern, full-featured calendar application built with React, TypeScript, and Supabase. Features real-time collaboration, event sharing, email notifications, and responsive design.

## 🚀 Features

### Frontend
- **Modern React UI** with TailwindCSS and smooth animations
- **Multiple Calendar Views** (Month, Week, Day)
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Real-time Updates** with Socket.io
- **Event Management** - Create, edit, delete, and share events
- **User Authentication** with Supabase Auth
- **Shared Calendars** with permission management
- **Email Notifications** for event sharing

### Backend
- **Supabase Backend** with PostgreSQL database
- **Edge Functions** for server-side logic
- **Row Level Security** for data protection
- **Real-time Features** using Socket.io
- **Email Service** with Resend integration
- **File Storage** capabilities

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Email**: Resend API
- **Real-time**: Socket.io
- **Styling**: TailwindCSS with custom design system
- **Development**: Vite, ESLint, TypeScript

## 🏗️ Project Structure

```
├── src/                      # React frontend
│   ├── components/           # React components
│   │   ├── auth/            # Authentication components
│   │   ├── calendar/        # Calendar views
│   │   ├── dashboard/       # Dashboard components
│   │   ├── events/          # Event management
│   │   ├── layout/          # Layout components
│   │   ├── shared/          # Shared calendar components
│   │   └── ui/              # Reusable UI components
│   ├── contexts/            # React contexts
│   ├── integrations/        # Supabase integration
│   ├── services/            # Service layer
│   └── pages/              # Main pages
├── supabase/               # Supabase configuration
│   ├── functions/          # Edge functions
│   └── migrations/         # Database migrations
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Resend account (for email functionality)

### 1. Clone Repository
```bash
git clone <repository-url>
cd calendar-app
```

### 2. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key
3. Update `src/integrations/supabase/client.ts` with your credentials

### 3. Email Service Setup
1. Sign up at [resend.com](https://resend.com)
2. Verify your sending domain at [resend.com/domains](https://resend.com/domains)
3. Create an API key at [resend.com/api-keys](https://resend.com/api-keys)
4. Add the `RESEND_API_KEY` secret in your Supabase project settings

### 4. Install Dependencies
```bash
npm install
```

### 5. Start Development Server
```bash
npm run dev
```

### 6. Access Application
- **Frontend**: http://localhost:5173
- **Supabase Dashboard**: Your project dashboard URL

## 📋 API Integration

### Supabase Functions
- `send-event-email` - Sends email notifications for event sharing

### Core Features
- **Event Management**: Create, read, update, delete events
- **User Authentication**: Sign up, login, profile management
- **Event Sharing**: Share events with other users via email
- **Real-time Updates**: Live synchronization across users

## 🔧 Configuration

### Required Secrets (Supabase Dashboard)
```
RESEND_API_KEY=your_resend_api_key
```

### Environment Setup
The application uses Supabase for backend services:
- Database: PostgreSQL with Row Level Security
- Authentication: Built-in Supabase Auth
- Storage: Supabase Storage (if needed)
- Edge Functions: Serverless functions for email sending

## 📱 Features in Detail

### Calendar Views
- **Month View**: Traditional monthly calendar grid
- **Week View**: 7-day week with hourly slots
- **Day View**: Single day detailed view with hour blocks

### Event Management
- Create events with title, description, date/time, location
- Color-coded events for easy organization
- Recurring events support
- Event sharing with email notifications

### Email Notifications
- Automatic email sending when events are shared
- Beautiful HTML email templates
- Event details included in emails
- Permission-based sharing (view/edit)

### Real-time Features
- Live event updates across all connected users
- Real-time calendar synchronization
- Instant notifications for shared events

### User Experience
- Responsive design for all screen sizes
- Smooth animations and transitions
- Intuitive drag-and-drop interface
- Modern UI with shadcn/ui components

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- JWT-based authentication with Supabase
- Secure API key management via Supabase secrets
- Input validation and sanitization
- CORS protection on edge functions

## 📈 Performance

- Optimized database queries with proper indexing
- Frontend code splitting and lazy loading
- Edge function optimization for fast email delivery
- Responsive design with mobile-first approach

## 🚀 Deployment

### Frontend Deployment
The frontend can be deployed to any static hosting service:
- Vercel (recommended)
- Netlify
- Cloudflare Pages

### Backend Deployment
Backend services are handled by Supabase:
- Database: Automatically managed PostgreSQL
- Edge Functions: Automatically deployed
- Authentication: Managed service
- File Storage: Managed service

## 🧪 Testing

### Email Functionality
1. Create an event in the calendar
2. Add email addresses to share the event
3. Check that emails are sent successfully
4. Monitor edge function logs for debugging

### Troubleshooting Email Issues
- Verify Resend API key is correctly set in Supabase secrets
- Check edge function logs for error messages
- Ensure sending domain is verified in Resend
- Confirm recipient email addresses are valid

## 📊 Monitoring

### Edge Function Logs
Monitor email sending in your Supabase dashboard:
- Go to Edge Functions → send-event-email → Logs
- Check for successful email sends and error messages

### Database Monitoring
Use Supabase's built-in monitoring for:
- Query performance
- Database usage
- Authentication metrics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Supabase Dashboard**: Monitor your project health
- **Edge Function Logs**: Debug email sending issues
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions

## 🎯 Roadmap

- [x] Email notifications for event sharing
- [x] Supabase backend integration
- [x] Real-time event updates
- [ ] Google Calendar integration
- [ ] Mobile app (React Native)
- [ ] Advanced recurring event patterns
- [ ] Calendar import/export
- [ ] Team workspace features
- [ ] Advanced permissions system
- [ ] Calendar themes and customization
- [ ] SMS notifications

---

**Built with ❤️ using React, TypeScript, and Supabase**