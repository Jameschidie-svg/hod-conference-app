# HOD Check-In

A modern conference management application for tracking attendee check-ins, managing attendance records, and generating reports. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Google Authentication** - Secure login with Google OAuth
- 📱 **QR Code Scanner** - Camera-based QR code scanning for quick check-ins
- 👥 **Attendee Management** - Search and manage conference attendees
- 📊 **Dashboard** - Overview of attendance statistics and key metrics
- 📈 **Reports** - Detailed attendance reports and analytics
- 🎨 **Modern UI** - Beautiful, responsive design built with shadcn/ui components
- 📱 **Mobile-First** - Optimized for mobile and desktop devices

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router DOM
- **QR Scanner**: html5-qrcode
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- A modern web browser with camera access (for QR scanning)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd worship-connect
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── assets/          # Static assets (images, logos)
├── components/      # Reusable React components
│   ├── ui/         # shadcn/ui components
│   └── ...        # Custom components
├── data/           # JSON data files (attendees, reports)
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── pages/          # Page components
│   ├── Dashboard.tsx
│   ├── CheckIn.tsx
│   ├── Login.tsx
│   ├── Report.tsx
│   └── ...
└── main.tsx        # Application entry point
```

## Key Features

### QR Code Scanner

The QR code scanner uses the device camera to scan QR codes for quick attendee check-ins. The scanner:

- Requests camera permissions automatically
- Works on both front and back cameras (prefers back camera)
- Displays a live camera feed in a modal dialog
- Automatically closes after successful scan
- Shows error messages for permission or camera issues

**Note**: Camera access requires HTTPS in production or localhost for development.

### Authentication

Currently uses a simulated Google OAuth flow. In production, you'll need to:

1. Set up Google OAuth credentials
2. Configure the OAuth client ID
3. Implement the actual authentication flow

### Data Management

The app currently uses JSON files for data storage (`src/data/`). For production, you should:

- Set up a backend API
- Connect to a database (PostgreSQL, MongoDB, etc.)
- Implement proper authentication and authorization
- Add data persistence

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Code Style

The project uses:
- ESLint for code linting
- TypeScript for type safety
- Prettier (if configured) for code formatting

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Note**: QR code scanning requires a browser that supports the MediaDevices API and camera access.


### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` directory to Netlify
3. Configure build settings if needed

### Other Platforms

The app can be deployed to any static hosting service:
- GitHub Pages
- AWS S3 + CloudFront
- Azure Static Web Apps
- Any Node.js hosting service

## Environment Variables

Create a `.env` file in the root directory for environment-specific variables:

```env
VITE_API_URL=your_api_url_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues, questions, or contributions, please open an issue on the repository.

---

Built with ❤️ for conference management
