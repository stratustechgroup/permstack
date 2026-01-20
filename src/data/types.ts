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
  prefixColor: string;
  order: number;
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
