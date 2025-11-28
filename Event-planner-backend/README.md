# Event Planner Backend

A RESTful API backend for the Event Planner application built with GoLang, MySQL, and Gorilla Mux.

## Tech Stack

- **Language:** Go 1.21+
- **Framework:** Gorilla Mux
- **Database:** MySQL 8.0+
- **Configuration:** dotenv

## Project Structure
git@github.com:MsqJR/Event-Planner.git
```
backend/
├── cmd/
│   └── main.go              # Application entry point
├── internal/
│   ├── config/
│   │   └── config.go        # Configuration management
│   ├── database/
│   │   └── database.go      # Database connection
│   ├── handlers/
│   │   └── user_handler.go  # User endpoints
│   ├── middleware/
│   │   └── cors.go          # CORS middleware
│   └── models/
│       └── user.go          # Data models
├── migrations/
│   └── 001_init.sql         # Database schema
├── ENV_CONFIG.md           # Environment configuration guide
├── .gitignore              # Git ignore rules
├── go.mod                  # Go dependencies
└── README.md               # This file
```

## Setup Instructions

### Prerequisites

- Go 1.21 or higher installed
- MySQL 8.0 or higher installed and running
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   go mod download
   ```

3. **Configure environment**
   - See `ENV_CONFIG.md` for detailed environment setup instructions
   - Create a `.env` file with your database credentials

4. **Setup database**
   ```bash
   mysql -u root -p < migrations/001_init.sql
   ```
   Or import the SQL file using your MySQL client.

5. **Run the application**
   ```bash
   go run cmd/main.go
   ```

   The server will start on `http://localhost:8080`

## API Endpoints

### Health Check
- `GET /health` - Check API status

## API Request/Response Examples

### Create User
```bash
POST /api/v1/users
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com"
  "password": "xyzmlb"
}
```
## Developmen## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 3306 |
| DB_USER | Database user | root |
| DB_PASSWORD | <your_database_password> | - |
| DB_NAME | Database name | eventplanner |
| PORT | Server port | 8080 |
| HOST | Server host | localhost |

