# 🎯 DebateMate.Tech

A cutting-edge AI-powered debate platform that helps users improve their argumentation skills through realistic debates with AI opponents. Built for HackRU 2025.

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.9-38bdf8?logo=tailwindcss)
![Snowflake](https://img.shields.io/badge/Snowflake-Database-29b5e8?logo=snowflake)

## 🌟 Features

### 🤖 AI-Powered Debates
- **Intelligent Opponents**: Debate against AI characters with distinct personalities (politicians, scientists, activists, philosophers, journalists, lawyers)
- **Google Gemini Integration**: Advanced AI responses powered by Google's Gemini API
- **Real-time Analysis**: Instant feedback on logical fallacies, argument strength, and debate performance

### 🔊 Advanced Text-to-Speech
- **ElevenLabs Integration**: High-quality AI voice synthesis with optimized performance
- **Smart Caching**: Client-side audio caching for instant replay
- **Fallback System**: Browser TTS fallback for reliability
- **Voice Customization**: Different voice characteristics based on opponent type

### 📊 Comprehensive Analytics
- **Performance Tracking**: Detailed scoring system for clarity, evidence, logic, and persuasiveness
- **Fallacy Detection**: AI-powered identification of logical fallacies in arguments
- **Progress Monitoring**: Track improvement over time with Snowflake database integration
- **Detailed Feedback**: Personalized suggestions for improvement

### 🎨 Modern UI/UX
- **Responsive Design**: Built with TailwindCSS and Radix UI components
- **Dark/Light Mode**: Theme switching with next-themes
- **Real-time Updates**: Live debate interface with message streaming
- **Accessibility**: Full keyboard navigation and screen reader support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Snowflake account for database
- Google Gemini API key
- ElevenLabs API key (optional, for premium TTS)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BrantisIsHacking/hackru-2025.git
   cd hackru-2025
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your API keys and database credentials:
   ```env
   # Snowflake Configuration
   SNOWFLAKE_ACCOUNT=your_account_id
   SNOWFLAKE_USERNAME=your_username
   SNOWFLAKE_PASSWORD=your_password
   SNOWFLAKE_WAREHOUSE=your_warehouse
   SNOWFLAKE_DATABASE=your_database
   SNOWFLAKE_SCHEMA=your_schema

   # Google Gemini Configuration
   GEMINI_API_KEY=your_gemini_api_key

   # ElevenLabs Configuration (Optional)
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ELEVENLABS_VOICE_ID=your_voice_id
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 🔧 Key Technologies

### Frontend
- **Next.js 15.2.4** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS 4.1.9** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Backend & AI
- **Google Gemini API** - Advanced language model for AI opponents
- **ElevenLabs API** - Premium text-to-speech synthesis
- **Snowflake** - Cloud data warehouse for analytics
- **Vercel Analytics** - Performance monitoring

### Performance Optimizations
- **Audio Caching** - Client-side audio caching with automatic cleanup
- **Smart Fallbacks** - Browser TTS fallback for reliability
- **Timeout Protection** - 5-second timeout for TTS requests
- **Optimized Models** - ElevenLabs Turbo v2.5 for faster generation

## 📱 Core Features

### Debate Arena
- Real-time debate interface with AI opponents
- Message history with scoring and fallacy detection
- Voice synthesis for AI responses
- Performance analytics

### User Dashboard
- Debate history and statistics
- Performance trends and improvement tracking
- Quick access to new debates

### Authentication System
- Secure user registration and login
- Session management
- User profile and preferences

### Analytics & Feedback
- Detailed post-debate analysis
- Logical fallacy identification
- Personalized improvement suggestions
- Performance scoring across multiple dimensions

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Debates
- `POST /api/debates/create` - Create new debate
- `GET /api/debates/get/[debateId]` - Get debate details
- `POST /api/debates/message` - Send debate message
- `POST /api/debates/end/[debateId]` - End debate session
- `GET /api/debates/[userId]` - Get user's debates

### Analytics
- `GET /api/analytics/[userId]` - Get user analytics

### Speech Synthesis
- `POST /api/speech/synthesize` - Generate TTS audio

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SNOWFLAKE_ACCOUNT` | Snowflake account identifier | Yes |
| `SNOWFLAKE_USERNAME` | Database username | Yes |
| `SNOWFLAKE_PASSWORD` | Database password | Yes |
| `SNOWFLAKE_WAREHOUSE` | Data warehouse name | Yes |
| `SNOWFLAKE_DATABASE` | Database name | Yes |
| `SNOWFLAKE_SCHEMA` | Schema name | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `ELEVENLABS_API_KEY` | ElevenLabs API key | No* |
| `ELEVENLABS_VOICE_ID` | ElevenLabs voice ID | No* |

*ElevenLabs is optional - the app will use browser TTS as fallback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🏆 HackRU 2025

Built with ❤️ for HackRU 2025 - Empowering the next generation of debaters with AI technology.
