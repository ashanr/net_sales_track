# JWT Authentication System - Setup Guide

Complete real-time API authentication for Sales Track Dashboard with login, register, and protected routes.

## Quick Start

### 1. Backend Setup (.NET API)

**Install packages and run migration:**
```powershell
cd src/SalesTrackApi
dotnet restore
dotnet ef migrations add AddUsersTable
dotnet run
```

The API will automatically apply migrations on startup.

### 2. Frontend Setup (Angular)

**Install dependencies:**
```powershell
cd dashboard-angular
npm install
npm start
```

**Access the application:**
- Navigate to: `http://localhost:4200`
- You'll be redirected to the login page
- Register a new account to get started

## Features

✅ **Backend (.NET 8 API with JWT)**
- User registration with BCrypt password hashing
- JWT token generation with 24h expiration
- Secure authentication endpoints
- PostgreSQL Users table

✅ **Frontend (Angular 18)**
- Login and Register pages with forms
- Route guards protecting the dashboard
- HTTP interceptor adding JWT to requests
- Login/Register/Logout navigation buttons
- Session persistence in localStorage

## Application Flow

### First Time User
1. Open `http://localhost:4200` → Redirected to `/login`
2. Click "Sign up" → Navigate to `/register`
3. Fill registration form → Submit
4. Redirected to `/login`
5. Enter credentials → Submit
6. Redirected to `/dashboard`

### Logged In User
- Header shows: User Name | Refresh | Logout buttons
- Can access dashboard at `/dashboard`
- Attempting to access `/login` or `/register` works but they can still navigate to dashboard

### Logged Out User
- Header shown: Login | Register buttons
- Attempting to access `/dashboard` → Redirected to `/login`
- Can use Login or Register pages

## Architecture

### Backend Endpoints

**POST /api/auth/register**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
Response: `200 OK` with success message

**POST /api/auth/login**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Response: `200 OK` with JWT token and user info

### Frontend Routing

| Route | Component | Protected | Description |
|-------|-----------|-----------|-------------|
| `/login` | LoginComponent | No | User login page |
| `/register` | RegisterComponent | No | User registration |
| `/dashboard` | DashboardComponent | Yes | Main dashboard (auth required) |
| `/` | - | No | Redirects to `/login` |

### Authentication Flow Diagram

```
User → Login Page
  ↓
  POST /api/auth/login
  ↓
Save JWT Token (localStorage)
  ↓
  Redirect to /dashboard
  ↓
Auth Guard checks token
  ↓
HTTP Interceptor adds token to API requests
  ↓
Dashboard loads data with authenticated requests
```

## Security Features

### Backend
- **BCrypt Hashing**: Passwords hashed with salt rounds: 10
- **JWT Tokens**: Secure tokens with expiration (24 hours)
- **Email Uniqueness**: Database constraint prevents duplicate emails
- **CORS**: Configured for Angular origin

### Frontend
- **Route Guards**: Unauthorized users redirected to login
- **HTTP Interceptor**: Automatic token attachment
- **Token Storage**: localStorage (consider httpOnly cookies for production)
- **Form Validation**: Client-side validation before API calls

## Database Schema

```sql
CREATE TABLE "Users" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(200) NOT NULL,
    "Email" VARCHAR(255) NOT NULL UNIQUE,
    "PasswordHash" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Testing the Authentication

### Test Registration
1. Navigate to `http://localhost:4200/register`
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
3. Click "Create Account"
4. Should redirect to login

### Test Login
1. Navigate to `http://localhost:4200/login`
2. Enter credentials from registration
3. Click "Sign In"
4. Should redirect to dashboard with user name in header

### Test Route Protection
1. Logout from dashboard
2. Try to access `http://localhost:4200/dashboard` directly
3. Should be redirected to login

### Test Token Persistence
1. Login successfully
2. Refresh the page
3. Should remain logged in
4. Dashboard should still be accessible

## Configuration

### Change JWT Secret (IMPORTANT for production!)

Edit `src/SalesTrackApi/appsettings.json`:
```json
{
  "Jwt": {
    "Key": "YourProductionSecretKey_MinimumLength32Characters!",
    "Issuer": "SalesTrackApi",
    "Audience": "SalesTrackApp",
    "ExpiryHours": 24
  }
}
```

### Change Token Expiration

Edit the `ExpiryHours` value in appsettings.json.

## Troubleshooting

### TypeScript Errors about @angular/router

**Solution**: Run `npm install` in the `dashboard-angular` directory. The package.json has been updated to include `@angular/router`.

### "Cannot find module" errors

**Solution**: Clear and reinstall:
```powershell
cd dashboard-angular
rm -r node_modules
rm package-lock.json
npm install
```

### API returns 401 Unauthorized

**Possible causes**:
1. Token expired (24h) - Login again
2. Token not being sent - Check browser DevTools Network tab
3. Invalid token - Clear localStorage and login again

### Database migration errors

**Solution**:
```powershell
cd src/SalesTrackApi
dotnet ef database drop
dotnet ef migrations remove
dotnet ef migrations add AddUsersTable
dotnet ef database update
```

### Login shows "Invalid email or password" for valid credentials

**Check**:
1. User was created successfully (check database)
2. Password is correct (case-sensitive)
3. API is running on port 5158

## API Endpoints Reference

### Authentication

**POST /api/auth/register**
- Body: `{ name, email, password }`
- Returns: Success message
- Status: 201 Created or 400 Bad Request

**POST /api/auth/login**
- Body: `{ email, password }`
- Returns: `{ token, user: { id, name, email } }`
- Status: 200 OK or 401 Unauthorized

### Protected Endpoints

All sales, metrics, and visualization endpoints now accept:
```
Authorization: Bearer <jwt_token>
```

The Angular HTTP interceptor automatically adds this header.

## Production Deployment

### Backend
1. Change JWT secret key in appsettings.json
2. Use environment variables for sensitive data
3. Enable HTTPS
4. Configure CORS for production domain
5. Use secure database connection strings

### Frontend
1. Update API URL in `authservice.ts` and `sales-api.service.ts`
2. Build for production: `npm run build`
3. Deploy `dist/` folder
4. Consider using httpOnly cookies instead of localStorage

## Notes

- The router errors shown in IDE will resolve after running `npm install`
- Users table migration is applied automatically on API startup
- Passwords are never stored in plain text
- Default token expiration is 24 hours
- Session persists across browser refreshes

---

**Your authentication system is ready! 🔐**
