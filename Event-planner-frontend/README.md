# Event Planner Frontend

A modern React.js frontend for the Event Planner application. Built with React 19, Vite, React Router, and Axios.

## Tech Stack

- **Framework:** React 19.1+
- **Build Tool:** Vite 7.1+
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Styling:** CSS3 with modern design

## Features

### Phase 0 Implementation
- ✅ User Management (CRUD operations)
- ✅ Event Management (CRUD operations)
- ✅ Modern, responsive UI
- ✅ RESTful API integration
- ✅ Form validation
- ✅ Error handling

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend API running on `http://localhost:8080`

### Installation

1. **Navigate to the frontend directory**
   ```bash
   cd frontend_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend_app/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── Layout.jsx     # Main layout component
│   │   ├── Layout.css     # Layout styles
│   │   ├── UserForm.jsx   # User form component
│   │   ├── UserForm.css   # User form styles
│   │   ├── EventForm.jsx  # Event form component
│   │   └── EventForm.css  # Event form styles
│   ├── pages/             # Page components
│   │   ├── Home.jsx       # Home page
│   │   ├── Home.css       # Home page styles
│   │   ├── Users.jsx      # Users page
│   │   ├── Users.css      # Users page styles
│   │   ├── Events.jsx     # Events page
│   │   └── Events.css     # Events page styles
│   ├── services/          # API services
│   │   └── api.js         # Axios configuration and API methods
│   ├── App.jsx            # Main app component
│   ├── App.css            # App styles
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── README.md             # This file
```

## API Integration

The frontend communicates with the backend API at `http://localhost:8080/api/v1`.

### Available Endpoints

#### Users
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create a new user
- `PUT /api/v1/users/:id` - Update a user
- `DELETE /api/v1/users/:id` - Delete a user

#### Events
- `GET /api/v1/events` - Get all events
- `GET /api/v1/events/:id` - Get event by ID
- `POST /api/v1/events` - Create a new event
- `PUT /api/v1/events/:id` - Update an event
- `DELETE /api/v1/events/:id` - Delete an event

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Use functional components with hooks
- Follow React best practices
- Maintain consistent component structure
- Use meaningful variable and function names

## UI Features

- **Modern Design:** Clean, professional interface with gradients and shadows
- **Responsive Layout:** Works on desktop, tablet, and mobile devices
- **Interactive Forms:** Real-time validation and user feedback
- **Data Tables:** Easy-to-read user listings
- **Event Cards:** Beautiful card-based event display
- **Navigation:** Intuitive top navigation bar

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

Phase 0 focuses on basic CRUD operations. Future phases may include:
- User authentication
- Advanced filtering and search
- Calendar view
- Event reminders
- File uploads
- Real-time updates

## License

MIT
