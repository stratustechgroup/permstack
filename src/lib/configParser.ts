import yaml from 'js-yaml';
import type { Rank, RankLevel } from '../data/types';
import type { PermissionPluginType } from './generateYaml';

export interface ParsedConfig {
  pluginType: PermissionPluginType;
  ranks: ParsedRank[];
  detectedPlugins: string[]; // Plugin IDs detected from permissions
}

export interface ParsedRank {
  name: string;
  displayName?: string;
  prefix?: string;
  color: string;
  weight: number;
  permissions: string[];
  parents: string[];
}

interface LuckPermsGroup {
  weight?: number;
  prefix?: string;
  permissions?: string[];
  parents?: string[];
}

interface GroupManagerGroup {
  permissions?: string[];
  inheritance?: string[];
  info?: {
    prefix?: string;
    build?: boolean;
    suffix?: string;
  };
}

interface PermissionsExGroup {
  permissions?: string[];
  parents?: string[];
  options?: {
    prefix?: string;
    suffix?: string;
    default?: boolean;
  };
}

interface LuckPermsJsonExport {
  groups?: Array<{
    name: string;
    nodes: Array<{
      key: string;
      value?: boolean;
      context?: Record<string, string>;
    }>;
  }>;
}

// Color palette for ranks
const rankColors = [
  '#9CA3AF', // gray for default
  '#10B981', // green for VIP
  '#8B5CF6', // purple for MVP
  '#F59E0B', // amber for elite
  '#3B82F6', // blue for helper
  '#EC4899', // pink for mod
  '#EF4444', // red for admin
  '#FBBF24', // yellow for owner
];

// Known plugin permission prefixes
const pluginPrefixMap: Record<string, string> = {
  'essentials.': 'essentialsx',
  'worldguard.': 'worldguard',
  'worldedit.': 'worldedit',
  'griefprevention.': 'griefprevention',
  'towny.': 'towny',
  'vault.': 'vault',
  'cmi.': 'cmi',
  'mcmmo.': 'mcmmo',
  'jobs.': 'jobs',
  'aureliumskills.': 'aureliumskills',
  'shopguiplus.': 'shopguiplus',
  'deluxemenus.': 'deluxemenus',
  'chestsort.': 'chestsort',
  'coreprotect.': 'coreprotect',
  'litebans.': 'litebans',
  'advancedban.': 'advancedban',
  'lands.': 'lands',
  'askyblock.': 'askyblock',
  'bskyblock.': 'bskyblock',
  'bentobox.': 'bentobox',
  'factions.': 'factions',
  'kingdoms.': 'kingdoms',
  'multiverse.': 'multiverse',
  'holographicdisplays.': 'holographicdisplays',
  'citizens.': 'citizens',
  'mythicmobs.': 'mythicmobs',
  'quickshop.': 'quickshop',
  'chestshop.': 'chestshop',
  'silkspawners.': 'silkspawners',
  'nocheatplus.': 'nocheatplus',
  'viaversion.': 'viaversion',
  'placeholderapi.': 'placeholderapi',
  'skript.': 'skript',
};

function detectPluginsFromPermissions(permissions: string[]): string[] {
  const detected = new Set<string>();

  for (const perm of permissions) {
    const permLower = perm.toLowerCase();
    for (const [prefix, pluginId] of Object.entries(pluginPrefixMap)) {
      if (permLower.startsWith(prefix)) {
        detected.add(pluginId);
        break;
      }
    }
  }

  return Array.from(detected);
}

function assignRankColor(index: number): string {
  return rankColors[index % rankColors.length];
}

export function detectPluginType(content: string): PermissionPluginType | null {
  // Try to parse as JSON first (LuckPerms JSON export)
  try {
    const json = JSON.parse(content);
    if (json.groups && Array.isArray(json.groups)) {
      return 'luckperms';
    }
  } catch {
    // Not JSON, try YAML
  }

  // Try to parse as YAML
  try {
    const parsed = yaml.load(content) as Record<string, unknown>;

    // Check for LuckPerms YAML structure
    if (parsed && typeof parsed === 'object') {
      const keys = Object.keys(parsed);

      // GroupManager has 'groups' with specific structure
      if (parsed.groups && typeof parsed.groups === 'object') {
        const groupsObj = parsed.groups as Record<string, unknown>;
        const firstGroup = Object.values(groupsObj)[0] as Record<string, unknown> | undefined;

        if (firstGroup) {
          // GroupManager uses 'inheritance', PermissionsEx uses 'parents'
          if ('inheritance' in firstGroup || (firstGroup.info && typeof firstGroup.info === 'object')) {
            return 'groupmanager';
          }
          if ('parents' in firstGroup && 'options' in firstGroup) {
            return 'permissionsex';
          }
        }
      }

      // LuckPerms YAML has groups at root level with weight/permissions
      const firstValue = parsed[keys[0]] as Record<string, unknown> | undefined;
      if (firstValue && typeof firstValue === 'object') {
        if ('weight' in firstValue || ('permissions' in firstValue && !('inheritance' in firstValue))) {
          return 'luckperms';
        }
      }
    }
  } catch {
    // Parse error
  }

  return null;
}

export function parseLuckPermsYaml(content: string): ParsedConfig {
  const parsed = yaml.load(content) as Record<string, LuckPermsGroup>;
  const ranks: ParsedRank[] = [];
  const allPermissions: string[] = [];

  let index = 0;
  for (const [name, group] of Object.entries(parsed)) {
    if (typeof group !== 'object' || !group) continue;

    const permissions = group.permissions || [];
    allPermissions.push(...permissions);

    ranks.push({
      name: name.toLowerCase(),
      displayName: name.charAt(0).toUpperCase() + name.slice(1),
      prefix: group.prefix,
      color: assignRankColor(index),
      weight: group.weight || index * 10,
      permissions,
      parents: group.parents || [],
    });
    index++;
  }

  // Sort by weight
  ranks.sort((a, b) => a.weight - b.weight);

  return {
    pluginType: 'luckperms',
    ranks,
    detectedPlugins: detectPluginsFromPermissions(allPermissions),
  };
}

export function parseLuckPermsJson(content: string): ParsedConfig {
  const parsed = JSON.parse(content) as LuckPermsJsonExport;
  const ranks: ParsedRank[] = [];
  const allPermissions: string[] = [];

  if (!parsed.groups) {
    return { pluginType: 'luckperms', ranks: [], detectedPlugins: [] };
  }

  let index = 0;
  for (const group of parsed.groups) {
    const permissions: string[] = [];
    const parents: string[] = [];
    let weight = index * 10;
    let prefix: string | undefined;

    for (const node of group.nodes) {
      if (node.key.startsWith('group.')) {
        parents.push(node.key.replace('group.', ''));
      } else if (node.key.startsWith('weight.')) {
        weight = parseInt(node.key.replace('weight.', ''), 10);
      } else if (node.key.startsWith('prefix.')) {
        prefix = node.key.split('.').pop();
      } else if (node.value !== false) {
        permissions.push(node.key);
      }
    }

    allPermissions.push(...permissions);

    ranks.push({
      name: group.name.toLowerCase(),
      displayName: group.name.charAt(0).toUpperCase() + group.name.slice(1),
      prefix,
      color: assignRankColor(index),
      weight,
      permissions,
      parents,
    });
    index++;
  }

  ranks.sort((a, b) => a.weight - b.weight);

  return {
    pluginType: 'luckperms',
    ranks,
    detectedPlugins: detectPluginsFromPermissions(allPermissions),
  };
}

export function parseGroupManagerYaml(content: string): ParsedConfig {
  const parsed = yaml.load(content) as { groups?: Record<string, GroupManagerGroup> };
  const ranks: ParsedRank[] = [];
  const allPermissions: string[] = [];

  if (!parsed.groups) {
    return { pluginType: 'groupmanager', ranks: [], detectedPlugins: [] };
  }

  let index = 0;
  for (const [name, group] of Object.entries(parsed.groups)) {
    if (typeof group !== 'object' || !group) continue;

    const permissions = group.permissions || [];
    allPermissions.push(...permissions);

    ranks.push({
      name: name.toLowerCase(),
      displayName: name.charAt(0).toUpperCase() + name.slice(1),
      prefix: group.info?.prefix,
      color: assignRankColor(index),
      weight: index * 10,
      permissions,
      parents: group.inheritance || [],
    });
    index++;
  }

  return {
    pluginType: 'groupmanager',
    ranks,
    detectedPlugins: detectPluginsFromPermissions(allPermissions),
  };
}

export function parsePermissionsExYaml(content: string): ParsedConfig {
  const parsed = yaml.load(content) as { groups?: Record<string, PermissionsExGroup> };
  const ranks: ParsedRank[] = [];
  const allPermissions: string[] = [];

  if (!parsed.groups) {
    return { pluginType: 'permissionsex', ranks: [], detectedPlugins: [] };
  }

  let index = 0;
  for (const [name, group] of Object.entries(parsed.groups)) {
    if (typeof group !== 'object' || !group) continue;

    const permissions = group.permissions || [];
    allPermissions.push(...permissions);

    ranks.push({
      name: name.toLowerCase(),
      displayName: name.charAt(0).toUpperCase() + name.slice(1),
      prefix: group.options?.prefix,
      color: assignRankColor(index),
      weight: index * 10,
      permissions,
      parents: group.parents || [],
    });
    index++;
  }

  return {
    pluginType: 'permissionsex',
    ranks,
    detectedPlugins: detectPluginsFromPermissions(allPermissions),
  };
}

export function parseConfig(content: string): ParsedConfig | null {
  const pluginType = detectPluginType(content);

  if (!pluginType) {
    return null;
  }

  try {
    // Check if it's JSON
    try {
      JSON.parse(content);
      return parseLuckPermsJson(content);
    } catch {
      // Not JSON, continue with YAML
    }

    switch (pluginType) {
      case 'luckperms':
        return parseLuckPermsYaml(content);
      case 'groupmanager':
        return parseGroupManagerYaml(content);
      case 'permissionsex':
        return parsePermissionsExYaml(content);
      default:
        return null;
    }
  } catch (error) {
    console.error('Error parsing config:', error);
    return null;
  }
}

// Guess the RankLevel based on rank name
function guessRankLevel(name: string): RankLevel {
  const nameLower = name.toLowerCase();

  if (nameLower.includes('owner')) return 'owner';
  if (nameLower.includes('admin')) return 'admin';
  if (nameLower.includes('mod') || nameLower.includes('moderator')) return 'mod';
  if (nameLower.includes('helper') || nameLower.includes('trial')) return 'helper';
  if (nameLower.includes('elite') || nameLower.includes('legendary')) return 'elite';
  if (nameLower.includes('mvp+') || nameLower.includes('mvpplus')) return 'mvp_plus';
  if (nameLower.includes('mvp')) return 'mvp';
  if (nameLower.includes('vip+') || nameLower.includes('vipplus')) return 'vip_plus';
  if (nameLower.includes('vip') || nameLower.includes('donor')) return 'vip';
  if (nameLower.includes('default') || nameLower.includes('member') || nameLower.includes('player')) return 'player';

  // Default based on position
  return 'player';
}

// Extract prefix color from prefix string (e.g., "&c[Admin]" -> "&c")
function extractPrefixColor(prefix: string | undefined): string {
  if (!prefix) return '&7';

  // Look for legacy color codes (&c, &a, etc.)
  const legacyMatch = prefix.match(/&[0-9a-fk-or]/i);
  if (legacyMatch) return legacyMatch[0];

  // Look for hex colors (#RRGGBB)
  const hexMatch = prefix.match(/#[0-9a-fA-F]{6}/);
  if (hexMatch) return hexMatch[0];

  return '&7';
}

// Convert parsed ranks to our Rank format
export function convertToRanks(parsedRanks: ParsedRank[]): Rank[] {
  return parsedRanks.map((pr, index) => ({
    id: pr.name,
    name: pr.displayName || pr.name,
    displayName: pr.displayName || pr.name.charAt(0).toUpperCase() + pr.name.slice(1),
    prefix: pr.prefix || `[${pr.displayName || pr.name}]`,
    prefixColor: extractPrefixColor(pr.prefix) || pr.color,
    separator: ' ',
    order: index,
    level: guessRankLevel(pr.name),
  }));
}
