# 🎓 LearnFlow

**The Future of Learning is Here** - A blockchain-powered quiz platform that rewards perfect scores with verifiable NFT achievement badges on the Cardano blockchain.

![LearnFlow Banner](https://i.postimg.cc/XYkCbRp2/learnflow-high-resolution-logo.png)

## 🌟 Overview

LearnFlow is a revolutionary learning platform that combines interactive quizzes with blockchain technology. Users can test their knowledge across various topics and earn unique NFT badges for perfect scores, creating a permanent, verifiable record of their achievements on the Cardano blockchain.

### ✨ Key Features

- 📚 **Interactive Learning**: Carefully crafted quizzes designed to test and reinforce knowledge
- 🏆 **NFT Achievement Badges**: Perfect scores unlock unique NFT badges minted on Cardano
- 🔗 **Blockchain Verified**: Achievements permanently recorded and verifiable on-chain
- 🤖 **AI-Powered Quiz Generation**: Create custom quizzes using Google's Gemini AI
- 📊 **Progress Tracking**: Comprehensive analytics and leaderboards
- 🗳️ **Community Voting**: Vote on AI-generated quizzes to improve quality
- 📱 **Mobile-First Design**: Responsive interface that works on all devices
- ⚡ **Real-time Updates**: Live leaderboards and instant feedback

## 🚀 Live Demo

 - Visit [LearnFlow](https://fiery-civet-557.convex.app/) to try it out!
 - Youtube Intro [LearnFlow](https://youtu.be/XAgRJ_RfDLQ)

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend & Database
- **Convex** - Real-time backend-as-a-service
- **Convex Auth** - Authentication system
- **Real-time Subscriptions** - Live data updates

### Blockchain Integration
- **Cardano** - Blockchain platform for NFT minting
- **Mesh SDK** - Cardano wallet integration
- **Lucid Cardano** - Cardano transaction building
- **Blockfrost API** - Cardano blockchain API

### AI Integration
- **Google Gemini AI** - AI-powered quiz generation
- **Custom Prompts** - Tailored for educational content

## 📁 Project Structure

```
learnflow/
├── convex/                     # Backend functions and schema
│   ├── schema.ts              # Database schema definition
│   ├── auth.ts                # Authentication configuration
│   ├── quiz.ts                # Quiz-related functions
│   ├── nft.ts                 # NFT minting functions
│   ├── users.ts               # User management
│   ├── voting.ts              # Quiz voting system
│   ├── leaderboard.ts         # Leaderboard functions
│   ├── analytics.ts           # Analytics and tracking
│   └── router.ts              # HTTP endpoints
├── src/
│   ├── components/            # React components
│   │   ├── QuizApp.tsx        # Main quiz application
│   │   ├── QuizScreen.tsx     # Quiz taking interface
│   │   ├── ResultsScreen.tsx  # Results and NFT minting
│   │   ├── LeaderboardScreen.tsx # Leaderboard display
│   │   ├── ProfileScreen.tsx  # User profile
│   │   ├── AIQuizGeneratorModal.tsx # AI quiz creation
│   │   ├── WalletProvider.tsx # Cardano wallet integration
│   │   └── ...
│   ├── lib/
│   │   └── utils.ts           # Utility functions
│   ├── App.tsx                # Main application component
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles
├── public/                    # Static assets
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🗄️ Database Schema

### Core Tables

#### `quizzes`
- Quiz content, questions, and metadata
- AI generation tracking
- Voting scores and community feedback
- Difficulty levels and categories

#### `quizResults`
- User quiz attempts and scores
- NFT transaction tracking
- Performance metrics

#### `userProgress`
- Learning progress tracking
- Achievement streaks
- Level progression

#### `nftBadges`
- Minted NFT records
- Blockchain transaction IDs
- Badge metadata

#### `quizVotes`
- Community voting on AI-generated quizzes
- Quality control mechanism

## 🎯 Core Features

### 1. Quiz System
- **Multiple Choice Questions**: Interactive quiz interface
- **Instant Feedback**: Immediate results with explanations
- **Progress Tracking**: Real-time progress indicators
- **Difficulty Levels**: Beginner to Expert classifications

### 2. NFT Achievement System
- **Perfect Score Requirement**: Only 100% scores earn NFTs
- **Cardano Integration**: Minted on Cardano blockchain
- **Unique Metadata**: Each badge contains quiz-specific data
- **Wallet Integration**: Seamless wallet connection

### 3. AI Quiz Generation
- **Google Gemini Integration**: AI-powered content creation
- **Custom Topics**: Generate quizzes on any subject
- **Quality Control**: Community voting system
- **Automatic Categorization**: Smart topic classification

### 4. Gamification
- **Leaderboards**: Global and category-specific rankings
- **Achievement Streaks**: Consecutive perfect scores
- **Level Progression**: Unlock advanced content
- **Social Features**: Community voting and feedback

### 5. Analytics Dashboard
- **Performance Metrics**: Detailed quiz statistics
- **Learning Insights**: Progress visualization
- **NFT Collection**: Badge gallery and achievements

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Convex account
- Google AI API key (for quiz generation)
- Blockfrost API key (for Cardano integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/learnflow.git
   cd learnflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Convex**
   ```bash
   npx convex dev
   ```

4. **Configure environment variables**
   
   In your Convex dashboard, add these environment variables:
   ```
   GOOGLE_AI_API_KEY=your_gemini_api_key
   BLOCKFROST_PROJECT_ID=your_blockfrost_project_id
   BLOCKFROST_API_URL=https://cardano-mainnet.blockfrost.io/api/v0
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Convex Setup
1. Create a Convex account at [convex.dev](https://convex.dev)
2. Run `npx convex dev` to initialize your backend
3. Deploy with `npx convex deploy`

### Blockchain Configuration
1. Get a Blockfrost API key from [blockfrost.io](https://blockfrost.io)
2. Configure your Cardano network (mainnet/testnet)
3. Set up wallet integration for users

### AI Integration
1. Get a Google AI API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Configure quiz generation parameters
3. Set up content moderation

## 📱 Usage

### For Learners
1. **Sign Up**: Create an account with username/password
2. **Take Quizzes**: Choose from available quizzes
3. **Earn NFTs**: Get perfect scores to unlock achievement badges
4. **Track Progress**: Monitor your learning journey
5. **Connect Wallet**: Link your Cardano wallet for NFT rewards

### For Educators
1. **Generate Quizzes**: Use AI to create custom content
2. **Review Content**: Vote on community-generated quizzes
3. **Monitor Analytics**: Track learner engagement
4. **Manage Content**: Organize quizzes by difficulty and topic

## 🏗️ Deployment

### Development
```bash
npm run dev          # Start development server
npm run lint         # Run linting
```

### Production

#### Option 1: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

#### Option 2: Ubuntu VPS with Apache
See the detailed deployment guide in the project documentation.

```bash
npm run build        # Build for production
npx convex deploy    # Deploy backend
```

## 🔐 Security Features

- **Authentication**: Secure user authentication with Convex Auth
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: API rate limiting to prevent abuse
- **Blockchain Security**: Immutable achievement records
- **Data Privacy**: GDPR-compliant data handling

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

## 📊 Analytics & Monitoring

The platform includes comprehensive analytics:
- **User Engagement**: Quiz completion rates, time spent
- **Learning Outcomes**: Score distributions, improvement trends
- **NFT Metrics**: Minting success rates, badge popularity
- **System Performance**: API response times, error rates

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Core quiz functionality
- ✅ NFT badge system
- ✅ AI quiz generation
- ✅ Community voting

### Phase 2 (Q2 2024)
- 🔄 Multi-language support
- 🔄 Advanced analytics dashboard
- 🔄 Mobile app development
- 🔄 Integration with educational platforms

### Phase 3 (Q3 2024)
- 📋 Certification programs
- 📋 Corporate training modules
- 📋 Advanced AI features
- 📋 Cross-chain NFT support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Convex** - For the amazing real-time backend platform
- **Cardano Foundation** - For the robust blockchain infrastructure
- **Google AI** - For the powerful Gemini AI model
- **Mesh SDK** - For seamless Cardano wallet integration
- **Tailwind CSS** - For the beautiful, responsive design system

---

**Built with ❤️ by the LearnFlow team**

*Empowering learners worldwide with blockchain-verified achievements*
