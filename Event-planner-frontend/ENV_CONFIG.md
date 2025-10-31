# Environment Configuration for Frontend

Create a `.env` file in the frontend_app directory with the following configuration:

## Required Environment Variables

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8080/api/v1

# Optional: Development settings
VITE_ENVIRONMENT=development
```

## Setup Instructions

1. Create a new file named `.env` in the `frontend_app/` directory
2. Copy the configuration above into the `.env` file
3. Update the values according to your setup:
   - `VITE_API_BASE_URL`: The base URL of your backend API
   - `VITE_ENVIRONMENT`: The environment (development, staging, production)

4. Save the file and restart the frontend development server

## Important Notes

- Vite requires the `VITE_` prefix for environment variables to be exposed to the client
- Never put sensitive information in frontend environment variables as they're exposed to the browser
- The `.gitignore` file is already configured to exclude `.env` files

## Example `.env` for Development

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_ENVIRONMENT=development
```

## Example `.env` for Production

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_ENVIRONMENT=production
```

## Example `.env` for Staging

```env
VITE_API_BASE_URL=https://staging-api.yourdomain.com/api/v1
VITE_ENVIRONMENT=staging
```

## Building with Environment Variables

When you build the frontend for production:

```bash
npm run build
```

The environment variables from your `.env` file will be embedded into the build. Make sure your `.env` file is configured correctly before building.

## Using Different Environments

You can create multiple environment files:
- `.env` - Default (used for development)
- `.env.local` - Local overrides
- `.env.production` - Production overrides
- `.env.staging` - Staging overrides

Vite automatically loads the appropriate file based on the mode.

## Dynamic API URL

The API service in `src/services/api.js` is configured to use the environment variable:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'
```

If `VITE_API_BASE_URL` is not set, it defaults to `http://localhost:8080/api/v1`.

