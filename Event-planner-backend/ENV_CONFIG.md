# Environment Configuration for Backend

Create a `.env` file in the backend directory with the following configuration:

## Required Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=eventplanner

# Server Configuration
PORT=8080
HOST=localhost

# JWT Secret (if needed in future phases)
JWT_SECRET=your-secret-key
```

## Setup Instructions

1. Create a new file named `.env` in the `Event-planner-backend/` directory
2. Copy the configuration above into the `.env` file
3. Update the values according to your local setup:
   - `DB_HOST`: Your MySQL host (usually localhost)
   - `DB_PORT`: Your MySQL port (usually 3306)
   - `DB_USER`: Your MySQL username (usually root)
   - `DB_PASSWORD`: Your MySQL password (we use eventplanner)
   - `DB_NAME`: Your database name
   - `PORT`: Port for the backend server (we use 8080)
   - `HOST`: Host for the backend server (we use 5173)

4. Save the file and restart the backend server

## Example `.env` for Development

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=mypassword123
DB_NAME=eventplanner
PORT=8080
HOST=localhost
JWT_SECRET=dev-secret-key-change-in-production
```

## Example `.env` for Production

```env
DB_HOST=production-db.example.com
DB_PORT=3306
DB_USER=eventplanner_user
DB_PASSWORD=strong-production-password
DB_NAME=eventplanner_prod
PORT=8080
HOST=0.0.0.0
JWT_SECRET=very-strong-random-secret-key
```

