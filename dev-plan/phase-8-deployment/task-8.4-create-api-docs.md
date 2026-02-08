# Task 8.4: Create API Documentation

## Task Metadata

| Property | Value |
|----------|-------|
| **Task ID** | 8.4 |
| **Task Name** | Create API Documentation |
| **Phase** | Phase 8: Deployment & Documentation |
| **Estimated Time** | 3-4 hours |
| **Priority** | High |
| **Status** | Not Started |
| **Dependencies** | Task 8.2 (Deploy to Vercel) Complete |
| **Assignee** | Lead Developer |

## Overview

Task 8.4 focuses on creating comprehensive API documentation for the Bella Cucina application. This documentation details all API endpoints, their purposes, request/response formats, authentication requirements, error handling, and data models. Well-documented APIs are essential for maintainability, third-party integrations, and future development.

The API documentation will serve as a technical reference for developers working with the backend, integrating with external services, or building additional features. It ensures consistency in API usage and reduces the learning curve for new team members.

## Importance & Impact

### Why This Task Matters

1. **Developer Efficiency**: Reduces time spent understanding API structure
2. **Maintainability**: Makes it easier to modify and extend APIs
3. **Integration**: Enables third-party integrations (mobile apps, external services)
4. **Consistency**: Ensures consistent API patterns across the application
5. **Debugging**: Helps troubleshoot issues with clear request/response examples
6. **Onboarding**: New developers can quickly understand backend functionality

### Impact on Project

- **High Impact**: Essential for long-term maintainability and scalability
- **Developer Value**: Saves hours of code exploration
- **Business Value**: Enables future integrations and extensions
- **Technical Debt Prevention**: Prevents confusion and inconsistent implementations

## Prerequisites

### Required Completed Work

- [x] Task 8.1: Prepare for Deployment complete
- [x] Task 8.2: Deploy to Vercel complete
- [x] All API routes implemented and tested
- [x] Production deployment successful

### Required Knowledge

- Understanding of RESTful API principles
- Knowledge of HTTP methods and status codes
- Familiarity with JSON data format
- Understanding of authentication mechanisms
- Basic knowledge of API documentation standards

### Required Information

- List of all API endpoints
- Request/response schemas for each endpoint
- Authentication mechanisms
- Error response formats
- Database schema structures
- Production API base URL

## Technical Specifications

### Documentation Structure

The API documentation should follow a standard structure:

```markdown
1. API Overview
2. Base URL and Versioning
3. Authentication
4. Common Headers
5. Response Format
6. Error Handling
7. Rate Limiting (if applicable)
8. Endpoints (grouped by resource)
   - Endpoint description
   - HTTP method
   - URL
   - Authentication required
   - Request parameters
   - Request body
   - Response examples
   - Error examples
9. Data Models
10. Status Codes
11. Examples and Use Cases
```

### REST API Principles

The API follows REST conventions:

- **Resources**: Nouns representing entities (reservations, bookings)
- **HTTP Methods**: Standard methods for CRUD operations
  - GET: Retrieve resources
  - POST: Create new resources
  - PUT/PATCH: Update existing resources
  - DELETE: Remove resources
- **Status Codes**: Standard HTTP status codes
- **JSON Format**: All requests and responses use JSON

### Authentication Flow

```
Client Request
     ↓
NextAuth.js Session Check
     ↓
   Valid? ──No──→ 401 Unauthorized
     ↓ Yes
Protected Endpoint
     ↓
Response
```

## Step-by-Step Implementation Guide

### Step 1: Create Documentation File

**Time Estimate**: 5 minutes

#### 1.1 Create Directory and File

```bash
# Navigate to project root
cd /Users/noorragu/Documents/vibe-code-demo

# Create docs directory
mkdir -p docs

# Create API documentation file
touch docs/API.md
```

### Step 2: Write API Overview

**Time Estimate**: 20 minutes

#### 2.1 Add Header and Introduction

```markdown
# Bella Cucina API Documentation

## Overview

The Bella Cucina API provides programmatic access to the restaurant's reservation system, menu management, and administrative functions. This RESTful API uses standard HTTP methods and returns JSON responses.

### Version

**Current Version**: v1
**Last Updated**: March 15, 2024
**Base URL**: `https://bella-cucina.vercel.app/api`

### Key Features

- **Reservation Management**: Create and manage table reservations
- **Contact Form**: Submit customer inquiries
- **Admin Operations**: Full CRUD operations for bookings (authenticated)
- **Real-time Availability**: Check table availability for specific dates/times
- **Secure Authentication**: NextAuth.js-based authentication for admin operations

### Technology Stack

- **Framework**: Next.js 14 API Routes
- **Runtime**: Node.js 18+
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth.js v4
- **Validation**: Zod (if implemented) / Custom validators

### API Characteristics

- **Protocol**: HTTPS only
- **Format**: JSON for all requests and responses
- **Authentication**: Session-based (NextAuth.js)
- **Character Encoding**: UTF-8
- **Date Format**: ISO 8601 (YYYY-MM-DD)
- **Time Format**: 24-hour format (HH:MM)
```

#### 2.2 Add Base URLs

```markdown
## Base URLs

### Production
```
https://bella-cucina.vercel.app/api
```

**Use for**: Live production applications

### Development
```
http://localhost:3000/api
```

**Use for**: Local development and testing

### Preview (Vercel)
```
https://bella-cucina-[branch-name]-[hash].vercel.app/api
```

**Use for**: Testing preview deployments

## API Versioning

Currently, the API is version 1 (v1). Future versions will be released as needed.

**Version Strategy**: URL-based versioning (planned for v2+)
- v1: `/api/endpoint`
- v2: `/api/v2/endpoint` (future)

**Backward Compatibility**: Breaking changes will be introduced in new versions only.
```

### Step 3: Document Authentication

**Time Estimate**: 25 minutes

```markdown
## Authentication

The Bella Cucina API uses session-based authentication powered by NextAuth.js. Protected endpoints require a valid session.

### Authentication Flow

1. **Login**: POST credentials to `/api/auth/signin`
2. **Session Cookie**: Receive secure HTTP-only session cookie
3. **Authenticated Requests**: Cookie automatically sent with requests
4. **Logout**: POST to `/api/auth/signout` to end session

### Public vs Protected Endpoints

#### Public Endpoints (No Authentication)
- `POST /api/reservations` - Create reservation
- `POST /api/contact` - Submit contact form

#### Protected Endpoints (Authentication Required)
- `GET /api/bookings` - List all bookings
- `GET /api/bookings/[id]` - Get booking details
- `PUT /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Delete booking

### Login

**Endpoint**: `/api/auth/signin/credentials`
**Method**: POST
**Authentication**: None required

**Request Body**:
```json
{
  "email": "admin@bellacucina.com",
  "password": "YourSecurePassword123!"
}
```

**Success Response** (200 OK):
```json
{
  "url": "/admin",
  "ok": true
}
```

Sets session cookie: `next-auth.session-token` (HTTP-only, Secure, SameSite)

**Error Response** (401 Unauthorized):
```json
{
  "error": "Invalid credentials"
}
```

### Logout

**Endpoint**: `/api/auth/signout`
**Method**: POST
**Authentication**: Session required

**Response** (200 OK):
```json
{
  "url": "/"
}
```

Clears session cookie.

### Session Verification

**Endpoint**: `/api/auth/session`
**Method**: GET
**Authentication**: None required

**Response with active session**:
```json
{
  "user": {
    "email": "admin@bellacucina.com",
    "name": "Admin User",
    "role": "admin"
  },
  "expires": "2024-04-15T10:30:00.000Z"
}
```

**Response without session**:
```json
{}
```

### Authentication Errors

| Status Code | Error | Description |
|-------------|-------|-------------|
| 401 | Unauthorized | No valid session found |
| 403 | Forbidden | Valid session but insufficient permissions |
| 401 | Invalid credentials | Login failed due to incorrect email/password |

### Testing Authentication

#### Using cURL
```bash
# Login and save cookies
curl -X POST https://bella-cucina.vercel.app/api/auth/signin/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bellacucina.com","password":"password"}' \
  -c cookies.txt

# Use session for authenticated request
curl https://bella-cucina.vercel.app/api/bookings \
  -b cookies.txt
```

#### Using JavaScript
```javascript
// Login
const response = await fetch('/api/auth/signin/credentials', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@bellacucina.com',
    password: 'password'
  }),
  credentials: 'include' // Important: include cookies
});

// Authenticated request
const bookings = await fetch('/api/bookings', {
  credentials: 'include' // Include session cookie
});
```

### Security Best Practices

1. **HTTPS Only**: All authentication requests must use HTTPS in production
2. **Secure Cookies**: Session cookies are HTTP-only, Secure, and SameSite
3. **Session Expiry**: Sessions expire after 30 days of inactivity
4. **Password Security**: Passwords hashed with bcrypt (10 rounds)
5. **CSRF Protection**: Built into NextAuth.js
```

### Step 4: Document Common Patterns

**Time Estimate**: 20 minutes

```markdown
## Request Format

### Headers

All requests should include:

```http
Content-Type: application/json
Accept: application/json
```

For authenticated requests (automatic with session cookie):
```http
Cookie: next-auth.session-token=<session-token>
```

### Query Parameters

Query parameters for filtering and pagination:

```
GET /api/bookings?status=confirmed&date=2024-03-20&page=1&limit=10
```

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| status | string | Filter by booking status | `pending`, `confirmed` |
| date | string | Filter by date (ISO format) | `2024-03-20` |
| page | number | Page number for pagination | `1` |
| limit | number | Results per page | `10` |
| sort | string | Sort field and order | `date:asc`, `createdAt:desc` |

### Request Body

POST and PUT requests require JSON body:

```json
{
  "field": "value",
  "nested": {
    "field": "value"
  }
}
```

## Response Format

### Success Response

All successful responses follow this structure:

```json
{
  "success": true,
  "data": { },
  "message": "Operation completed successfully"
}
```

**Fields**:
- `success` (boolean): Always `true` for successful responses
- `data` (object/array): The requested data or created resource
- `message` (string, optional): Human-readable success message

### Error Response

All error responses follow this structure:

```json
{
  "success": false,
  "error": "Error message",
  "details": []
}
```

**Fields**:
- `success` (boolean): Always `false` for error responses
- `error` (string): Human-readable error message
- `details` (array, optional): Detailed error information (e.g., validation errors)

### Pagination Response

List endpoints that support pagination include metadata:

```json
{
  "success": true,
  "data": [ ],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10,
    "limit": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "phone",
      "message": "Phone number is required"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid request data, validation errors |
| 401 | Unauthorized | Authentication required but not provided |
| 403 | Forbidden | Authenticated but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource conflict (e.g., duplicate booking) |
| 422 | Unprocessable Entity | Valid JSON but semantically invalid |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error occurred |
| 503 | Service Unavailable | Database or external service unavailable |

### Common Error Examples

#### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format",
      "code": "INVALID_EMAIL"
    }
  ]
}
```

#### Authentication Error (401)
```json
{
  "success": false,
  "error": "Authentication required",
  "message": "Please log in to access this resource"
}
```

#### Not Found Error (404)
```json
{
  "success": false,
  "error": "Resource not found",
  "message": "Booking with ID '65f1a2b3c4d5e6f7g8h9i0j1' not found"
}
```

#### Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred. Please try again later."
}
```

## Rate Limiting

**Current Status**: Not implemented

**Planned Implementation**:
- Public endpoints: 100 requests per 15 minutes per IP
- Authenticated endpoints: 1000 requests per 15 minutes per user

Rate limit headers (when implemented):
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1647360000
```
```

### Step 5: Document All Endpoints

**Time Estimate**: 60 minutes

```markdown
## API Endpoints

### Reservations

#### Create Reservation

Create a new table reservation.

**Endpoint**: `POST /api/reservations`
**Authentication**: None required (Public)

##### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "date": "2024-03-20",
  "time": "19:00",
  "guests": 4,
  "specialRequests": "Window seat if possible"
}
```

##### Request Parameters

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| name | string | Yes | 2-100 chars | Customer full name |
| email | string | Yes | Valid email | Customer email address |
| phone | string | Yes | Valid phone | Customer phone number |
| date | string | Yes | ISO date (YYYY-MM-DD) | Reservation date |
| time | string | Yes | HH:MM (24-hour) | Reservation time |
| guests | number | Yes | 1-20 | Number of guests |
| specialRequests | string | No | Max 500 chars | Special requests or notes |

##### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Reservation created successfully",
  "data": {
    "reservation": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "date": "2024-03-20",
      "time": "19:00",
      "guests": 4,
      "status": "pending",
      "specialRequests": "Window seat if possible",
      "createdAt": "2024-03-15T10:30:00.000Z",
      "updatedAt": "2024-03-15T10:30:00.000Z"
    }
  }
}
```

##### Error Responses

**Validation Error (400)**:
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "guests",
      "message": "Number of guests must be between 1 and 20"
    }
  ]
}
```

**Date in Past (400)**:
```json
{
  "success": false,
  "error": "Invalid reservation date",
  "message": "Reservation date cannot be in the past"
}
```

**Time Slot Unavailable (409)**:
```json
{
  "success": false,
  "error": "Time slot unavailable",
  "message": "The selected time slot is already fully booked. Please choose another time."
}
```

##### cURL Example

```bash
curl -X POST https://bella-cucina.vercel.app/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "date": "2024-03-20",
    "time": "19:00",
    "guests": 4,
    "specialRequests": "Window seat if possible"
  }'
```

##### JavaScript Example

```javascript
const createReservation = async (data) => {
  try {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return result.data.reservation;
  } catch (error) {
    console.error('Reservation failed:', error);
    throw error;
  }
};

// Usage
const reservation = await createReservation({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  date: '2024-03-20',
  time: '19:00',
  guests: 4,
  specialRequests: 'Window seat if possible'
});
```

---

### Contact

#### Submit Contact Form

Submit a customer inquiry or message.

**Endpoint**: `POST /api/contact`
**Authentication**: None required (Public)

##### Request Body

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Catering Inquiry",
  "message": "I'm interested in catering services for a corporate event with 50 people. Please provide information about your catering packages and pricing."
}
```

##### Request Parameters

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| name | string | Yes | 2-100 chars | Sender's full name |
| email | string | Yes | Valid email | Sender's email address |
| subject | string | Yes | 5-200 chars | Message subject |
| message | string | Yes | 10-1000 chars | Message content |

##### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Message sent successfully. We'll get back to you within 24 hours."
}
```

##### Error Responses

**Validation Error (400)**:
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "message",
      "message": "Message must be at least 10 characters long"
    }
  ]
}
```

##### cURL Example

```bash
curl -X POST https://bella-cucina.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "subject": "Catering Inquiry",
    "message": "I am interested in your catering services..."
  }'
```

---

### Bookings (Admin Only)

All booking endpoints require authentication.

#### List All Bookings

Retrieve a list of all reservations with optional filtering.

**Endpoint**: `GET /api/bookings`
**Authentication**: Required

##### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| status | string | No | Filter by status | `pending`, `confirmed`, `completed`, `cancelled` |
| date | string | No | Filter by date | `2024-03-20` |
| startDate | string | No | Filter from date | `2024-03-01` |
| endDate | string | No | Filter to date | `2024-03-31` |
| search | string | No | Search by name, email, phone | `john` |
| page | number | No | Page number (default: 1) | `1` |
| limit | number | No | Results per page (default: 10, max: 100) | `20` |
| sort | string | No | Sort field and order | `date:asc`, `createdAt:desc` |

##### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "date": "2024-03-20",
        "time": "19:00",
        "guests": 4,
        "status": "confirmed",
        "specialRequests": "Window seat if possible",
        "createdAt": "2024-03-15T10:30:00.000Z",
        "updatedAt": "2024-03-15T11:00:00.000Z"
      },
      {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+1234567891",
        "date": "2024-03-20",
        "time": "20:00",
        "guests": 2,
        "status": "pending",
        "specialRequests": "",
        "createdAt": "2024-03-15T12:00:00.000Z",
        "updatedAt": "2024-03-15T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "pages": 5,
      "limit": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

##### cURL Example

```bash
# List all bookings
curl https://bella-cucina.vercel.app/api/bookings \
  -b cookies.txt

# Filter by status and date
curl "https://bella-cucina.vercel.app/api/bookings?status=confirmed&date=2024-03-20" \
  -b cookies.txt

# Search and paginate
curl "https://bella-cucina.vercel.app/api/bookings?search=john&page=1&limit=20" \
  -b cookies.txt
```

#### Get Single Booking

Retrieve detailed information about a specific booking.

**Endpoint**: `GET /api/bookings/[id]`
**Authentication**: Required

##### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Booking ID (MongoDB ObjectId) |

##### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "booking": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "date": "2024-03-20",
      "time": "19:00",
      "guests": 4,
      "status": "confirmed",
      "specialRequests": "Window seat if possible",
      "createdAt": "2024-03-15T10:30:00.000Z",
      "updatedAt": "2024-03-15T11:00:00.000Z"
    }
  }
}
```

##### Error Responses

**Not Found (404)**:
```json
{
  "success": false,
  "error": "Booking not found",
  "message": "No booking found with ID '65f1a2b3c4d5e6f7g8h9i0j1'"
}
```

**Invalid ID Format (400)**:
```json
{
  "success": false,
  "error": "Invalid booking ID",
  "message": "The provided ID is not a valid MongoDB ObjectId"
}
```

##### cURL Example

```bash
curl https://bella-cucina.vercel.app/api/bookings/65f1a2b3c4d5e6f7g8h9i0j1 \
  -b cookies.txt
```

#### Update Booking

Update an existing booking (typically used to change status).

**Endpoint**: `PUT /api/bookings/[id]`
**Authentication**: Required

##### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Booking ID (MongoDB ObjectId) |

##### Request Body

```json
{
  "status": "confirmed"
}
```

##### Request Parameters

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| status | string | No | One of: pending, confirmed, completed, cancelled | Booking status |
| specialRequests | string | No | Max 500 chars | Update special requests |

##### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Booking updated successfully",
  "data": {
    "booking": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "date": "2024-03-20",
      "time": "19:00",
      "guests": 4,
      "status": "confirmed",
      "specialRequests": "Window seat if possible",
      "createdAt": "2024-03-15T10:30:00.000Z",
      "updatedAt": "2024-03-15T14:30:00.000Z"
    }
  }
}
```

##### Error Responses

**Invalid Status (400)**:
```json
{
  "success": false,
  "error": "Invalid status",
  "message": "Status must be one of: pending, confirmed, completed, cancelled"
}
```

##### cURL Example

```bash
curl -X PUT https://bella-cucina.vercel.app/api/bookings/65f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"status": "confirmed"}'
```

##### JavaScript Example

```javascript
const updateBookingStatus = async (bookingId, status) => {
  const response = await fetch(`/api/bookings/${bookingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
};

// Usage
await updateBookingStatus('65f1a2b3c4d5e6f7g8h9i0j1', 'confirmed');
```

#### Delete Booking

Delete a booking permanently.

**Endpoint**: `DELETE /api/bookings/[id]`
**Authentication**: Required

##### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Booking ID (MongoDB ObjectId) |

##### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Booking deleted successfully"
}
```

##### Error Responses

**Not Found (404)**:
```json
{
  "success": false,
  "error": "Booking not found",
  "message": "No booking found with ID '65f1a2b3c4d5e6f7g8h9i0j1'"
}
```

##### cURL Example

```bash
curl -X DELETE https://bella-cucina.vercel.app/api/bookings/65f1a2b3c4d5e6f7g8h9i0j1 \
  -b cookies.txt
```

---

## Data Models

### Reservation/Booking Model

Represents a table reservation.

```typescript
interface Reservation {
  _id: string;                // MongoDB ObjectId
  name: string;               // Customer name (2-100 chars)
  email: string;              // Customer email (valid format)
  phone: string;              // Customer phone
  date: string;               // Reservation date (ISO format: YYYY-MM-DD)
  time: string;               // Reservation time (24-hour: HH:MM)
  guests: number;             // Number of guests (1-20)
  status: ReservationStatus;  // Booking status
  specialRequests?: string;   // Optional special requests (max 500 chars)
  createdAt: string;          // ISO timestamp
  updatedAt: string;          // ISO timestamp
}
```

#### Reservation Status

```typescript
enum ReservationStatus {
  PENDING = 'pending',        // Awaiting confirmation
  CONFIRMED = 'confirmed',    // Confirmed by staff
  COMPLETED = 'completed',    // Customer showed up, service completed
  CANCELLED = 'cancelled'     // Cancelled by customer or staff
}
```

#### Status Transitions

```
pending → confirmed → completed
pending → cancelled
confirmed → cancelled
confirmed → completed
```

### User Model

Represents an admin user.

```typescript
interface User {
  _id: string;           // MongoDB ObjectId
  email: string;         // User email (unique)
  password: string;      // Hashed password (bcrypt)
  name: string;          // User full name
  role: UserRole;        // User role
  createdAt: string;     // ISO timestamp
  updatedAt: string;     // ISO timestamp
}
```

#### User Roles

```typescript
enum UserRole {
  ADMIN = 'admin',       // Full access to all features
  STAFF = 'staff'        // Limited access (future feature)
}
```

### Contact Message Model

Represents a contact form submission.

```typescript
interface ContactMessage {
  _id: string;           // MongoDB ObjectId
  name: string;          // Sender name
  email: string;         // Sender email
  subject: string;       // Message subject
  message: string;       // Message content
  createdAt: string;     // ISO timestamp
}
```

## Validation Rules

### Email Validation
- Format: RFC 5322 compliant
- Max length: 254 characters
- Example: `user@example.com`

### Phone Validation
- Format: International format recommended
- Patterns accepted: `+1234567890`, `(123) 456-7890`, `123-456-7890`
- Min length: 10 digits
- Max length: 15 characters

### Date Validation
- Format: ISO 8601 (YYYY-MM-DD)
- Must be present or future date
- Restaurant closed dates checked (if implemented)

### Time Validation
- Format: 24-hour (HH:MM)
- Restaurant hours: 11:00 - 22:00
- Time slots: Every 30 minutes

### Name Validation
- Min length: 2 characters
- Max length: 100 characters
- Allowed: Letters, spaces, hyphens, apostrophes
- Example: `John O'Brien-Smith`

## Examples and Use Cases

### Use Case 1: Customer Makes Reservation

```javascript
// Step 1: Customer fills out reservation form
const formData = {
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  phone: '+1-555-123-4567',
  date: '2024-04-01',
  time: '19:00',
  guests: 2,
  specialRequests: 'Celebrating anniversary'
};

// Step 2: Submit reservation
const response = await fetch('/api/reservations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});

// Step 3: Handle response
const result = await response.json();

if (result.success) {
  // Show confirmation message
  console.log('Reservation created:', result.data.reservation);
  // Redirect to confirmation page
  window.location.href = '/reservations/confirmation';
} else {
  // Show error message
  console.error('Reservation failed:', result.error);
  alert(result.error);
}
```

### Use Case 2: Admin Reviews and Confirms Bookings

```javascript
// Step 1: Admin logs in
await fetch('/api/auth/signin/credentials', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@bellacucina.com',
    password: 'securePassword'
  }),
  credentials: 'include'
});

// Step 2: Fetch pending bookings
const bookingsResponse = await fetch('/api/bookings?status=pending', {
  credentials: 'include'
});
const bookingsData = await bookingsResponse.json();
const pendingBookings = bookingsData.data.bookings;

// Step 3: Confirm each booking
for (const booking of pendingBookings) {
  await fetch(`/api/bookings/${booking._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status: 'confirmed' })
  });
}

console.log('All pending bookings confirmed');
```

### Use Case 3: Check Today's Reservations

```javascript
// Get today's date
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// Fetch today's bookings
const response = await fetch(`/api/bookings?date=${today}&status=confirmed`, {
  credentials: 'include'
});

const data = await response.json();
const todaysBookings = data.data.bookings;

console.log(`${todaysBookings.length} confirmed reservations for today`);

// Calculate total guests
const totalGuests = todaysBookings.reduce((sum, booking) => {
  return sum + booking.guests;
}, 0);

console.log(`Total guests expected: ${totalGuests}`);
```

## Best Practices

### API Consumption

1. **Always Check Response Status**:
   ```javascript
   if (!response.ok) {
     const error = await response.json();
     throw new Error(error.error);
   }
   ```

2. **Include Credentials for Authenticated Requests**:
   ```javascript
   fetch('/api/bookings', {
     credentials: 'include' // Include session cookie
   });
   ```

3. **Handle Errors Gracefully**:
   ```javascript
   try {
     const result = await apiCall();
   } catch (error) {
     console.error('API Error:', error);
     // Show user-friendly error message
   }
   ```

4. **Validate Data Before Sending**:
   ```javascript
   if (!isValidEmail(email)) {
     throw new Error('Invalid email format');
   }
   ```

### Security Considerations

1. **Never Expose Sensitive Data**: Don't log passwords or tokens
2. **Validate All Input**: Server-side validation is essential
3. **Use HTTPS**: All API calls in production must use HTTPS
4. **Rate Limiting**: Implement to prevent abuse (planned)
5. **Session Security**: Don't share session cookies

### Performance Tips

1. **Pagination**: Use pagination for large datasets
2. **Filtering**: Filter on server-side, not client-side
3. **Caching**: Cache static data where appropriate
4. **Batch Operations**: Group related operations when possible

## Testing the API

### Using cURL

```bash
# Test reservation creation
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -d @reservation.json

# Test with inline data
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"+1234567890","date":"2024-04-01","time":"19:00","guests":2}'
```

### Using Postman

1. Import API collection (if available)
2. Set base URL: `http://localhost:3000/api`
3. For authenticated requests:
   - First POST to `/auth/signin/credentials`
   - Cookie will be automatically saved
   - Subsequent requests will include cookie

### Using JavaScript/TypeScript

Create an API client:

```typescript
class BellaCucinaAPI {
  private baseURL: string;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  }

  // Reservations
  async createReservation(data: ReservationData) {
    return this.request('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Bookings (Admin)
  async getBookings(params?: BookingParams) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/bookings?${query}`);
  }

  async getBooking(id: string) {
    return this.request(`/bookings/${id}`);
  }

  async updateBooking(id: string, data: Partial<Booking>) {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBooking(id: string) {
    return this.request(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }
}

// Usage
const api = new BellaCucinaAPI();
const booking = await api.createReservation({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  date: '2024-04-01',
  time: '19:00',
  guests: 2
});
```

## Changelog

### Version 1.0.0 (March 2024)

**Initial Release**
- Reservation creation endpoint
- Contact form endpoint
- Admin booking management endpoints
- NextAuth.js authentication
- Basic error handling
- Input validation

### Planned Features (Future Versions)

- Real-time availability checking
- SMS notifications
- Email confirmations
- Booking modifications by customers
- Cancellation endpoint
- Payment integration
- Loyalty program API
- Rate limiting
- API versioning

## Support

### Getting Help

- **Documentation**: This file and project README
- **GitHub Issues**: [Report bugs or request features](https://github.com/username/bella-cucina/issues)
- **Email**: developer@bellacucina.com
- **Discord**: [Join our community](https://discord.gg/bellacucina)

### Reporting Issues

When reporting API issues, please include:
1. Endpoint URL
2. Request method and body
3. Expected behavior
4. Actual behavior
5. Error messages
6. Environment (development/production)

---

**API Documentation Version**: 1.0.0
**Last Updated**: March 15, 2024
**Maintained By**: Bella Cucina Development Team
```

### Step 6: Review and Finalize

**Time Estimate**: 15 minutes

#### 6.1 Review Checklist

- [ ] All endpoints documented
- [ ] Request/response examples provided
- [ ] Authentication clearly explained
- [ ] Error responses documented
- [ ] Data models defined
- [ ] Validation rules specified
- [ ] Use cases provided
- [ ] Code examples tested
- [ ] No sensitive information exposed
- [ ] Professional formatting

#### 6.2 Test Documentation

1. Follow examples to verify they work
2. Check all cURL commands
3. Verify JavaScript examples compile
4. Test API endpoints match documentation

#### 6.3 Commit Documentation

```bash
# Stage API documentation
git add docs/API.md

# Commit
git commit -m "docs: Add comprehensive API documentation

- All endpoints documented with examples
- Authentication flow explained
- Data models and validation rules
- Error handling and status codes
- cURL and JavaScript examples
- Use cases and best practices"

# Push
git push origin main
```

## Acceptance Criteria

### Documentation Quality
- [ ] All API endpoints documented
- [ ] Authentication process explained
- [ ] Request/response formats specified
- [ ] Error handling documented
- [ ] Data models defined
- [ ] Validation rules listed
- [ ] Code examples provided
- [ ] Use cases included

### Technical Accuracy
- [ ] All endpoints tested and verified
- [ ] Examples return expected results
- [ ] Status codes correct
- [ ] Data types accurate
- [ ] Validation rules match implementation

### Completeness
- [ ] Public endpoints documented
- [ ] Protected endpoints documented
- [ ] Query parameters explained
- [ ] Error responses covered
- [ ] Best practices included
- [ ] Testing strategies provided

### Usability
- [ ] Clear and concise language
- [ ] Logical organization
- [ ] Easy to navigate
- [ ] Searchable headings
- [ ] Comprehensive examples
- [ ] Developer-friendly format

## Common Issues & Solutions

### Issue 1: API Changes Not Reflected in Documentation

**Problem**: Documentation becomes outdated as API evolves.

**Solutions**:
- Update documentation with each API change
- Include documentation in pull request reviews
- Set up automated API documentation generation
- Regular documentation audits

### Issue 2: Examples Don't Work

**Problem**: Code examples fail when developers try them.

**Solutions**:
- Test all examples before publishing
- Keep examples simple and focused
- Include error handling in examples
- Use realistic data in examples

### Issue 3: Missing Edge Cases

**Problem**: Documentation doesn't cover all scenarios.

**Solutions**:
- Document error responses
- Include edge cases
- Add troubleshooting section
- Provide FAQ

## Related Tasks

- **Task 8.2**: Deploy to Vercel (provides production API URL)
- **Task 8.3**: Create Project README (may link to API documentation)
- **Task 8.5**: Testing & Bug Fixes (use API documentation for testing)

## Resources

### Documentation Standards
- [OpenAPI Specification](https://swagger.io/specification/)
- [API Design Best Practices](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design)
- [REST API Tutorial](https://restfulapi.net/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [Swagger](https://swagger.io/) - API documentation framework
- [Insomnia](https://insomnia.rest/) - API client
- [httpie](https://httpie.io/) - Modern cURL alternative

### References
- [HTTP Status Codes](https://httpstatuses.com/)
- [JSON Schema](https://json-schema.org/)
- [REST API Naming Conventions](https://restfulapi.net/resource-naming/)

## Completion Checklist

- [ ] API.md file created in docs/ directory
- [ ] All endpoints documented
- [ ] Authentication explained
- [ ] Examples provided and tested
- [ ] Data models defined
- [ ] Error handling documented
- [ ] Validation rules specified
- [ ] Use cases included
- [ ] No sensitive information exposed
- [ ] Committed to Git
- [ ] Team reviewed

**Estimated completion time**: 3-4 hours
**Next task**: Task 8.5 - Testing & Bug Fixes
