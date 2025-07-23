# AI CRM 

## Project Structure

```
project/
├── client/     # Frontend application
└── server/     # Backend API
```

## Getting Started

### Prerequisites
- Node.js
- npm
- PostgreSQL database (NeonDB recommended)

### Frontend Setup

1. Clone the repository
```bash
git clone <your-repo-url>
cd client
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
# Create .env file with:
VITE_API_URL=http://localhost:3000
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4. Start development server
```bash
npm run dev
```

### Backend Setup

1. Navigate to server directory
```bash
cd server
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
# Create .env file with:
DATABASE_URL="your_neon_postgresql_url"
JWT_SECRET="your_secret_key"
CLIENT_URL="http://localhost:5173"
```

4. Start development server
```bash
npm run dev
```

## Environment Variables

### Client (.env)
- `VITE_API_URL` - Backend API URL
- `VITE_GEMINI_API_KEY` - Gemini API key for AI features

### Server (.env)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT authentication
- `CLIENT_URL` - Frontend application URL

## Development

- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:3000`
