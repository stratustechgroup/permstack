import type { ServerType } from './types';

interface ServerTypeInfo {
  id: ServerType;
  name: string;
  description: string;
  icon: string;
}

export const serverTypes: ServerTypeInfo[] = [
  {
    id: 'survival',
    name: 'Survival / SMP',
    description: 'Classic survival gameplay with communities',
    icon: '🏕️',
  },
  {
    id: 'factions',
    name: 'Factions',
    description: 'Team-based PvP with land claiming',
    icon: '⚔️',
  },
  {
    id: 'skyblock',
    name: 'Skyblock',
    description: 'Island survival and progression',
    icon: '🏝️',
  },
  {
    id: 'prison',
    name: 'Prison',
    description: 'Mine, rankup, and escape',
    icon: '⛏️',
  },
  {
    id: 'minigames',
    name: 'Minigames / Arcade',
    description: 'Quick games and competitions',
    icon: '🎮',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Building and plot worlds',
    icon: '🎨',
  },
  {
    id: 'custom',
    name: 'Custom / Other',
    description: 'Unique server type',
    icon: '✨',
  },
];
