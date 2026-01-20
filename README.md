# PermStack

**Build your server ranks in 60 seconds.**

PermStack is a web application that generates permission configurations for Minecraft server ranks. Users select their server type, installed plugins, and desired rank structure - the tool outputs ready-to-use LuckPerms configurations in multiple formats (YAML, commands, JSON).

## Features

- **Server Type Selection**: Survival, Factions, Skyblock, Prison, Minigames, Creative
- **Plugin Support**: EssentialsX, LuckPerms, Vault, WorldEdit, WorldGuard, CoreProtect, Multiverse, mcMMO, Jobs Reborn, ShopGUI+
- **Rank Templates**: Standard, Simple, or Donation-focused rank structures
- **Multiple Output Formats**:
  - YAML Config (for fresh setups)
  - LuckPerms Commands (for existing servers)
  - JSON Export (for `/lp import`)

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Tabs.tsx
│   │   └── CodeBlock.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── ServerTypeSelector.tsx
│   ├── PluginSelector.tsx
│   ├── RankBuilder.tsx
│   └── OutputPanel.tsx
├── data/
│   ├── types.ts         # TypeScript types
│   ├── plugins.ts       # Plugin definitions
│   ├── permissions.ts   # Permission nodes
│   ├── rankTemplates.ts # Rank presets
│   └── serverTypes.ts   # Server type definitions
├── lib/
│   └── generateYaml.ts  # Output generators
├── App.tsx
├── main.tsx
└── index.css
```

## License

MIT
