# LearnFlow - Quiz App with Cardano NFT Badges

A responsive React quiz application that integrates with Cardano blockchain to mint NFT achievement badges for perfect quiz scores.

## Features

- **Interactive Quiz Engine**: Multiple-choice questions with real-time feedback
- **Cardano Wallet Integration**: Connect with Lace, Eternl, and other Cardano wallets
- **NFT Badge Minting**: Mint achievement badges on Cardano testnet for perfect scores
- **Responsive Design**: Clean, modern UI built with Tailwind CSS
- **Real-time Database**: Powered by Convex for seamless data management

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your Blockfrost API key for Cardano testnet
   - Configure your Convex deployment URL

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Architecture

### Frontend Components
- `QuizApp.tsx` - Main application orchestrator
- `LandingScreen.tsx` - Welcome screen with wallet connection
- `QuizScreen.tsx` - Interactive quiz interface
- `ResultsScreen.tsx` - Score display and NFT minting
- `WalletProvider.tsx` - Cardano wallet integration

### Backend Functions
- `quiz.ts` - Quiz data and result management
- `nft.ts` - NFT minting with Blockfrost API
- `schema.ts` - Database schema definitions

## Blockchain Integration

### Wallet Support
- Lace Wallet
- Eternl Wallet
- Other Cardano-compatible wallets via Mesh SDK

### NFT Metadata
Achievement badges include:
- Student name
- Quiz title and score
- Date earned
- Achievement type

### Testnet Integration
- Uses Cardano testnet for safe development
- Blockfrost API for blockchain interactions
- CardanoScan integration for transaction viewing

## Security

- Environment variables for API keys
- Secure wallet connection handling
- Input validation and error handling

## Future Enhancements

- IPFS integration for NFT images
- Multiple quiz categories
- Leaderboards and social features
- Mainnet deployment options
