import type { Plugin, Gamemode } from './types';

// Helper to create gamemode array
const gm = (...modes: Gamemode[]): Gamemode[] => modes;

export const plugins: Plugin[] = [
  // ============================================
  // PERMISSIONS CATEGORY (Single Selection)
  // ============================================
  {
    id: 'luckperms',
    name: 'LuckPerms',
    slug: 'luckperms',
    description: 'Modern permissions plugin with web editor and sync',
    category: 'permissions',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'permissionsex',
    name: 'PermissionsEx',
    slug: 'permissionsex',
    description: 'Classic permissions plugin (legacy, not recommended)',
    category: 'permissions',
    isPopular: false,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'groupmanager',
    name: 'GroupManager',
    slug: 'groupmanager',
    description: 'Simple permissions with inheritance (legacy)',
    category: 'permissions',
    isPopular: false,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'ultrapermissions',
    name: 'UltraPermissions',
    slug: 'ultrapermissions',
    description: 'GUI-based permission management with MySQL support',
    category: 'permissions',
    isPopular: false,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'powerfulperms',
    name: 'PowerfulPerms',
    slug: 'powerfulperms',
    description: 'BungeeCord-compatible permissions with MySQL',
    category: 'permissions',
    isPopular: false,
    gamemodes: gm('minigames', 'factions'),
  },

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
    gamemodes: gm('survival', 'skyblock', 'factions'),
  },
  {
    id: 'vault',
    name: 'Vault',
    slug: 'vault',
    description: 'Economy and permissions API bridge',
    category: 'essentials',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'cmi',
    name: 'CMI',
    slug: 'cmi',
    description: 'All-in-one server management plugin (270+ commands)',
    category: 'essentials',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions'),
  },
  {
    id: 'placeholderapi',
    name: 'PlaceholderAPI',
    slug: 'placeholderapi',
    description: 'Unified placeholder system for plugins',
    category: 'essentials',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
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
    gamemodes: gm('survival', 'skyblock', 'minigames'),
  },
  {
    id: 'griefprevention',
    name: 'GriefPrevention',
    slug: 'griefprevention',
    description: 'Claim-based land protection with golden shovel',
    category: 'protection',
    isPopular: true,
    gamemodes: gm('survival'),
  },
  {
    id: 'towny',
    name: 'Towny',
    slug: 'towny',
    description: 'Town and nation management with land claiming',
    category: 'protection',
    isPopular: true,
    gamemodes: gm('survival'),
  },
  {
    id: 'residence',
    name: 'Residence',
    slug: 'residence',
    description: 'Self-serve area protection system',
    category: 'protection',
    isPopular: false,
    gamemodes: gm('survival'),
  },
  {
    id: 'griefdefender',
    name: 'GriefDefender',
    slug: 'griefdefender',
    description: 'Advanced claim and flag protection system',
    category: 'protection',
    isPopular: false,
    gamemodes: gm('survival'),
  },
  {
    id: 'lands',
    name: 'Lands',
    slug: 'lands',
    description: 'Modern land claiming with GUI and wars',
    category: 'protection',
    isPopular: true,
    gamemodes: gm('survival'),
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
    gamemodes: gm('survival', 'skyblock', 'factions'),
  },
  {
    id: 'litebans',
    name: 'LiteBans',
    slug: 'litebans',
    description: 'Cross-server ban management',
    category: 'moderation',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'advancedban',
    name: 'AdvancedBan',
    slug: 'advancedban',
    description: 'Ban, mute, warn, and kick management',
    category: 'moderation',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'staffplus',
    name: 'Staff+',
    slug: 'staffplus',
    description: 'Staff tools, freeze, vanish, reports',
    category: 'moderation',
    isPopular: false,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'premiumvanish',
    name: 'PremiumVanish',
    slug: 'premiumvanish',
    description: 'Advanced vanish with many features',
    category: 'moderation',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'openinv',
    name: 'OpenInv',
    slug: 'openinv',
    description: 'View and edit player inventories',
    category: 'moderation',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions'),
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
    gamemodes: gm('survival', 'skyblock'),
  },
  {
    id: 'shopgui',
    name: 'ShopGUI+',
    slug: 'shopgui',
    description: 'GUI-based shop system',
    category: 'economy',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions'),
  },
  {
    id: 'chestshop',
    name: 'ChestShop',
    slug: 'chestshop',
    description: 'Sign-based player shops',
    category: 'economy',
    isPopular: true,
    gamemodes: gm('survival'),
  },
  {
    id: 'quickshop',
    name: 'QuickShop',
    slug: 'quickshop',
    description: 'Easy chest-based player shops',
    category: 'economy',
    isPopular: true,
    gamemodes: gm('survival'),
  },
  {
    id: 'playervaults',
    name: 'PlayerVaults',
    slug: 'playervaults',
    description: 'Virtual storage vaults for players',
    category: 'economy',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions'),
  },
  {
    id: 'auctionhouse',
    name: 'AuctionHouse',
    slug: 'auctionhouse',
    description: 'Global auction system for items',
    category: 'economy',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions'),
  },
  {
    id: 'tokenmanager',
    name: 'TokenManager',
    slug: 'tokenmanager',
    description: 'Virtual token economy system',
    category: 'economy',
    isPopular: false,
    gamemodes: gm('skyblock', 'factions', 'minigames'),
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
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'fawe',
    name: 'FastAsyncWorldEdit',
    slug: 'fawe',
    description: 'Faster WorldEdit with async operations',
    category: 'world',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'multiverse',
    name: 'Multiverse-Core',
    slug: 'multiverse',
    description: 'Multiple world management',
    category: 'world',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'minigames'),
  },
  {
    id: 'voidgen',
    name: 'VoidGen',
    slug: 'voidgen',
    description: 'Void world generator',
    category: 'world',
    isPopular: false,
    gamemodes: gm('skyblock', 'minigames'),
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
    gamemodes: gm('survival', 'factions'),
  },
  {
    id: 'aureliumskills',
    name: 'AureliumSkills',
    slug: 'aureliumskills',
    description: 'Modern RPG skills plugin',
    category: 'fun',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock'),
  },
  {
    id: 'mythicmobs',
    name: 'MythicMobs',
    slug: 'mythicmobs',
    description: 'Custom mob creation and scripting',
    category: 'fun',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions'),
  },
  {
    id: 'citizens',
    name: 'Citizens',
    slug: 'citizens',
    description: 'NPC creation and management',
    category: 'fun',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'headdb',
    name: 'HeadDB',
    slug: 'headdb',
    description: 'Database of decorative heads',
    category: 'fun',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock'),
  },
  {
    id: 'crazyenchantments',
    name: 'CrazyEnchantments',
    slug: 'crazyenchantments',
    description: 'Custom enchantments system',
    category: 'fun',
    isPopular: false,
    gamemodes: gm('factions', 'skyblock'),
  },
  {
    id: 'ecoenchants',
    name: 'EcoEnchants',
    slug: 'ecoenchants',
    description: 'Modern custom enchantments',
    category: 'fun',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions'),
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
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'chatcontrol',
    name: 'ChatControl',
    slug: 'chatcontrol',
    description: 'Chat management and formatting',
    category: 'chat',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'venturechat',
    name: 'VentureChat',
    slug: 'venturechat',
    description: 'Advanced chat channels system',
    category: 'chat',
    isPopular: false,
    gamemodes: gm('survival', 'factions'),
  },
  {
    id: 'parties',
    name: 'Parties',
    slug: 'parties',
    description: 'Party system for players',
    category: 'chat',
    isPopular: false,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
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
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'decentholograms',
    name: 'DecentHolograms',
    slug: 'decentholograms',
    description: 'Hologram creation and management',
    category: 'display',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'holographicdisplays',
    name: 'HolographicDisplays',
    slug: 'holographicdisplays',
    description: 'Classic hologram plugin',
    category: 'display',
    isPopular: false,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'deluxemenus',
    name: 'DeluxeMenus',
    slug: 'deluxemenus',
    description: 'Custom GUI menu creation',
    category: 'display',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'ajleaderboards',
    name: 'ajLeaderboards',
    slug: 'ajleaderboards',
    description: 'Hologram leaderboards',
    category: 'display',
    isPopular: false,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
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
    gamemodes: gm('skyblock'),
  },
  {
    id: 'superiorskyblock',
    name: 'SuperiorSkyblock2',
    slug: 'superiorskyblock',
    description: 'Feature-rich skyblock plugin',
    category: 'gamemodes',
    isPopular: true,
    gamemodes: gm('skyblock'),
  },
  {
    id: 'factionsuuid',
    name: 'FactionsUUID',
    slug: 'factionsuuid',
    description: 'Classic factions gameplay',
    category: 'gamemodes',
    isPopular: true,
    gamemodes: gm('factions'),
  },
  {
    id: 'saberfactions',
    name: 'SaberFactions',
    slug: 'saberfactions',
    description: 'Modern factions fork',
    category: 'gamemodes',
    isPopular: false,
    gamemodes: gm('factions'),
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
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'viaversion',
    name: 'ViaVersion',
    slug: 'viaversion',
    description: 'Allow newer clients to join',
    category: 'utility',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'chestsort',
    name: 'ChestSort',
    slug: 'chestsort',
    description: 'Automatic chest sorting',
    category: 'utility',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock'),
  },
  {
    id: 'silkspawners',
    name: 'SilkSpawners',
    slug: 'silkspawners',
    description: 'Pick up and place spawners',
    category: 'utility',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions'),
  },
  {
    id: 'clearlag',
    name: 'ClearLag',
    slug: 'clearlag',
    description: 'Entity and lag management',
    category: 'utility',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions'),
  },
  {
    id: 'dynmap',
    name: 'Dynmap',
    slug: 'dynmap',
    description: 'Web-based live map',
    category: 'utility',
    isPopular: true,
    gamemodes: gm('survival', 'factions'),
  },
  {
    id: 'votingplugin',
    name: 'VotingPlugin',
    slug: 'votingplugin',
    description: 'Server voting rewards system',
    category: 'utility',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions'),
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
    gamemodes: gm('survival', 'factions'),
  },
  {
    id: 'pvpmanager',
    name: 'PvPManager',
    slug: 'pvpmanager',
    description: 'PvP toggle and protection',
    category: 'combat',
    isPopular: false,
    gamemodes: gm('survival'),
  },

  // ============================================
  // MINIGAMES CATEGORY
  // ============================================
  {
    id: 'bedwars',
    name: 'BedWars1058',
    slug: 'bedwars1058',
    description: 'Popular BedWars minigame plugin',
    category: 'gamemodes',
    isPopular: true,
    gamemodes: gm('minigames'),
  },
  {
    id: 'screamingbedwars',
    name: 'Screaming BedWars',
    slug: 'screamingbedwars',
    description: 'Flexible BedWars with CakeWars/EggWars variants',
    category: 'gamemodes',
    isPopular: true,
    gamemodes: gm('minigames'),
  },
  {
    id: 'skywars',
    name: 'SkyWars',
    slug: 'skywars',
    description: 'Classic SkyWars minigame',
    category: 'gamemodes',
    isPopular: true,
    gamemodes: gm('minigames'),
  },
  {
    id: 'murdermystery',
    name: 'Murder Mystery',
    slug: 'murdermystery',
    description: 'Murder mystery minigame',
    category: 'gamemodes',
    isPopular: false,
    gamemodes: gm('minigames'),
  },
  {
    id: 'buildbattle',
    name: 'BuildBattle',
    slug: 'buildbattle',
    description: 'Competitive building minigame',
    category: 'gamemodes',
    isPopular: false,
    gamemodes: gm('minigames'),
  },

  // ============================================
  // ANTICHEAT CATEGORY
  // ============================================
  {
    id: 'spartan',
    name: 'Spartan Anti-Cheat',
    slug: 'spartan',
    description: 'Popular anticheat with Bedrock/Geyser support',
    category: 'moderation',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'vulcan',
    name: 'Vulcan Anti-Cheat',
    slug: 'vulcan',
    description: 'Advanced packet-based cheat detection',
    category: 'moderation',
    isPopular: true,
    gamemodes: gm('factions', 'minigames'),
  },
  {
    id: 'grim',
    name: 'Grim Anticheat',
    slug: 'grim',
    description: 'Free open-source anticheat for 1.8-1.21',
    category: 'moderation',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'matrix',
    name: 'Matrix Anti-Cheat',
    slug: 'matrix',
    description: 'Configurable anticheat with high customization',
    category: 'moderation',
    isPopular: false,
    gamemodes: gm('factions', 'minigames'),
  },
  {
    id: 'nocheatplus',
    name: 'NoCheatPlus',
    slug: 'nocheatplus',
    description: 'Classic free anticheat plugin',
    category: 'moderation',
    isPopular: false,
    gamemodes: gm('survival', 'skyblock', 'factions'),
  },

  // ============================================
  // CRATES & REWARDS CATEGORY
  // ============================================
  {
    id: 'excellentcrates',
    name: 'ExcellentCrates',
    slug: 'excellentcrates',
    description: 'Advanced free crates with animations',
    category: 'fun',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions'),
  },
  {
    id: 'crazycrates',
    name: 'CrazyCrates',
    slug: 'crazycrates',
    description: 'Feature-rich crate plugin with previews',
    category: 'fun',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions'),
  },
  {
    id: 'cosmicvaults',
    name: 'CosmicVaults',
    slug: 'cosmicvaults',
    description: 'Virtual backpacks and storage',
    category: 'economy',
    isPopular: false,
    gamemodes: gm('skyblock', 'factions'),
  },

  // ============================================
  // BACKPACKS & STORAGE
  // ============================================
  {
    id: 'minepacks',
    name: 'Minepacks',
    slug: 'minepacks',
    description: 'Free backpack plugin with customization',
    category: 'utility',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock'),
  },
  {
    id: 'betterbackpacks',
    name: 'BetterBackpacks',
    slug: 'betterbackpacks',
    description: 'Simple backpack implementation',
    category: 'utility',
    isPopular: false,
    gamemodes: gm('survival', 'skyblock'),
  },

  // ============================================
  // CROSS-PLATFORM / PROXY
  // ============================================
  {
    id: 'geyser',
    name: 'Geyser',
    slug: 'geyser',
    description: 'Allow Bedrock players to join Java servers',
    category: 'utility',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'floodgate',
    name: 'Floodgate',
    slug: 'floodgate',
    description: 'Bedrock authentication for online-mode servers',
    category: 'utility',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'viabackwards',
    name: 'ViaBackwards',
    slug: 'viabackwards',
    description: 'Allow older clients to join newer servers',
    category: 'utility',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },

  // ============================================
  // PERFORMANCE & WORLD MANAGEMENT
  // ============================================
  {
    id: 'chunky',
    name: 'Chunky',
    slug: 'chunky',
    description: 'Fast chunk pre-generation',
    category: 'world',
    isPopular: true,
    gamemodes: gm('survival', 'factions'),
  },
  {
    id: 'levelledmobs',
    name: 'LevelledMobs',
    slug: 'levelledmobs',
    description: 'RPG-style mob leveling system',
    category: 'fun',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock'),
  },
  {
    id: 'farmprotect',
    name: 'FarmProtect',
    slug: 'farmprotect',
    description: 'Stop players from trampling farmland',
    category: 'protection',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock'),
  },

  // ============================================
  // SOCIAL & MISCELLANEOUS
  // ============================================
  {
    id: 'marriagemaster',
    name: 'Marriage Master',
    slug: 'marriagemaster',
    description: 'Marriage system for players',
    category: 'chat',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock'),
  },
  {
    id: 'friends',
    name: 'Friends',
    slug: 'friends',
    description: 'Friend list and party system',
    category: 'chat',
    isPopular: false,
    gamemodes: gm('survival', 'skyblock', 'minigames'),
  },
  {
    id: 'ultimateclaims',
    name: 'UltimateClaims',
    slug: 'ultimateclaims',
    description: 'Chunk-based claiming with GUI',
    category: 'protection',
    isPopular: false,
    gamemodes: gm('survival'),
  },

  // ============================================
  // MORE ECONOMY PLUGINS
  // ============================================
  {
    id: 'coinsengine',
    name: 'CoinsEngine',
    slug: 'coinsengine',
    description: 'Modern multi-currency economy',
    category: 'economy',
    isPopular: false,
    gamemodes: gm('survival', 'skyblock', 'minigames'),
  },
  {
    id: 'economyshopgui',
    name: 'EconomyShopGUI',
    slug: 'economyshopgui',
    description: 'Simple shop GUI with dynamic pricing',
    category: 'economy',
    isPopular: false,
    gamemodes: gm('survival', 'skyblock'),
  },
  {
    id: 'tradingcards',
    name: 'TradingCards',
    slug: 'tradingcards',
    description: 'Collectible trading cards from mobs',
    category: 'fun',
    isPopular: false,
    gamemodes: gm('survival'),
  },

  // ============================================
  // TELEPORTATION & WARPS
  // ============================================
  {
    id: 'advancedteleport',
    name: 'AdvancedTeleport',
    slug: 'advancedteleport',
    description: 'Homes, warps, and teleport requests',
    category: 'essentials',
    isPopular: false,
    gamemodes: gm('survival', 'skyblock'),
  },
  {
    id: 'betterrtp',
    name: 'BetterRTP',
    slug: 'betterrtp',
    description: 'Random teleport with region support',
    category: 'utility',
    isPopular: true,
    gamemodes: gm('survival'),
  },
  {
    id: 'huskhomes',
    name: 'HuskHomes',
    slug: 'huskhomes',
    description: 'Cross-server homes and warps',
    category: 'essentials',
    isPopular: false,
    gamemodes: gm('minigames'),
  },

  // ============================================
  // BOSS & CUSTOM MOBS
  // ============================================
  {
    id: 'elitemobs',
    name: 'EliteMobs',
    slug: 'elitemobs',
    description: 'Elite mobs, dungeons, and boss fights',
    category: 'fun',
    isPopular: true,
    gamemodes: gm('survival'),
  },
  {
    id: 'infernalmobs',
    name: 'InfernalMobs',
    slug: 'infernalmobs',
    description: 'Random powered-up mobs with abilities',
    category: 'fun',
    isPopular: false,
    gamemodes: gm('survival'),
  },
  {
    id: 'customfishing',
    name: 'CustomFishing',
    slug: 'customfishing',
    description: 'Enhanced fishing mechanics and rewards',
    category: 'fun',
    isPopular: false,
    gamemodes: gm('survival', 'skyblock'),
  },

  // ============================================
  // ENCHANTMENTS & ITEMS
  // ============================================
  {
    id: 'enchantsplus',
    name: 'EnchantsPlus',
    slug: 'enchantsplus',
    description: 'Custom enchantments with GUI',
    category: 'fun',
    isPopular: false,
    gamemodes: gm('survival', 'factions'),
  },
  {
    id: 'itemsadder',
    name: 'ItemsAdder',
    slug: 'itemsadder',
    description: 'Custom items, blocks, mobs, and GUIs',
    category: 'fun',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock'),
  },
  {
    id: 'oraxen',
    name: 'Oraxen',
    slug: 'oraxen',
    description: 'Custom items with resource pack generation',
    category: 'fun',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock'),
  },
  {
    id: 'executableitems',
    name: 'ExecutableItems',
    slug: 'executableitems',
    description: 'Items that run commands on use',
    category: 'fun',
    isPopular: false,
    gamemodes: gm('survival', 'skyblock', 'factions'),
  },

  // ============================================
  // QUESTS & PROGRESSION
  // ============================================
  {
    id: 'quests',
    name: 'Quests',
    slug: 'quests',
    description: 'Quest creation and management',
    category: 'fun',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock'),
  },
  {
    id: 'betonquest',
    name: 'BetonQuest',
    slug: 'betonquest',
    description: 'Advanced quest scripting system',
    category: 'fun',
    isPopular: false,
    gamemodes: gm('survival'),
  },
  {
    id: 'notquests',
    name: 'NotQuests',
    slug: 'notquests',
    description: 'Modern quest system with GUI editor',
    category: 'fun',
    isPopular: false,
    gamemodes: gm('survival', 'skyblock'),
  },

  // ============================================
  // RANKS & PROGRESSION
  // ============================================
  {
    id: 'rankup',
    name: 'RankUp',
    slug: 'rankup',
    description: 'Automatic rank progression',
    category: 'essentials',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions'),
  },
  {
    id: 'ezrankslite',
    name: 'EZRanksLite',
    slug: 'ezrankslite',
    description: 'Simple rankup ladder system',
    category: 'essentials',
    isPopular: false,
    gamemodes: gm('survival', 'skyblock'),
  },
  {
    id: 'prestigeplus',
    name: 'PrestigePlus',
    slug: 'prestigeplus',
    description: 'Prestige system for rank ladders',
    category: 'essentials',
    isPopular: false,
    gamemodes: gm('skyblock', 'factions'),
  },

  // ============================================
  // VOICE & COMMUNICATION
  // ============================================
  {
    id: 'simplevoicechat',
    name: 'Simple Voice Chat',
    slug: 'simple-voice-chat',
    description: 'Proximity voice chat with groups and PTT',
    category: 'chat',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'interactivechat',
    name: 'InteractiveChat',
    slug: 'interactivechat',
    description: 'Enhanced chat with item/inventory preview on hover',
    category: 'chat',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions'),
  },

  // ============================================
  // PERFORMANCE & DIAGNOSTICS
  // ============================================
  {
    id: 'spark',
    name: 'Spark',
    slug: 'spark',
    description: 'Performance profiler for diagnosing lag',
    category: 'utility',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'wildstacker',
    name: 'WildStacker',
    slug: 'wildstacker',
    description: 'Stack mobs, items, and spawners for performance',
    category: 'utility',
    isPopular: true,
    gamemodes: gm('skyblock', 'factions'),
  },

  // ============================================
  // WEB MAPS
  // ============================================
  {
    id: 'bluemap',
    name: 'BlueMap',
    slug: 'bluemap',
    description: '3D web-based world map with real-time updates',
    category: 'utility',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions'),
  },
  {
    id: 'squaremap',
    name: 'Squaremap',
    slug: 'squaremap',
    description: 'Lightweight 2D web map with better performance',
    category: 'utility',
    isPopular: false,
    gamemodes: gm('survival', 'factions'),
  },

  // ============================================
  // SKINS & COSMETICS
  // ============================================
  {
    id: 'skinsrestorer',
    name: 'SkinsRestorer',
    slug: 'skinsrestorer',
    description: 'Skin management for offline/online servers',
    category: 'utility',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'ultracosmetics',
    name: 'UltraCosmetics',
    slug: 'ultracosmetics',
    description: 'Free cosmetics: gadgets, pets, mounts, particles',
    category: 'display',
    isPopular: true,
    gamemodes: gm('minigames', 'survival', 'skyblock'),
  },
  {
    id: 'playerparticles',
    name: 'PlayerParticles',
    slug: 'playerparticles',
    description: 'Custom particle effects for players',
    category: 'display',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'minigames'),
  },

  // ============================================
  // DONATION & MONETIZATION
  // ============================================
  {
    id: 'tebex',
    name: 'Tebex',
    slug: 'tebex',
    description: 'Donation store integration (formerly Buycraft)',
    category: 'economy',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },

  // ============================================
  // LIBRARIES & DEPENDENCIES
  // ============================================
  {
    id: 'protocollib',
    name: 'ProtocolLib',
    slug: 'protocollib',
    description: 'Packet manipulation library (required by many plugins)',
    category: 'utility',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },

  // ============================================
  // RPG & TECH
  // ============================================
  {
    id: 'slimefun',
    name: 'Slimefun4',
    slug: 'slimefun4',
    description: 'Tech and magic modpack experience without mods',
    category: 'fun',
    isPopular: true,
    gamemodes: gm('survival'),
  },

  // ============================================
  // ANIMATIONS & INTERACTIONS
  // ============================================
  {
    id: 'gsit',
    name: 'GSit',
    slug: 'gsit',
    description: 'Sit, lay, crawl, and spin animations',
    category: 'fun',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock'),
  },

  // ============================================
  // ANALYTICS
  // ============================================
  {
    id: 'plan',
    name: 'Plan',
    slug: 'plan',
    description: 'Player analytics, statistics, and web dashboard',
    category: 'utility',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },

  // ============================================
  // ADDITIONAL ANTICHEATS
  // ============================================
  {
    id: 'polar',
    name: 'Polar Anticheat',
    slug: 'polar',
    description: 'Cloud-based premium anticheat with ML detection',
    category: 'moderation',
    isPopular: true,
    gamemodes: gm('factions', 'minigames'),
  },
  {
    id: 'intave',
    name: 'Intave Anticheat',
    slug: 'intave',
    description: 'Premium anticheat for competitive servers',
    category: 'moderation',
    isPopular: false,
    gamemodes: gm('factions', 'minigames'),
  },

  // ============================================
  // PRISON GAMEMODE
  // ============================================
  {
    id: 'prison',
    name: 'Prison',
    slug: 'prison',
    description: 'Core prison plugin with mines, ranks, and prestiges',
    category: 'gamemodes',
    isPopular: true,
    gamemodes: gm('factions'),
  },
  {
    id: 'tokenenchant',
    name: 'TokenEnchant',
    slug: 'tokenenchant',
    description: 'Custom pickaxe enchantments for prison servers',
    category: 'fun',
    isPopular: true,
    gamemodes: gm('factions'),
  },
  {
    id: 'mineresetlite',
    name: 'MineResetLite',
    slug: 'mineresetlite',
    description: 'Automatic mine reset and management',
    category: 'gamemodes',
    isPopular: false,
    gamemodes: gm('factions'),
  },

  // ============================================
  // ADDITIONAL MODERATION
  // ============================================
  {
    id: 'supervanish',
    name: 'SuperVanish',
    slug: 'supervanish',
    description: 'Free advanced vanish plugin',
    category: 'moderation',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'antiworlddownloader',
    name: 'AntiWorldDownloader',
    slug: 'antiworlddownloader',
    description: 'Prevent players from downloading your world',
    category: 'moderation',
    isPopular: false,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'exploitfixer',
    name: 'ExploitFixer',
    slug: 'exploitfixer',
    description: 'Block common exploits, crashes, and dupes',
    category: 'moderation',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock', 'factions', 'minigames'),
  },
  {
    id: 'illegalstack',
    name: 'IllegalStack',
    slug: 'illegalstack',
    description: 'Prevent illegal item stacks and NBT exploits',
    category: 'moderation',
    isPopular: false,
    gamemodes: gm('survival', 'skyblock', 'factions'),
  },

  // ============================================
  // TREE FELLING
  // ============================================
  {
    id: 'ultimatetimber',
    name: 'UltimateTimber',
    slug: 'ultimatetimber',
    description: 'Chop down entire trees at once',
    category: 'utility',
    isPopular: true,
    gamemodes: gm('survival', 'skyblock'),
  },

  // ============================================
  // FUN & MISCELLANEOUS
  // ============================================
  {
    id: 'brewery',
    name: 'Brewery',
    slug: 'brewery',
    description: 'Alcohol brewing with fermentation and drunk effects',
    category: 'fun',
    isPopular: true,
    gamemodes: gm('survival'),
  },
];

export const pluginsByCategory = plugins.reduce((acc, plugin) => {
  if (!acc[plugin.category]) {
    acc[plugin.category] = [];
  }
  acc[plugin.category].push(plugin);
  return acc;
}, {} as Record<string, Plugin[]>);

export const pluginsByGamemode = plugins.reduce((acc, plugin) => {
  const modes = plugin.gamemodes || ['all'];
  modes.forEach(mode => {
    if (!acc[mode]) {
      acc[mode] = [];
    }
    acc[mode].push(plugin);
  });
  return acc;
}, {} as Record<string, Plugin[]>);

export const popularPlugins = plugins.filter(p => p.isPopular);
