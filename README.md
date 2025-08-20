# NoteVanta

An AI-powered document chat application that allows you to upload documents and websites, then have intelligent conversations about their content using multiple AI models.

## Features

- **Document Upload**: Support for PDF, text, and CSV files
- **Website Integration**: Single page or full website crawling
- **Multi-AI Support**: Choose between OpenAI and Gemini models
- **Real-time Chat**: Interactive conversations with your documents
- **User Authentication**: Secure Firebase authentication
- **Document Management**: View and delete uploaded sources
- **Dark/Light Theme**: Toggle between themes

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: React 19, Tailwind CSS, Radix UI
- **AI**: LangChain, AI SDK, Google Generative AI
- **Database**: Firebase Firestore
- **Vector Store**: Qdrant
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS with shadcn/ui components

## Getting Started

1. **Install dependencies**:

```bash
pnpm install
```

2. **Set up environment variables**:
   Create a `.env.local` file with your API keys and configuration.

3. **Run the development server**:

```bash
pnpm dev
```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Authentication**: Sign in with Google to access the application
2. **Upload Documents**: Drag and drop PDFs, text files, or CSV files
3. **Add Websites**: Enter URLs for single page or full website indexing
4. **Chat**: Ask questions about your uploaded content using AI models
5. **Manage Sources**: View and delete your uploaded documents

## Project Structure

```
app/
├── api/          # API routes for chat, documents, indexing
├── chat/         # Main chat interface
└── page.tsx      # Home page

components/
├── panels/       # ChatPanel and SourcePanel components
├── ui/           # Reusable UI components
└── LoginDialog.tsx

hooks/
└── useAuth.ts    # Authentication hook

lib/
├── firebase.ts   # Firebase configuration
└── utils.ts      # Utility functions
```
