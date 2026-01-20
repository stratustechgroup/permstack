import type { Plugin } from './types';

export const plugins: Plugin[] = [
  {
    id: 'essentialsx',
    name: 'EssentialsX',
    slug: 'essentialsx',
    description: 'Core server commands: homes, teleports, economy, chat',
    category: 'essentials',
    isPopular: true,
  },
  {
    id: 'luckperms',
    name: 'LuckPerms',
    slug: 'luckperms',
    description: 'Advanced permissions management (assumed installed)',
    category: 'essentials',
    isPopular: true,
  },
  {
    id: 'vault',
    name: 'Vault',
    slug: 'vault',
    description: 'Economy and permissions API bridge',
    category: 'essentials',
    isPopular: true,
  },
  {
    id: 'worldedit',
    name: 'WorldEdit',
    slug: 'worldedit',
    description: 'In-game map editor for builders and admins',
    category: 'world',
    isPopular: true,
  },
  {
    id: 'worldguard',
    name: 'WorldGuard',
    slug: 'worldguard',
    description: 'Region protection and flag management',
    category: 'protection',
    isPopular: true,
  },
  {
    id: 'coreprotect',
    name: 'CoreProtect',
    slug: 'coreprotect',
    description: 'Block logging, rollback, and restore',
    category: 'moderation',
    isPopular: true,
  },
  {
    id: 'multiverse',
    name: 'Multiverse-Core',
    slug: 'multiverse',
    description: 'Multiple world management',
    category: 'world',
    isPopular: true,
  },
  {
    id: 'mcmmo',
    name: 'mcMMO',
    slug: 'mcmmo',
    description: 'RPG skills and leveling system',
    category: 'fun',
    isPopular: true,
  },
  {
    id: 'jobs',
    name: 'Jobs Reborn',
    slug: 'jobs',
    description: 'Job-based economy system',
    category: 'economy',
    isPopular: false,
  },
  {
    id: 'shopgui',
    name: 'ShopGUI+',
    slug: 'shopgui',
    description: 'GUI-based shop system',
    category: 'economy',
    isPopular: false,
  },
];

export const pluginsByCategory = plugins.reduce((acc, plugin) => {
  if (!acc[plugin.category]) {
    acc[plugin.category] = [];
  }
  acc[plugin.category].push(plugin);
  return acc;
}, {} as Record<string, Plugin[]>);

export const popularPlugins = plugins.filter(p => p.isPopular);
