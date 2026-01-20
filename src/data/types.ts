export type ServerType =
  | 'survival'
  | 'factions'
  | 'skyblock'
  | 'prison'
  | 'minigames'
  | 'creative'
  | 'custom';

export type RiskLevel = 'safe' | 'moderate' | 'dangerous' | 'critical';

export type RankLevel = 'player' | 'vip' | 'helper' | 'mod' | 'admin' | 'owner';

export interface Plugin {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'essentials' | 'protection' | 'economy' | 'moderation' | 'world' | 'fun';
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
