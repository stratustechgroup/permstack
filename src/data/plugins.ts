import type { Plugin } from './types';

export const plugins: Plugin[] = [
  // ============================================
  // ESSENTIALS CATEGORY
  // ============================================
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
    id: 'cmi',
    name: 'CMI',
    slug: 'cmi',
    description: 'All-in-one server management plugin (270+ commands)',
    category: 'essentials',
    isPopular: true,
  },
  {
    id: 'placeholderapi',
    name: 'PlaceholderAPI',
    slug: 'placeholderapi',
    description: 'Unified placeholder system for plugins',
    category: 'essentials',
    isPopular: true,
  },

  // ============================================
  // PROTECTION CATEGORY
  // ============================================
  {
    id: 'worldguard',
    name: 'WorldGuard',
    slug: 'worldguard',
    description: 'Region protection and flag management',
    category: 'protection',
    isPopular: true,
  },
  {
    id: 'griefprevention',
    name: 'GriefPrevention',
    slug: 'griefprevention',
    description: 'Claim-based land protection with golden shovel',
    category: 'protection',
    isPopular: true,
  },
  {
    id: 'towny',
    name: 'Towny',
    slug: 'towny',
    description: 'Town and nation management with land claiming',
    category: 'protection',
    isPopular: true,
  },
  {
    id: 'residence',
    name: 'Residence',
    slug: 'residence',
    description: 'Self-serve area protection system',
    category: 'protection',
    isPopular: false,
  },
  {
    id: 'griefdefender',
    name: 'GriefDefender',
    slug: 'griefdefender',
    description: 'Advanced claim and flag protection system',
    category: 'protection',
    isPopular: false,
  },
  {
    id: 'lands',
    name: 'Lands',
    slug: 'lands',
    description: 'Modern land claiming with GUI and wars',
    category: 'protection',
    isPopular: true,
  },

  // ============================================
  // MODERATION CATEGORY
  // ============================================
  {
    id: 'coreprotect',
    name: 'CoreProtect',
    slug: 'coreprotect',
    description: 'Block logging, rollback, and restore',
    category: 'moderation',
    isPopular: true,
  },
  {
    id: 'litebans',
    name: 'LiteBans',
    slug: 'litebans',
    description: 'Cross-server ban management',
    category: 'moderation',
    isPopular: true,
  },
  {
    id: 'advancedban',
    name: 'AdvancedBan',
    slug: 'advancedban',
    description: 'Ban, mute, warn, and kick management',
    category: 'moderation',
    isPopular: true,
  },
  {
    id: 'staffplus',
    name: 'Staff+',
    slug: 'staffplus',
    description: 'Staff tools, freeze, vanish, reports',
    category: 'moderation',
    isPopular: false,
  },
  {
    id: 'premiumvanish',
    name: 'PremiumVanish',
    slug: 'premiumvanish',
    description: 'Advanced vanish with many features',
    category: 'moderation',
    isPopular: true,
  },
  {
    id: 'openinv',
    name: 'OpenInv',
    slug: 'openinv',
    description: 'View and edit player inventories',
    category: 'moderation',
    isPopular: true,
  },

  // ============================================
  // ECONOMY CATEGORY
  // ============================================
  {
    id: 'jobs',
    name: 'Jobs Reborn',
    slug: 'jobs',
    description: 'Job-based economy system',
    category: 'economy',
    isPopular: true,
  },
  {
    id: 'shopgui',
    name: 'ShopGUI+',
    slug: 'shopgui',
    description: 'GUI-based shop system',
    category: 'economy',
    isPopular: true,
  },
  {
    id: 'chestshop',
    name: 'ChestShop',
    slug: 'chestshop',
    description: 'Sign-based player shops',
    category: 'economy',
    isPopular: true,
  },
  {
    id: 'quickshop',
    name: 'QuickShop',
    slug: 'quickshop',
    description: 'Easy chest-based player shops',
    category: 'economy',
    isPopular: true,
  },
  {
    id: 'playervaults',
    name: 'PlayerVaults',
    slug: 'playervaults',
    description: 'Virtual storage vaults for players',
    category: 'economy',
    isPopular: true,
  },
  {
    id: 'auctionhouse',
    name: 'AuctionHouse',
    slug: 'auctionhouse',
    description: 'Global auction system for items',
    category: 'economy',
    isPopular: true,
  },
  {
    id: 'tokenmanager',
    name: 'TokenManager',
    slug: 'tokenmanager',
    description: 'Virtual token economy system',
    category: 'economy',
    isPopular: false,
  },

  // ============================================
  // WORLD CATEGORY
  // ============================================
  {
    id: 'worldedit',
    name: 'WorldEdit',
    slug: 'worldedit',
    description: 'In-game map editor for builders and admins',
    category: 'world',
    isPopular: true,
  },
  {
    id: 'fawe',
    name: 'FastAsyncWorldEdit',
    slug: 'fawe',
    description: 'Faster WorldEdit with async operations',
    category: 'world',
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
    id: 'voidgen',
    name: 'VoidGen',
    slug: 'voidgen',
    description: 'Void world generator',
    category: 'world',
    isPopular: false,
  },

  // ============================================
  // FUN & GAMEPLAY CATEGORY
  // ============================================
  {
    id: 'mcmmo',
    name: 'mcMMO',
    slug: 'mcmmo',
    description: 'RPG skills and leveling system',
    category: 'fun',
    isPopular: true,
  },
  {
    id: 'aureliumskills',
    name: 'AureliumSkills',
    slug: 'aureliumskills',
    description: 'Modern RPG skills plugin',
    category: 'fun',
    isPopular: true,
  },
  {
    id: 'mythicmobs',
    name: 'MythicMobs',
    slug: 'mythicmobs',
    description: 'Custom mob creation and scripting',
    category: 'fun',
    isPopular: true,
  },
  {
    id: 'citizens',
    name: 'Citizens',
    slug: 'citizens',
    description: 'NPC creation and management',
    category: 'fun',
    isPopular: true,
  },
  {
    id: 'headdb',
    name: 'HeadDB',
    slug: 'headdb',
    description: 'Database of decorative heads',
    category: 'fun',
    isPopular: true,
  },
  {
    id: 'crazyenchantments',
    name: 'CrazyEnchantments',
    slug: 'crazyenchantments',
    description: 'Custom enchantments system',
    category: 'fun',
    isPopular: false,
  },
  {
    id: 'ecoenchants',
    name: 'EcoEnchants',
    slug: 'ecoenchants',
    description: 'Modern custom enchantments',
    category: 'fun',
    isPopular: true,
  },

  // ============================================
  // CHAT & SOCIAL CATEGORY
  // ============================================
  {
    id: 'discordsrv',
    name: 'DiscordSRV',
    slug: 'discordsrv',
    description: 'Discord-Minecraft chat bridge',
    category: 'chat',
    isPopular: true,
  },
  {
    id: 'chatcontrol',
    name: 'ChatControl',
    slug: 'chatcontrol',
    description: 'Chat management and formatting',
    category: 'chat',
    isPopular: true,
  },
  {
    id: 'venturechat',
    name: 'VentureChat',
    slug: 'venturechat',
    description: 'Advanced chat channels system',
    category: 'chat',
    isPopular: false,
  },
  {
    id: 'parties',
    name: 'Parties',
    slug: 'parties',
    description: 'Party system for players',
    category: 'chat',
    isPopular: false,
  },

  // ============================================
  // DISPLAY & COSMETICS CATEGORY
  // ============================================
  {
    id: 'tab',
    name: 'TAB',
    slug: 'tab',
    description: 'Tablist and nametag customization',
    category: 'display',
    isPopular: true,
  },
  {
    id: 'decentholograms',
    name: 'DecentHolograms',
    slug: 'decentholograms',
    description: 'Hologram creation and management',
    category: 'display',
    isPopular: true,
  },
  {
    id: 'holographicdisplays',
    name: 'HolographicDisplays',
    slug: 'holographicdisplays',
    description: 'Classic hologram plugin',
    category: 'display',
    isPopular: false,
  },
  {
    id: 'deluxemenus',
    name: 'DeluxeMenus',
    slug: 'deluxemenus',
    description: 'Custom GUI menu creation',
    category: 'display',
    isPopular: true,
  },
  {
    id: 'ajleaderboards',
    name: 'ajLeaderboards',
    slug: 'ajleaderboards',
    description: 'Hologram leaderboards',
    category: 'display',
    isPopular: false,
  },

  // ============================================
  // GAMEMODES CATEGORY
  // ============================================
  {
    id: 'bentobox',
    name: 'BentoBox',
    slug: 'bentobox',
    description: 'Island management (SkyBlock, AcidIsland, etc)',
    category: 'gamemodes',
    isPopular: true,
  },
  {
    id: 'superiorskyblock',
    name: 'SuperiorSkyblock2',
    slug: 'superiorskyblock',
    description: 'Feature-rich skyblock plugin',
    category: 'gamemodes',
    isPopular: true,
  },
  {
    id: 'factionsuuid',
    name: 'FactionsUUID',
    slug: 'factionsuuid',
    description: 'Classic factions gameplay',
    category: 'gamemodes',
    isPopular: true,
  },
  {
    id: 'saberfactions',
    name: 'SaberFactions',
    slug: 'saberfactions',
    description: 'Modern factions fork',
    category: 'gamemodes',
    isPopular: false,
  },

  // ============================================
  // UTILITY CATEGORY
  // ============================================
  {
    id: 'authme',
    name: 'AuthMe',
    slug: 'authme',
    description: 'Login and registration system',
    category: 'utility',
    isPopular: true,
  },
  {
    id: 'viaversion',
    name: 'ViaVersion',
    slug: 'viaversion',
    description: 'Allow newer clients to join',
    category: 'utility',
    isPopular: true,
  },
  {
    id: 'chestsort',
    name: 'ChestSort',
    slug: 'chestsort',
    description: 'Automatic chest sorting',
    category: 'utility',
    isPopular: true,
  },
  {
    id: 'silkspawners',
    name: 'SilkSpawners',
    slug: 'silkspawners',
    description: 'Pick up and place spawners',
    category: 'utility',
    isPopular: true,
  },
  {
    id: 'clearlag',
    name: 'ClearLag',
    slug: 'clearlag',
    description: 'Entity and lag management',
    category: 'utility',
    isPopular: true,
  },
  {
    id: 'dynmap',
    name: 'Dynmap',
    slug: 'dynmap',
    description: 'Web-based live map',
    category: 'utility',
    isPopular: true,
  },
  {
    id: 'votingplugin',
    name: 'VotingPlugin',
    slug: 'votingplugin',
    description: 'Server voting rewards system',
    category: 'utility',
    isPopular: true,
  },

  // ============================================
  // COMBAT CATEGORY
  // ============================================
  {
    id: 'combatlogx',
    name: 'CombatLogX',
    slug: 'combatlogx',
    description: 'Combat tagging and logging prevention',
    category: 'combat',
    isPopular: true,
  },
  {
    id: 'pvpmanager',
    name: 'PvPManager',
    slug: 'pvpmanager',
    description: 'PvP toggle and protection',
    category: 'combat',
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
