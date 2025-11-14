# Datarama

A modern Next.js application for data visualization and management.

## Features

- **Dashboard**: Interactive data dashboard with various visualization components
- **Ask Bridgit AI**: AI-powered data assistance
- **Templates**: Pre-built templates for common data scenarios
- **URL Integration**: URL-based data import and management
- **Headers Management**: Configure and manage API headers
- **Matrix View**: Advanced data matrix visualization

## Tech Stack

- **Framework**: Next.js 15.5.6
- **UI Components**: Radix UI, Material-UI
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **3D Graphics**: Three.js with React Three Fiber
- **State Management**: Zustand
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Create production build
npm run build
```

### Production

```bash
# Start production server
npm start
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Project Structure

```
datarama/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── actions/           # Server actions
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components
│   ├── kokonutui/        # Kokonut UI components
│   └── limeplay/         # Media player components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Environment

This application requires no environment variables for basic operation.

## License

Private

## Contributing

This is a private project.
