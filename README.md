
# 📅 Full-Stack Shared Calendar Application

A modern, full-featured calendar application built with React, Node.js, and MongoDB. Features real-time collaboration, event sharing, and responsive design.

## 🚀 Features

### Frontend
- **Modern React UI** with TailwindCSS and smooth animations
- **Multiple Calendar Views** (Month, Week, Day)
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Real-time Updates** with Socket.io
- **Event Management** - Create, edit, delete, and share events
- **User Authentication** with JWT
- **Shared Calendars** with permission management

### Backend
- **RESTful API** built with Express.js
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** with bcrypt password hashing
- **Real-time Features** using Socket.io
- **Input Validation** and error handling
- **Rate Limiting** and security headers
- **Docker Support** for easy deployment

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Socket.io Client
- **Backend**: Node.js, Express.js, MongoDB, Socket.io
- **Authentication**: JWT, bcrypt
- **Deployment**: Docker, Docker Compose
- **Development**: Vite, ESLint, Prettier

## 🏗️ Project Structure

```
├── src/                    # React frontend
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── calendar/      # Calendar views
│   │   ├── dashboard/     # Dashboard components
│   │   ├── events/        # Event management
│   │   ├── layout/        # Layout components
│   │   └── shared/        # Shared calendar components
│   ├── contexts/          # React contexts
│   ├── api/              # API client functions
│   └── pages/            # Main pages
├── server/               # Node.js backend
│   ├── src/
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Custom middleware
│   │   └── server.js     # Main server file
│   └── package.json
├── docker/               # Docker configuration
├── docs/                 # Documentation
└── docker-compose.yml    # Multi-container setup
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB (or use Docker)
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd calendar-app
```

### 2. Environment Setup

**Backend Environment:**
```bash
cd server
cp .env.example .env
# Edit .env with your configuration
```

**Frontend Environment:**
```bash
# In root directory
echo "REACT_APP_API_URL=http://localhost:5000" > .env.local
```

### 3. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
# In root directory
npm install
```

### 4. Start Development Servers

**Option A: Manual Start**
```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
npm run dev
```

**Option B: Docker Compose**
```bash
docker-compose up --build
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health**: http://localhost:5000/api/health

## 📋 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Events
- `GET /api/events` - Get user events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get single event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/share` - Share event

### Users
- `GET /api/users/search` - Search users by email
- `GET /api/users/profile` - Get user profile

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/calendar-app
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

**Frontend (.env.local):**
```env
REACT_APP_API_URL=http://localhost:5000
```

## 🐳 Docker Deployment

### Development
```bash
docker-compose up --build
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up --build
```

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
npm test
```

## 📱 Features in Detail

### Calendar Views
- **Month View**: Traditional monthly calendar grid
- **Week View**: 7-day week with hourly slots
- **Day View**: Single day detailed view with hour blocks

### Event Management
- Create events with title, description, date/time, location
- Color-coded events for easy organization
- Recurring events support
- Event sharing with permission levels (view/edit)

### Real-time Features
- Live event updates across all connected users
- Real-time calendar synchronization
- Instant notifications for shared events

### User Experience
- Responsive design for all screen sizes
- Smooth animations and transitions
- Intuitive drag-and-drop interface
- Keyboard shortcuts for power users

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection
- Security headers with Helmet.js

## 📈 Performance

- Optimized database queries with indexes
- Frontend code splitting and lazy loading
- Image optimization and caching
- Gzip compression
- Connection pooling for database

## 🚀 Deployment Options

### Netlify (Frontend)
1. Build the frontend: `npm run build`
2. Deploy `dist` folder to Netlify
3. Configure environment variables

### Render/Fly.io (Backend)
1. Push code to GitHub
2. Connect to Render/Fly.io
3. Configure environment variables
4. Deploy with automatic builds

### Self-Hosted
- Use Docker Compose for full-stack deployment
- Configure reverse proxy with Nginx
- Set up SSL certificates
- Monitor with logging and analytics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions

## 🎯 Roadmap

- [ ] Google Calendar integration
- [ ] Mobile app (React Native)
- [ ] Advanced recurring event patterns
- [ ] Calendar import/export
- [ ] Email notifications
- [ ] Team workspace features
- [ ] Advanced permissions system
- [ ] Calendar themes and customization

---

**Built with ❤️ by the Calendar App Team**
