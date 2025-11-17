# Coding Challenge Platform - Backend API

A comprehensive backend system for managing coding challenges, events, users, and submissions with authentication, authorization, and role-based access control.

## 🚀 Features

### Core Modules

✅ **User Management**
- User registration and authentication
- Email verification
- Password reset functionality
- User profiles with skills, social links
- User statistics and achievements

✅ **Authentication & Authorization**
- JWT-based authentication
- Access and refresh tokens
- Role-Based Access Control (RBAC)
- Permission-based authorization
- Multiple user roles: Admin, Organizer, Judge, Participant

✅ **Event Management**
- Create and manage coding events
- Multiple event types: Hackathons, Contests, Challenges, Workshops
- Event registration and participant management
- Team-based events support
- Public/Private/Invite-only visibility
- Prize management
- Event judges and organizers

✅ **Problem Management**
- Create and manage coding problems
- Multiple difficulty levels
- Test cases (visible and hidden)
- Multiple language support
- Starter code templates
- Problem categories and tags
- Success rate tracking

✅ **Submission System**
- Submit solutions in multiple languages
- Automated test case evaluation (placeholder)
- Submission history and statistics
- Real-time status updates
- Performance metrics (execution time, memory)

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs
- **Logging**: Morgan
- **Testing**: Jest (configured)

## 📋 Prerequisites

- Node.js 20.x or higher
- MongoDB 5.x or higher
- npm or yarn
- TypeScript knowledge

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd codechallanging
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/coding_challenge_platform

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=30d

# Security
BCRYPT_ROUNDS=10

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@codingchallenge.com
```

### 4. Start MongoDB

Make sure MongoDB is running:

```bash
# Using MongoDB service
sudo service mongod start

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Run the application

```bash
# Development mode with auto-reload
npm run dev

# Build TypeScript
npm run build

# Production mode
npm start
```

The server will start at `http://localhost:3000`

## 📁 Project Structure

```
codechallanging/
├── src/
│   ├── config/
│   │   ├── database.ts          # MongoDB connection
│   │   └── permissions.ts       # RBAC configuration
│   │
│   ├── models/
│   │   ├── User.ts              # User model
│   │   ├── Event.ts             # Event model
│   │   ├── Problem.ts           # Problem model
│   │   ├── Submission.ts        # Submission model
│   │   ├── Team.ts              # Team model
│   │   └── Notification.ts      # Notification model
│   │
│   ├── controllers/
│   │   ├── authController.ts    # Authentication logic
│   │   ├── userController.ts    # User management
│   │   ├── eventController.ts   # Event management
│   │   └── problemController.ts # Problem management
│   │
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   ├── authorize.ts         # Permission checking
│   │   ├── errorHandler.ts     # Error handling
│   │   └── validate.ts          # Request validation
│   │
│   ├── routes/
│   │   ├── authRoutes.ts        # Auth endpoints
│   │   ├── userRoutes.ts        # User endpoints
│   │   ├── eventRoutes.ts       # Event endpoints
│   │   └── problemRoutes.ts     # Problem endpoints
│   │
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   │
│   ├── utils/                   # Utility functions
│   │
│   └── app.ts                   # Express app entry point
│
├── templates/                    # Challenge templates
├── .env.example                 # Environment variables template
├── package.json
├── tsconfig.json
├── API_DOCUMENTATION.md         # Complete API docs
└── README.md                    # This file
```

## 🔐 Authentication Flow

### 1. Register
```bash
POST /api/v1/auth/register
```

### 2. Verify Email
```bash
GET /api/v1/auth/verify-email/:token
```

### 3. Login
```bash
POST /api/v1/auth/login
```
Returns access token and refresh token.

### 4. Use Access Token
```bash
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

### 5. Refresh Access Token
```bash
POST /api/v1/auth/refresh
{ "refreshToken": "<refresh_token>" }
```

## 👥 User Roles & Permissions

### Participant (Default)
- View public events and problems
- Register for events
- Submit solutions
- View own submissions

### Judge
- All participant permissions
- View all submissions for assigned events
- Evaluate submissions

### Organizer
- All judge permissions
- Create and manage events
- Create and manage problems
- Manage event participants

### Admin
- Full access to all resources
- Manage users and roles
- System administration

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/verify-email/:token` - Verify email
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password/:token` - Reset password
- `GET /api/v1/auth/me` - Get current user

### Users
- `GET /api/v1/users` - Get all users (Admin)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin)
- `GET /api/v1/users/:id/stats` - Get user statistics
- `POST /api/v1/users/:id/change-password` - Change password

### Events
- `GET /api/v1/events` - Get all events
- `GET /api/v1/events/:id` - Get event details
- `POST /api/v1/events` - Create event (Organizer)
- `PUT /api/v1/events/:id` - Update event
- `DELETE /api/v1/events/:id` - Delete event
- `POST /api/v1/events/:id/register` - Register for event
- `POST /api/v1/events/:id/unregister` - Unregister from event
- `GET /api/v1/events/:id/participants` - Get participants

### Problems
- `GET /api/v1/problems` - Get all problems
- `GET /api/v1/problems/:idOrSlug` - Get problem details
- `POST /api/v1/problems` - Create problem (Organizer)
- `PUT /api/v1/problems/:id` - Update problem
- `DELETE /api/v1/problems/:id` - Delete problem
- `POST /api/v1/problems/:id/submit` - Submit solution
- `GET /api/v1/problems/:id/submissions` - Get submissions
- `GET /api/v1/problems/:id/stats` - Get problem stats

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API documentation.

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse (100 req/15min per IP)
- **Password Hashing**: bcrypt with configurable rounds
- **JWT**: Secure token-based authentication
- **Input Validation**: express-validator
- **SQL Injection Protection**: Mongoose ODM
- **XSS Protection**: Helmet and sanitization

## 📊 Database Models

### User
- Authentication credentials
- Profile information
- Role and status
- Social links

### Event
- Event details and scheduling
- Participant management
- Team support
- Prizes and judges

### Problem
- Problem description
- Test cases (visible/hidden)
- Language support
- Statistics tracking

### Submission
- Code and language
- Execution results
- Test case results
- Performance metrics

### Team
- Team members
- Event association
- Invite codes

### Notification
- User notifications
- Event updates
- System announcements

## 🚧 Development

### Code Style

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Database Migrations

Currently using Mongoose for schema management. For production, consider:
- Database versioning
- Migration scripts
- Seed data

### Adding New Features

1. Create model in `src/models/`
2. Create controller in `src/controllers/`
3. Create routes in `src/routes/`
4. Add to `src/app.ts`
5. Update TypeScript types in `src/types/`
6. Add tests
7. Update API documentation

## 🐛 Troubleshooting

### MongoDB Connection Failed

```bash
# Check MongoDB status
sudo service mongod status

# Start MongoDB
sudo service mongod start
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change PORT in .env file
```

### JWT Token Errors

- Check `JWT_SECRET` in `.env`
- Ensure tokens haven't expired
- Verify token format in Authorization header

## 📈 Performance Optimization

- **Database Indexing**: All models have appropriate indexes
- **Pagination**: Implemented for all list endpoints
- **Query Optimization**: Use select() to limit fields
- **Caching**: Consider Redis for session management
- **Compression**: gzip compression enabled

## 🔄 Future Enhancements

- [ ] Code execution service integration (Judge0, Piston)
- [ ] Real-time leaderboards (WebSocket)
- [ ] Email notifications (nodemailer setup)
- [ ] File upload for avatars
- [ ] Advanced analytics dashboard
- [ ] Social features (follow, like, comment)
- [ ] Contest rankings algorithm
- [ ] Code plagiarism detection
- [ ] Multi-language support (i18n)
- [ ] GraphQL API option

## 📝 Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | development |
| `PORT` | Server port | 3000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/coding_challenge_platform |
| `JWT_SECRET` | JWT secret key | (required) |
| `JWT_EXPIRES_IN` | Access token expiry | 7d |
| `JWT_REFRESH_SECRET` | Refresh token secret | (required) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | 30d |
| `BCRYPT_ROUNDS` | Password hash rounds | 10 |
| `CORS_ORIGIN` | Allowed CORS origins | * |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Update documentation
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@codingchallenge.com
- Documentation: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🙏 Acknowledgments

- Express.js community
- Mongoose ODM
- TypeScript team
- All contributors

---

**Built with ❤️ for coding enthusiasts**
