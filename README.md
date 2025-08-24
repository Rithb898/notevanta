# NoteVanta

An AI-powered document chat application that allows you to upload documents and websites, then have intelligent conversations about their content using multiple AI models.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=flat&logo=Firebase&logoColor=white)

## Features

- **Document Upload**: Support for PDF, text, and CSV files
- **Website Integration**: Single page or full website crawling
- **Multi-AI Support**: Choose between OpenAI (via Groq) and Gemini models
- **Real-time Chat**: Interactive conversations with your documents using AI SDK
- **User Authentication**: Secure Firebase authentication with Google Sign-In
- **Document Management**: View and delete uploaded sources
- **Dark/Light Theme**: Toggle between themes with next-themes
- **Vector Search**: Powered by Qdrant for semantic document retrieval
- **Message Limits**: Built-in rate limiting for API usage

## Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **UI**: React 19, Tailwind CSS 4, Radix UI, shadcn/ui components
- **AI**: LangChain, AI SDK, Google Generative AI, OpenAI
- **Database**: Firebase Firestore
- **Vector Store**: Qdrant
- **Authentication**: Firebase Auth with Google Provider
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Motion (Framer Motion)
- **Development**: TypeScript, ESLint, Prettier

## Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn
- Firebase project with Firestore enabled
- Qdrant vector database instance
- API keys for:
  - Google Generative AI
  - Groq (for OpenAI models)
  - Firebase configuration

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Rithb898/notevanta
cd notevanta

# Install dependencies
pnpm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# AI API Keys
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
GOOGLE_API_KEY=your_google_ai_api_key_here

# Vector Database
QDRANT_URL=your_qdrant_instance_url

# Firebase Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Optional
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_web3forms_key
```

### Development

```bash
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build application for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint for code quality |

## Architecture

### Routing Strategy
- **App Router**: Uses Next.js 15 App Router with TypeScript
- **API Routes**: RESTful API endpoints in `/app/api/`
- **SSR/SSG**: Server-side rendering for landing pages, client-side for chat interface

### Data Fetching
- **Real-time Chat**: AI SDK with streaming responses
- **Vector Search**: LangChain + Qdrant for document retrieval
- **Authentication**: Firebase Auth with real-time state management
- **Document Storage**: Firebase Firestore for metadata

### Key Technologies

#### UI Framework
- **shadcn/ui**: Pre-built components with Radix UI primitives
- **Tailwind CSS 4**: Utility-first styling with CSS variables
- **Motion**: Smooth animations and transitions
- **next-themes**: Dark/light theme switching

#### AI & ML
- **LangChain**: Document processing and text splitting
- **Google Generative AI**: Embeddings and chat completions
- **Groq**: Fast OpenAI model inference
- **Qdrant**: Vector similarity search

#### Authentication & Database
- **Firebase Auth**: Google OAuth integration
- **Firestore**: Document metadata and user data
- **Real-time listeners**: Live authentication state

## Project Structure

```
app/
├── api/                    # API routes
│   ├── chat/              # Chat completions endpoint
│   ├── documents/         # Document management
│   ├── indexing/          # Document processing
│   ├── delete-document/   # Document deletion
│   ├── generate-title/    # AI title generation
│   └── message-limit/     # Rate limiting
├── chat/                  # Chat interface page
├── globals.css           # Global styles
├── layout.tsx            # Root layout with theme provider
└── page.tsx              # Landing page

components/
├── panels/               # Main application panels
│   ├── ChatPanel.tsx    # Chat interface
│   └── SourcePanel.tsx  # Document management
├── sections/            # Landing page sections
│   ├── Header.tsx       # Navigation header
│   ├── HeroSection.tsx  # Hero section
│   ├── FeaturesSection.tsx
│   ├── PricingSection.tsx
│   ├── CTASection.tsx
│   └── Footer.tsx
├── ui/                  # shadcn/ui components
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   └── ...
├── LoginDialog.tsx      # Authentication modal
└── themeProvider.tsx    # Theme context

hooks/
├── useAuth.ts           # Firebase authentication
├── useChatHistory.ts    # Chat state management
└── useMessageLimit.ts   # Rate limiting logic

lib/
├── firebase.ts          # Firebase configuration
└── utils.ts            # Utility functions

public/                  # Static assets
├── logo.png
├── *.svg               # Icons and graphics
└── ...
```

## Environment Variables

### Required Variables

```env
# AI Services (Required)
GROQ_API_KEY=              # Groq API key for OpenAI models
GOOGLE_GENERATIVE_AI_API_KEY= # Google AI API key
QDRANT_URL=                # Qdrant vector database URL

# Firebase (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Optional Variables

```env
# Analytics & Forms
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=  # Google Analytics
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=     # Contact form service
```

## Deployment

### Vercel (Recommended)

1. **Connect Repository**: Import your GitHub repository to Vercel
2. **Environment Variables**: Add all required environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically build and deploy

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy from command line
vercel --prod
```

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Docker Deployment

```dockerfile
# TODO: Add Dockerfile for containerized deployment
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Usage Examples

### Document Upload API

```javascript
// Upload document for processing
const formData = new FormData();
formData.append('file', file);
formData.append('userId', userId);

const response = await fetch('/api/indexing', {
  method: 'POST',
  body: formData
});
```

### Chat API

```javascript
// Send chat message
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: chatMessages,
    provider: 'gemini', // or 'openai'
    userId: user.uid
  })
});
```

### Authentication

```javascript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, login, logout, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return user ? (
    <button onClick={logout}>Sign Out</button>
  ) : (
    <button onClick={login}>Sign In with Google</button>
  );
}
```

## Development

### Code Quality

- **ESLint**: Next.js recommended configuration with TypeScript support
- **Prettier**: Code formatting with Tailwind CSS plugin
- **TypeScript**: Strict type checking enabled

### Component Development

```bash
# Add new shadcn/ui component
npx shadcn@latest add [component-name]

# Example: Add a new button variant
npx shadcn@latest add button
```

### Testing

```bash
# TODO: Add testing setup
# Recommended: Jest + React Testing Library
npm install --save-dev jest @testing-library/react
```

## Troubleshooting

### Common Issues

1. **Firebase Authentication Errors**
   - Verify Firebase configuration in `.env.local`
   - Check Firebase console for enabled authentication providers

2. **Qdrant Connection Issues**
   - Ensure Qdrant instance is running and accessible
   - Verify `QDRANT_URL` environment variable

3. **AI API Rate Limits**
   - Check API key quotas for Google AI and Groq
   - Implement proper error handling for rate limits

4. **Build Errors**
   - Clear `.next` cache: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && pnpm install`

### Next.js 15 Migration Notes

- Uses React 19 with new concurrent features
- Turbopack enabled for faster development builds
- App Router is stable and recommended
- Automatic TypeScript configuration

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Add TypeScript types for new features
- Update documentation for API changes
- Test authentication flows thoroughly

## License

This project is private and proprietary. All rights reserved.

## How This README Was Generated

This README was generated by analyzing the following project files:
- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript setup
- `app/layout.tsx` - App structure and metadata
- `components.json` - shadcn/ui configuration
- `lib/firebase.ts` - Firebase setup
- `app/api/*/route.ts` - API endpoint patterns
- `.env.local` - Environment variable structure
- Project directory structure via file system analysis

The analysis revealed a modern Next.js 15 application with App Router, TypeScript, Tailwind CSS 4, Firebase integration, and AI-powered document chat capabilities using LangChain and multiple AI providers.
