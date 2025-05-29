# Nostr Rap Battles

A decentralized rap battle application built on the Nostr protocol. Battle with random beats, compete with other rappers, and climb the leaderboard in this Web3 rap arena.

## Features

- **Practice Mode**: Hone your skills with randomly generated beats
- **Battle Rooms**: Create or join multiplayer rap battles
- **Real-time Messaging**: Exchange bars with opponents using Nostr events
- **Beat Library**: Various instrumental styles (Boom Bap, Trap, Lo-Fi, etc.)
- **Leaderboard**: Track top performers in the community
- **Decentralized**: All data stored on the Nostr network

## Tech Stack

- React 18.x with TypeScript
- TailwindCSS 3.x for styling
- Vite for fast builds
- shadcn/ui components
- Nostrify for Nostr protocol integration
- React Router for navigation
- TanStack Query for data management

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- A Nostr-compatible browser extension (e.g., Alby, nos2x) for authentication

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rap-battle
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## How to Use

### 1. Login with Nostr

Click the "Log in" button in the top right corner and authenticate with your Nostr extension. This allows you to:
- Create and join battle rooms
- Post your rap verses
- Track your scores and rankings

### 2. Practice Mode

Perfect for warming up or solo sessions:
- Navigate to `/practice` 
- Generate random beats with different styles and BPMs
- Practice your flow without pressure
- No login required for basic practice

### 3. Battle Rooms

Compete with other rappers in real-time:
- Go to `/battles` to see active rooms
- Create a new room or join an existing one
- Take turns dropping bars over generated beats
- Community votes determine the winner
- Scores are tracked on the leaderboard

### 4. Beat Library

Explore available beats:
- Visit `/beats` to browse the collection
- Filter by style, BPM, or producer
- Preview beats before using them in battles
- Each beat includes licensing information

### 5. Leaderboard

See who's dominating the scene:
- Check `/leaderboard` for top performers
- Rankings based on battle wins and community votes
- Filter by time period (daily, weekly, all-time)
- View rapper profiles and battle history

## Game Mechanics

### Battle Rules

1. **Room Creation**: Set room name, max rounds, and participant limit
2. **Turn-Based**: Rappers take turns dropping 16-32 bar verses
3. **Time Limits**: Each turn has a countdown timer
4. **Voting**: Community members vote on each round
5. **Scoring**: Points awarded based on votes, creativity, and flow

### Beat Selection

- Beats are randomly generated for each round
- Styles include: Boom Bap, Trap, Lo-Fi, Old School, Jazz Hop, West Coast
- BPM ranges from 80-140
- Each beat plays on loop during a rapper's turn

## Development

### Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── pages/         # Route pages
├── lib/           # Utilities and helpers
└── AppRouter.tsx  # Route definitions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests and type checking

### Adding New Features

1. Create new pages in `src/pages/`
2. Add routes in `src/AppRouter.tsx`
3. Use existing hooks from `src/hooks/` for Nostr integration
4. Follow the component patterns in `src/components/`

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run test` to ensure everything works
5. Submit a pull request

## License

[Add your license here]

## Acknowledgments

Built with the MKStack template for Nostr applications.