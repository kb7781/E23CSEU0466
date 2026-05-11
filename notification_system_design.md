# Notification System Design

## Overview
This project is a campus notification system designed to fetch, prioritize, and display notifications for students in a clean and responsive dashboard interface.

The system consists of two major components:

1. Frontend Notification Application (Next.js + React + Material UI)
2. Logging Middleware (Node.js + Axios)

---

## Architecture

User Interface (Frontend)
        |
        v
Notification API Server
(http://4.224.186.213/evaluation-service/notifications)
        |
        v
Notification Processing Layer
- Fetch notifications
- Remove duplicates
- Sort by priority
- Filter by type
- Search notifications
- Track read/unread state
        |
        v
Dashboard UI Rendering

Separate Logging Flow:
Frontend / Middleware
        |
        v
Logging Middleware
        |
        v
Logging API
(http://4.224.186.213/evaluation-service/logs)

---

## Frontend Design

### Technology Stack
- Next.js
- React
- TypeScript
- Material UI
- Axios

### Features
- Fetch notifications from API
- Authorization using bearer token
- Responsive dashboard UI
- Priority inbox for important notifications
- Category filtering
- Search functionality
- Read/unread tracking using localStorage
- Statistics dashboard
- Mobile responsive design

### Notification Priority Logic
Priority is assigned as:

- Placement → Highest Priority
- Result → Medium Priority
- Event → Lowest Priority

Notifications are sorted first by priority and then by timestamp.

---

## Duplicate Removal Strategy

Duplicate notifications are removed using:
- Message content
- Notification type

This ensures the user does not see repeated notifications.

---

## Read/Unread Tracking

Read notification IDs are stored in browser localStorage.

This allows:
- Persistence across refreshes
- Fast access
- Simple state management

---

## Logging Middleware Design

### Technology Stack
- Node.js
- Axios

### Purpose
The logging middleware sends structured logs to the evaluation logging service.

### Log Structure
Each log contains:
- stack
- level
- package
- message

Example:

{
  "stack": "frontend",
  "level": "info",
  "package": "component",
  "message": "notifications fetched successfully"
}

---

## Error Handling
The system handles:
- API fetch failures
- Invalid authorization
- Empty notification responses
- Logging request failures

Errors are handled gracefully without crashing the UI.

---

## Security Considerations
- API tokens are stored in environment variables
- Sensitive files (.env) are excluded from git
- node_modules and build artifacts are excluded from repository

---

## Scalability Considerations
Future improvements:
- Backend pagination
- Real database storage for read/unread status
- WebSocket real-time notifications
- Push notifications
- Role-based notification filtering

---

## Conclusion
This system provides a scalable, responsive, and user-friendly notification dashboard with structured logging support for monitoring and debugging.