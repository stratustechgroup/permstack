export type ServerType =
  | 'survival'
  | 'factions'
  | 'skyblock'
  | 'prison'
  | 'minigames'
  | 'creative'
  | 'custom';

export type RiskLevel = 'safe' | 'moderate' | 'dangerous' | 'critical';

// Rank hierarchy: player -> donor tiers -> staff tiers
// Donor tiers: vip < vip_plus < mvp < mvp_plus < elite
// Staff tiers: helper < mod < admin < owner
export type RankLevel =
  | 'player'      // Default rank - basic gameplay permissions
  | 'vip'         // Donor Tier 1 - entry-level perks
  | 'vip_plus'    // Donor Tier 2 - enhanced perks
  | 'mvp'         // Donor Tier 3 - premium perks
  | 'mvp_plus'    // Donor Tier 4 - advanced perks
  | 'elite'       // Donor Tier 5 - top-tier donor perks
  | 'helper'      // Staff Tier 1 - junior moderation
  | 'mod'         // Staff Tier 2 - full moderation
  | 'admin'       // Staff Tier 3 - server administration
  | 'owner';      // Staff Tier 4 - full server access

// Helper to check if a rank is a donor rank
export const isDonorRank = (rank: RankLevel): boolean =>
  ['vip', 'vip_plus', 'mvp', 'mvp_plus', 'elite'].includes(rank);

// Helper to check if a rank is a staff rank
export const isStaffRank = (rank: RankLevel): boolean =>
  ['helper', 'mod', 'admin', 'owner'].includes(rank);

// Rank order for comparison (higher = more permissions)
export const RANK_ORDER: Record<RankLevel, number> = {
  player: 0,
  vip: 1,
  vip_plus: 2,
  mvp: 3,
  mvp_plus: 4,
  elite: 5,
  helper: 6,
  mod: 7,
  admin: 8,
  owner: 9,
};

export type PluginCategory =
  | 'essentials'
  | 'protection'
  | 'economy'
  | 'moderation'
  | 'world'
  | 'fun'
  | 'chat'
  | 'display'
  | 'gamemodes'
  | 'utility'
  | 'combat';

export interface Plugin {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: PluginCategory;
  isPopular: boolean;
}

export interface PermissionNode {
  id: string;
  pluginId: string;
  node: string;
  description: string;
  recommendedRank: RankLevel;
  riskLevel: RiskLevel;
  serverTypes: ServerType[];
  isDefault: boolean;
}

export interface Rank {
  id: string;
  name: string;
  displayName: string;
  prefix: string;
  prefixColor: string; // Can be legacy (&c), hex (#FF5555), or gradient (<gradient:#FF0000:#00FF00>)
  separator: string; // Custom separator like ":" or "→" or "»"
  order: number;
  level: RankLevel; // Maps to permission level for generating correct permissions
}

export interface RankLevelInfo {
  id: RankLevel;
  name: string;
  description: string;
  examples: string[];
}

export interface RankTemplate {
  id: string;
  name: string;
  description: string;
  ranks: Rank[];
}

export interface GeneratorConfig {
  serverType: ServerType;
  selectedPlugins: string[];
  ranks: Rank[];
  selectedPermissions: Record<string, string[]>; // rankId -> permissionIds
}
