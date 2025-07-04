# BankMe API Documentation

## Overview

The BankMe API is a RESTful application for managing assignors and receivables. Complete documentation is available through Swagger UI.

## Accessing Documentation

After starting the backend server, the interactive documentation will be available at:

```
http://localhost:3001/api
```

## Authentication

The API uses JWT (JSON Web Token) authentication. To access protected endpoints:

1. Login using the `/integrations/auth` endpoint (POST)
2. Use the returned token in the `Authorization: Bearer <token>` header

## Main Endpoints

### Authentication (`/integrations/auth`)

- **POST** `/` - Login
- **POST** `/signup` - Create new account

### Assignors (`/integrations/assignor`)

- **GET** `/` - List all assignors
- **GET** `/:id` - Get assignor by ID
- **POST** `/` - Create new assignor
- **PATCH** `/:id` - Update assignor
- **DELETE** `/:id` - Delete assignor

### Receivables (`/integrations/payable`)

- **GET** `/` - List all receivables
- **GET** `/:id` - Get receivable by ID
- **POST** `/` - Create new receivable
- **POST** `/batch` - Create receivables in batch
- **PATCH** `/:id` - Update receivable
- **DELETE** `/:id` - Delete receivable

## How to Use Swagger UI

1. **Access documentation**: Navigate to `http://localhost:3001/api`

2. **Authentication**:
   - Click the "Authorize" button at the top of the page
   - Enter your JWT token in the format: `Bearer <your-token>`
   - Click "Authorize"

3. **Test Endpoints**:
   - Expand the desired section (auth, assignors, payables)
   - Click on the endpoint you want to test
   - Click "Try it out"
   - Fill in the required parameters
   - Click "Execute"

4. **Usage Examples**:
   - All DTOs include data examples
   - Schemas show the exact structure of objects
   - Responses include status codes and descriptions

## Data Structure

### Assignor
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "João Silva",
  "email": "joao.silva@email.com",
  "document": "123.456.789-00",
  "phone": "(11) 99999-9999"
}
```

### Receivable
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "assignorId": "123e4567-e89b-12d3-a456-426614174000",
  "value": 1000.50,
  "emissionDate": "2024-01-15T10:30:00.000Z",
  "batchId": "123e4567-e89b-12d3-a456-426614174000"
}
```

### Batch
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "PENDING",
  "totalItems": 100,
  "successCount": 95,
  "failedCount": 5,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:35:00.000Z"
}
```

## HTTP Status Codes

- **200** - Success
- **201** - Created successfully
- **204** - Deleted successfully
- **400** - Invalid data
- **401** - Unauthorized
- **404** - Resource not found
- **500** - Internal server error

## Development

To start the server in development mode:

```bash
npm run dev
```

The Swagger documentation will be automatically updated with code changes.

## Important Notes

- All endpoints (except authentication) require a valid JWT token
- IDs are UUID v4
- Dates must be in ISO 8601 format
- Monetary values are decimal numbers
- Batch processing supports up to 10,000 items at once 