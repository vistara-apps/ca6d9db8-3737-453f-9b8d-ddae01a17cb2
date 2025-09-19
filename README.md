# Energy Flow - Micro-Habit App

A Base MiniApp that suggests real-time micro-habits aligned with your energy levels to improve daily productivity and well-being.

## 🚀 Features

### Core Features
- **Real-time Energy Matching**: Self-report your energy level and get personalized micro-habit suggestions
- **Effortless Micro-habit Integration**: Quick 1-3 minute habits that fit seamlessly into your workflow
- **Cumulative Progress Visualization**: Track your habit completion and time investment
- **Adaptive Suggestion Algorithm**: AI-powered recommendations that learn from your feedback

### Technical Features
- Built with Next.js 15 and TypeScript
- Base MiniApp integration with Coinbase MiniKit
- OpenAI GPT integration for personalized habit generation
- Responsive design with Tailwind CSS
- Local storage for data persistence
- Error boundaries and loading states
- Production-ready architecture

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Blockchain**: Base network via MiniKit
- **AI**: OpenAI API for habit generation
- **Storage**: LocalStorage with export/import capabilities
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key
- Coinbase MiniKit API key

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd energy-flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_MINIKIT_API_KEY=your_minikit_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for habit generation | Yes |
| `NEXT_PUBLIC_MINIKIT_API_KEY` | Coinbase MiniKit API key | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | No |

### Design System

The app uses a comprehensive design system with CSS custom properties:

```css
/* Color tokens */
--background: hsl(210, 40%, 10%);
--accent: hsl(35, 90%, 60%);
--primary: hsl(195, 70%, 50%);
--surface: hsl(210, 35%, 15%);
--text-primary: hsl(0, 0%, 95%);
--text-secondary: hsl(0, 0%, 70%);
```

## 📱 Usage

### First Time Setup
1. Open the app in your browser
2. Complete the onboarding flow
3. Optionally connect your Base wallet
4. Set your current energy level

### Daily Usage
1. Report your current energy level using the slider
2. Get a personalized micro-habit suggestion
3. Complete the habit and provide feedback
4. View your progress and streaks

### Features Overview

#### Energy Level Selection
- 5-point energy scale from "Drained" to "Energized"
- Visual feedback with color-coded indicators
- Smooth slider interaction

#### Habit Suggestions
- AI-generated personalized recommendations
- Fallback to curated habit library
- Step-by-step instructions
- Quick completion tracking

#### Progress Tracking
- Total habits completed
- Time invested in self-improvement
- Current streak counter
- Favorite habit categories

#### Adaptive Learning
- Learns from user feedback
- Updates preferred categories
- Improves suggestion relevance over time

## 🏗️ Architecture

### Core Components

```
lib/
├── habit-engine.ts      # Core habit suggestion logic
├── progress-tracker.ts  # Progress calculation and tracking
├── user-preferences.ts  # User preference management
├── openai-client.ts     # OpenAI API integration
├── base-client.ts       # Base blockchain integration
├── storage.ts          # Local storage management
└── types.ts            # TypeScript type definitions

components/
├── AppShell.tsx           # Main app layout
├── EnergySlider.tsx       # Energy level selection
├── HabitSuggestionCard.tsx # Habit display and interaction
├── FeedbackButtons.tsx    # User feedback collection
├── ProgressMeter.tsx      # Progress visualization
├── OnboardingFlow.tsx     # User onboarding
├── DailyFlow.tsx          # Main habit engagement
├── ErrorBoundary.tsx      # Error handling
└── LoadingSpinner.tsx     # Loading states
```

### Data Flow

1. **User Input**: Energy level selection
2. **AI Processing**: OpenAI generates personalized suggestions
3. **Fallback Logic**: Engine provides curated alternatives
4. **User Interaction**: Habit completion and feedback
5. **Data Persistence**: Local storage updates
6. **Progress Updates**: Real-time statistics calculation

## 🔒 Security

- API keys stored in environment variables
- Client-side data validation
- Error boundaries for crash prevention
- Secure wallet integration via MiniKit

## 📊 Business Model

### Current Features (Free)
- Core habit suggestions
- Progress tracking
- Basic analytics

### Future Premium Features
- Advanced AI personalization
- Premium habit packs
- Detailed analytics dashboard
- Micro-transactions for exclusive content

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Setup for Production
- Set all required environment variables
- Configure MiniKit for production
- Set up monitoring and analytics
- Configure error reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with Next.js and the Coinbase MiniKit
- Powered by OpenAI's GPT models
- Inspired by habit formation research and positive psychology

## 📞 Support

For support or questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments for implementation details

---

**Energy Flow** - Sync your energy, master your day with micro-habits. ⚡

