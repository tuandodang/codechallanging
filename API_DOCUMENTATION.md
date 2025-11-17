## API Documentation - Coding Challenge Platform

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

---

## 📍 Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "data": {
    "userId": "65f1234567890abcdef12345",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

---

### Login
**POST** `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65f1234567890abcdef12345",
      "email": "user@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "role": "participant",
      "avatar": null
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

### Refresh Token
**POST** `/auth/refresh`

Get new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Verify Email
**GET** `/auth/verify-email/:token`

Verify email address using token from email.

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### Forgot Password
**POST** `/auth/forgot-password`

Request password reset link.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

---

### Reset Password
**POST** `/auth/reset-password/:token`

Reset password using token from email.

**Request Body:**
```json
{
  "password": "NewSecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

### Get Current User
**GET** `/auth/me`

Get authenticated user's information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef12345",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "role": "participant",
    "status": "active",
    "emailVerified": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 👤 User Management Endpoints

### Get All Users
**GET** `/users`

Get paginated list of users (Admin/Organizer only).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by username, email, or name
- `sort` (optional): Sort field (default: createdAt)
- `order` (optional): asc or desc (default: desc)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65f1234567890abcdef12345",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "participant",
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### Get User By ID
**GET** `/users/:id`

Get user by ID.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef12345",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "participant",
    "bio": "Software developer passionate about coding",
    "skills": ["JavaScript", "Python", "React"],
    "githubUrl": "https://github.com/johndoe"
  }
}
```

---

### Update User
**PUT** `/users/:id`

Update user profile (own profile or admin).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio",
  "skills": ["JavaScript", "TypeScript", "Node.js"],
  "githubUrl": "https://github.com/johndoe",
  "linkedinUrl": "https://linkedin.com/in/johndoe"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": { /* updated user object */ }
}
```

---

### Get User Statistics
**GET** `/users/:id/stats`

Get user statistics (submissions, events, etc.).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65f1234567890abcdef12345",
      "username": "johndoe",
      "fullName": "John Doe",
      "avatar": null
    },
    "stats": {
      "eventsParticipated": 5,
      "totalSubmissions": 42,
      "acceptedSubmissions": 30,
      "problemsCreated": 0,
      "successRate": 71
    }
  }
}
```

---

### Change Password
**POST** `/users/:id/change-password`

Change user password (own account only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewSecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 🎯 Event Management Endpoints

### Get All Events
**GET** `/events`

Get paginated list of events.

**Query Parameters:**
- `page`, `limit`, `sort`, `order` (same as users)
- `search`: Search in title/description
- `filter[type]`: Filter by event type
- `filter[status]`: Filter by status
- `filter[organizer]`: Filter by organizer ID

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65f1234567890abcdef12345",
      "title": "Summer Coding Challenge 2024",
      "description": "Annual coding competition",
      "type": "coding_challenge",
      "status": "published",
      "visibility": "public",
      "startDate": "2024-07-01T00:00:00.000Z",
      "endDate": "2024-07-15T23:59:59.000Z",
      "maxParticipants": 100,
      "currentParticipants": 45,
      "organizer": {
        "username": "admin",
        "firstName": "Admin",
        "lastName": "User"
      },
      "problems": [
        {
          "title": "Two Sum Problem",
          "difficulty": "easy"
        }
      ]
    }
  ],
  "pagination": { /* pagination info */ }
}
```

---

### Create Event
**POST** `/events`

Create a new event (Organizer/Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Winter Hackathon 2024",
  "description": "Build innovative solutions in 48 hours",
  "type": "hackathon",
  "visibility": "public",
  "startDate": "2024-12-01T00:00:00.000Z",
  "endDate": "2024-12-03T23:59:59.000Z",
  "registrationStartDate": "2024-11-01T00:00:00.000Z",
  "registrationEndDate": "2024-11-30T23:59:59.000Z",
  "maxParticipants": 200,
  "isTeamBased": true,
  "minTeamSize": 2,
  "maxTeamSize": 4,
  "prizes": [
    {
      "position": 1,
      "title": "First Place",
      "amount": 5000,
      "currency": "USD"
    }
  ],
  "tags": ["web", "mobile", "ai"]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": { /* created event */ }
}
```

---

### Register for Event
**POST** `/events/:id/register`

Register for an event.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Successfully registered for event",
  "data": { /* event with updated participants */ }
}
```

---

### Get Event Participants
**GET** `/events/:id/participants`

Get list of event participants.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 45,
    "participants": [
      {
        "user": {
          "username": "johndoe",
          "firstName": "John",
          "lastName": "Doe"
        },
        "registeredAt": "2024-01-15T10:30:00.000Z",
        "status": "confirmed"
      }
    ]
  }
}
```

---

## 🧩 Problem Management Endpoints

### Get All Problems
**GET** `/problems`

Get paginated list of problems.

**Query Parameters:**
- `page`, `limit`, `sort`, `order`
- `search`: Search in title/description
- `filter[difficulty]`: easy, medium, hard, expert
- `filter[category]`: Problem category
- `filter[tags]`: Array of tags

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65f1234567890abcdef12345",
      "title": "Two Sum",
      "slug": "two-sum",
      "description": "Find two numbers that add up to target",
      "difficulty": "easy",
      "category": "Arrays",
      "tags": ["array", "hash-table"],
      "timeLimit": 90,
      "totalSubmissions": 1523,
      "successfulSubmissions": 892,
      "successRate": 59,
      "likes": 234,
      "dislikes": 12
    }
  ],
  "pagination": { /* pagination info */ }
}
```

---

### Get Problem By ID or Slug
**GET** `/problems/:idOrSlug`

Get detailed problem information.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef12345",
    "title": "Two Sum",
    "slug": "two-sum",
    "description": "Given an array of integers...",
    "difficulty": "easy",
    "category": "Arrays",
    "tags": ["array", "hash-table"],
    "timeLimit": 90,
    "memoryLimit": 128,
    "inputFormat": "First line: array size...",
    "outputFormat": "Two integers...",
    "constraints": "1 <= n <= 10^4",
    "examples": [
      {
        "input": "[2,7,11,15]\n9",
        "output": "[0,1]",
        "explanation": "nums[0] + nums[1] = 2 + 7 = 9"
      }
    ],
    "hints": ["Try using a hash table"],
    "languages": ["javascript", "python", "java", "csharp"],
    "starterCode": [
      {
        "language": "javascript",
        "code": "function twoSum(nums, target) {\n  // Your code here\n}"
      }
    ],
    "userSolved": false
  }
}
```

---

### Create Problem
**POST** `/problems`

Create a new problem (Organizer/Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Reverse String",
  "description": "Write a function to reverse a string",
  "difficulty": "easy",
  "category": "Strings",
  "tags": ["string", "two-pointers"],
  "timeLimit": 60,
  "memoryLimit": 128,
  "examples": [
    {
      "input": "hello",
      "output": "olleh",
      "explanation": "Reverse each character"
    }
  ],
  "testCases": [
    {
      "input": "hello",
      "expectedOutput": "olleh",
      "isHidden": false,
      "weight": 1
    },
    {
      "input": "world",
      "expectedOutput": "dlrow",
      "isHidden": true,
      "weight": 1
    }
  ],
  "languages": ["javascript", "python", "java"],
  "starterCode": [
    {
      "language": "javascript",
      "code": "function reverseString(s) {\n  // Your code here\n}"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Problem created successfully",
  "data": { /* created problem */ }
}
```

---

### Submit Solution
**POST** `/problems/:id/submit`

Submit a solution to a problem.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "code": "function twoSum(nums, target) { /* solution */ }",
  "language": "javascript"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Solution submitted successfully",
  "data": {
    "submissionId": "65f1234567890abcdef12345",
    "status": "pending"
  }
}
```

---

### Get Problem Submissions
**GET** `/problems/:id/submissions`

Get submissions for a problem.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65f1234567890abcdef12345",
      "user": {
        "username": "johndoe",
        "firstName": "John",
        "lastName": "Doe"
      },
      "language": "javascript",
      "status": "accepted",
      "executionTime": 45,
      "memoryUsed": 12.5,
      "passedTestCases": 10,
      "totalTestCases": 10,
      "score": 100,
      "submittedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": { /* pagination info */ }
}
```

---

## 🔒 Authorization & Permissions

### User Roles

1. **Participant** (default)
   - View public events and problems
   - Register for events
   - Submit solutions
   - View own submissions

2. **Judge**
   - All participant permissions
   - View all submissions for assigned events

3. **Organizer**
   - All judge permissions
   - Create/manage events
   - Create/manage problems
   - Manage event participants

4. **Admin**
   - Full access to all resources
   - Manage users and roles
   - Delete any content

### Permission System

The platform uses Role-Based Access Control (RBAC). Each endpoint is protected by:
- **Authentication**: Requires valid JWT token
- **Authorization**: Checks user role and specific permissions

Example: To create an event, you need:
- Authentication: `authenticate` middleware
- Permission: `Permission.EVENT_CREATE`

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Optional success message",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "errors": [ /* validation errors if applicable */ ]
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

## 🚨 Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not authenticated) |
| 403 | Forbidden (not authorized) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

---

## 🔄 Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Headers**: Returns `RateLimit-*` headers

---

## 🧪 Testing

Use tools like:
- **Postman**: Import collection (link to collection)
- **cURL**: Command-line testing
- **Insomnia**: API client

Example cURL:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

---

## 📝 Notes

- All dates are in ISO 8601 format
- All times are in UTC
- Passwords must be at least 8 characters with uppercase, lowercase, and number
- Usernames can only contain letters, numbers, hyphens, and underscores
- JWT tokens expire after 7 days (access) and 30 days (refresh)
