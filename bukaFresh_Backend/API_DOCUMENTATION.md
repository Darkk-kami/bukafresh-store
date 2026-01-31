# BukaFresh Backend API Documentation

## Base URL
```
http://localhost:8084/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this standard format:
```json
{
  "success": boolean,
  "message": string,
  "data": object | null,
  "timestamp": "2024-01-28T10:30:00Z"
}
```

---

## User Management Endpoints

### 1. Register User
**POST** `/users/register`

Creates a new user account and sends email verification.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@example.com",
  "password": "password123",
  "phone": "08012345678"
}
```

**Validation Rules:**
- `firstName`: Required, not blank
- `lastName`: Required, not blank  
- `email`: Required, valid email format, max 255 characters
- `password`: Required, minimum 6 characters
- `phone`: Required, must match pattern `^08\d{9}$` (11 digits starting with 08)

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Check your email for verification",
  "data": null,
  "timestamp": "2024-01-28T10:30:00Z"
}
```

### 2. Checkout Register
**POST** `/users/checkout-register`

Creates a user account during checkout process with delivery address.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com", 
  "password": "password123",
  "phone": "08012345678",
  "deliveryAddress": {
    "street": "123 Main Street",
    "city": "Lagos",
    "state": "Lagos",
    "postalCode": "101233",
    "instructions": "Call when you arrive"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully. Check your email to verify.",
  "data": null,
  "timestamp": "2024-01-28T10:30:00Z"
}
```

### 3. Verify Email
**GET** `/users/verify-email?token={token}&userId={userId}`

Verifies user email and returns login credentials.

**Query Parameters:**
- `token`: Email verification token
- `userId`: User ID

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully.",
  "data": {
    "userId": "user-123",
    "email": "john.doe@example.com",
    "token": "jwt-token-here"
  },
  "timestamp": "2024-01-28T10:30:00Z"
}
```

### 4. Resend Verification Email
**POST** `/users/resend-verification-email?email={email}`

Resends email verification to the specified email address.

**Query Parameters:**
- `email`: User's email address

**Response:**
```json
{
  "success": true,
  "message": "Verification email resent. Please check your inbox.",
  "data": null,
  "timestamp": "2024-01-28T10:30:00Z"
}
```

### 5. Login
**POST** `/users/login`

Authenticates user and returns JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login Successfully.",
  "data": {
    "userId": "user-123",
    "email": "john.doe@example.com", 
    "token": "jwt-token-here"
  },
  "timestamp": "2024-01-28T10:30:00Z"
}
```

### 6. Get Current User Profile
**GET** `/users/me`

**Authentication:** Required (`USER_PROFILE_READ` authority)

Returns the current user's profile information.

**Response:**
```json
{
  "success": true,
  "message": "Successfully retrieved your profile.",
  "data": {
    "id": "profile-123",
    "userId": "user-123",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "phone": "08012345678",
    "avatarId": null,
    "subscriptionId": "sub-123",
    "packagePlan": "STANDARD",
    "addresses": [
      {
        "id": "addr-123",
        "street": "123 Main Street",
        "city": "Lagos",
        "state": "Lagos",
        "postalCode": "101233",
        "instructions": "Call when you arrive"
      }
    ],
    "createdAt": "2024-01-28T10:30:00Z",
    "updatedAt": "2024-01-28T10:30:00Z"
  },
  "timestamp": "2024-01-28T10:30:00Z"
}
```

---

## Subscription Management Endpoints

### 1. Test Endpoint
**GET** `/subscriptions/test`

Simple test endpoint to verify subscription controller is working.

**Response:**
```json
{
  "success": true,
  "message": "Subscription controller is working",
  "data": "Hello from subscription controller!",
  "timestamp": "2024-01-28T10:30:00Z"
}
```

### 2. Create Subscription
**POST** `/subscriptions`

**Authentication:** Required (`USER_PROFILE_UPDATE` authority)

Creates a new subscription for the current user.

**Request Body:**
```json
{
  "tier": "STANDARD",
  "billingCycle": "MONTHLY",
  "paymentMethodId": "pm_123",
  "price": 140000,
  "deliveryDay": "SATURDAY"
}
```

**Validation Rules:**
- `tier`: Required, must be one of: `ESSENTIALS`, `STANDARD`, `PREMIUM`
- `billingCycle`: Required, must be `MONTHLY` or `YEARLY`
- `paymentMethodId`: Optional
- `price`: Optional
- `deliveryDay`: Optional

**Response:**
```json
{
  "success": true,
  "message": "Subscription created successfully",
  "data": {
    "id": "sub-123",
    "userId": "user-123",
    "tier": "STANDARD",
    "status": "ACTIVE",
    "billingCycle": "MONTHLY",
    "nextBillingDate": "2024-02-28",
    "mandateId": "mandate-123",
    "createdAt": "2024-01-28T10:30:00Z",
    "updatedAt": "2024-01-28T10:30:00Z",
    "planDetails": {
      "name": "Standard Package",
      "description": "Complete kit for families of 3-5 members",
      "price": "₦140,000",
      "deliveryFrequency": "Monthly",
      "deliveryDay": "Saturday"
    }
  },
  "timestamp": "2024-01-28T10:30:00Z"
}
```

### 3. Get Current User Subscription
**GET** `/subscriptions/me`

**Authentication:** Required (`USER_PROFILE_READ` authority)

Returns the current user's active subscription.

**Response:**
```json
{
  "success": true,
  "message": "Subscription retrieved successfully",
  "data": {
    "id": "sub-123",
    "userId": "user-123",
    "tier": "STANDARD",
    "status": "ACTIVE",
    "billingCycle": "MONTHLY",
    "nextBillingDate": "2024-02-28",
    "mandateId": "mandate-123",
    "createdAt": "2024-01-28T10:30:00Z",
    "updatedAt": "2024-01-28T10:30:00Z",
    "planDetails": {
      "name": "Standard Package",
      "description": "Complete kit for families of 3-5 members",
      "price": "₦140,000",
      "deliveryFrequency": "Monthly",
      "deliveryDay": "Saturday"
    }
  },
  "timestamp": "2024-01-28T10:30:00Z"
}
```

**Error Response (No Subscription):**
```json
{
  "success": false,
  "message": "No subscription found",
  "data": null,
  "timestamp": "2024-01-28T10:30:00Z"
}
```



### 5. Pause Subscription
**PUT** `/subscriptions/{subscriptionId}/pause`

**Authentication:** Required (`USER_PROFILE_UPDATE` authority)

Pauses an active subscription.

**Path Parameters:**
- `subscriptionId`: The ID of the subscription to pause

**Response:**
```json
{
  "success": true,
  "message": "Subscription paused successfully",
  "data": {
    "id": "sub-123",
    "userId": "user-123",
    "tier": "STANDARD",
    "status": "PAUSED",
    "billingCycle": "MONTHLY",
    "nextBillingDate": "2024-02-28",
    "mandateId": "mandate-123",
    "createdAt": "2024-01-28T10:30:00Z",
    "updatedAt": "2024-01-28T11:00:00Z",
    "planDetails": {
      "name": "Standard Package",
      "description": "Complete kit for families of 3-5 members",
      "price": "₦140,000",
      "deliveryFrequency": "Monthly",
      "deliveryDay": "Saturday"
    }
  },
  "timestamp": "2024-01-28T11:00:00Z"
}
```

### 6. Resume Subscription
**PUT** `/subscriptions/{subscriptionId}/resume`

**Authentication:** Required (`USER_PROFILE_UPDATE` authority)

Resumes a paused subscription.

**Path Parameters:**
- `subscriptionId`: The ID of the subscription to resume

**Response:**
```json
{
  "success": true,
  "message": "Subscription resumed successfully",
  "data": {
    "id": "sub-123",
    "userId": "user-123",
    "tier": "STANDARD",
    "status": "ACTIVE",
    "billingCycle": "MONTHLY",
    "nextBillingDate": "2024-02-28",
    "mandateId": "mandate-123",
    "createdAt": "2024-01-28T10:30:00Z",
    "updatedAt": "2024-01-28T11:15:00Z",
    "planDetails": {
      "name": "Standard Package",
      "description": "Complete kit for families of 3-5 members",
      "price": "₦140,000",
      "deliveryFrequency": "Monthly",
      "deliveryDay": "Saturday"
    }
  },
  "timestamp": "2024-01-28T11:15:00Z"
}
```

### 7. Cancel Subscription
**PUT** `/subscriptions/{subscriptionId}/cancel`

**Authentication:** Required (`USER_PROFILE_UPDATE` authority)

Cancels an active or paused subscription.

**Path Parameters:**
- `subscriptionId`: The ID of the subscription to cancel

**Response:**
```json
{
  "success": true,
  "message": "Subscription cancelled successfully",
  "data": {
    "id": "sub-123",
    "userId": "user-123",
    "tier": "STANDARD",
    "status": "CANCELED",
    "billingCycle": "MONTHLY",
    "nextBillingDate": "2024-02-28",
    "mandateId": "mandate-123",
    "createdAt": "2024-01-28T10:30:00Z",
    "updatedAt": "2024-01-28T11:30:00Z",
    "planDetails": {
      "name": "Standard Package",
      "description": "Complete kit for families of 3-5 members",
      "price": "₦140,000",
      "deliveryFrequency": "Monthly",
      "deliveryDay": "Saturday"
    }
  },
  "timestamp": "2024-01-28T11:30:00Z"
}
```

### 8. Update Subscription Status
**PUT** `/subscriptions/{subscriptionId}/status?status={status}`

**Authentication:** Required (`USER_PROFILE_UPDATE` authority)

Updates the status of a subscription.

**Path Parameters:**
- `subscriptionId`: The ID of the subscription to update

**Query Parameters:**
- `status`: New status (e.g., `ACTIVE`, `PAUSED`, `CANCELED`)

**Response:**
```json
{
  "success": true,
  "message": "Subscription status updated successfully",
  "data": {
    "id": "sub-123",
    "userId": "user-123",
    "tier": "STANDARD",
    "status": "ACTIVE",
    "billingCycle": "MONTHLY",
    "nextBillingDate": "2024-02-28",
    "mandateId": "mandate-123",
    "createdAt": "2024-01-28T10:30:00Z",
    "updatedAt": "2024-01-28T11:45:00Z",
    "planDetails": {
      "name": "Standard Package",
      "description": "Complete kit for families of 3-5 members",
      "price": "₦140,000",
      "deliveryFrequency": "Monthly",
      "deliveryDay": "Saturday"
    }
  },
  "timestamp": "2024-01-28T11:45:00Z"
}
```

---

## Error Responses

### Common Error Codes

**400 Bad Request**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "timestamp": "2024-01-28T10:30:00Z"
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "message": "Authentication required",
  "data": null,
  "timestamp": "2024-01-28T10:30:00Z"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "message": "Access denied",
  "data": null,
  "timestamp": "2024-01-28T10:30:00Z"
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Resource not found",
  "data": null,
  "timestamp": "2024-01-28T10:30:00Z"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Internal server error",
  "data": null,
  "timestamp": "2024-01-28T10:30:00Z"
}
```

---

## Data Models

### Subscription Tiers
- `ESSENTIALS`: Basic package for 1-2 people
- `STANDARD`: Complete package for 3-5 people  
- `PREMIUM`: Premium package for 4-6 people

### Billing Cycles
- `MONTHLY`: Billed every month
- `YEARLY`: Billed annually

### Subscription Status
- `ACTIVE`: Subscription is active and deliveries are scheduled
- `PAUSED`: Subscription is temporarily paused
- `CANCELED`: Subscription has been cancelled

### Delivery Days
- `SATURDAY`: All deliveries are made on Saturdays between 8am - 6pm

---

## Frontend Integration Examples

### JavaScript/Axios Examples

```javascript
// Login
const login = async (email, password) => {
  const response = await axios.post('/api/users/login', {
    email,
    password
  });
  
  // Store token
  localStorage.setItem('authToken', response.data.data.token);
  localStorage.setItem('userId', response.data.data.userId);
  localStorage.setItem('userEmail', response.data.data.email);
  
  return response.data;
};

// Get current subscription
const getCurrentSubscription = async () => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get('/api/subscriptions/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data;
};

// Create subscription
const createSubscription = async (subscriptionData) => {
  const token = localStorage.getItem('authToken');
  const response = await axios.post('/api/subscriptions', subscriptionData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.data;
};
```

---

## Testing

### Using curl

```bash
# Register user
curl -X POST http://localhost:8084/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "phone": "08012345678"
  }'

# Login
curl -X POST http://localhost:8084/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'

# Get subscription (replace TOKEN with actual JWT)
curl -X GET http://localhost:8084/api/subscriptions/me \
  -H "Authorization: Bearer TOKEN"

# Create subscription (replace TOKEN with actual JWT)
curl -X POST http://localhost:8084/api/subscriptions \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tier": "STANDARD",
    "billingCycle": "MONTHLY",
    "deliveryDay": "SATURDAY"
  }'
```

---

## Notes

1. **Authentication**: JWT tokens are required for most endpoints. Tokens are returned upon successful login or email verification.

2. **Validation**: All request bodies are validated. Check the validation rules for each endpoint.

3. **Error Handling**: The API uses standard HTTP status codes and returns consistent error response format.

4. **CORS**: Make sure CORS is configured properly for frontend integration.

5. **Rate Limiting**: Consider implementing rate limiting for production use.

6. **Environment**: This documentation assumes the backend is running on `localhost:8084`. Update the base URL for different environments.