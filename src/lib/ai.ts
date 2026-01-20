/**
 * AI Service for PermStack
 * Hybrid approach: Local heuristics first, API fallback for complex cases
 */

import type { RankLevel, PermissionNode, ServerType } from '../data/types';
import { RANK_ORDER, isDonorRank, isStaffRank } from '../data/types';

// ============================================
// CONFIGURATION
// ============================================

export interface AIConfig {
  apiKey?: string;
  apiProvider?: 'anthropic' | 'openai';
  enableWebSearch?: boolean;
}

let config: AIConfig = {};

export function configureAI(newConfig: AIConfig) {
  config = { ...config, ...newConfig };
}

export function getAIConfig(): AIConfig {
  return { ...config };
}

export function isAIConfigured(): boolean {
  return !!config.apiKey;
}

// ============================================
// RANK LEVEL DETECTION
// ============================================

export interface RankDetectionResult {
  level: RankLevel;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

export interface RankDetectionInput {
  name: string;
  description?: string;
  targetAudience?: 'donors' | 'staff' | 'players' | 'unknown';
}

// Pattern-based rank detection (local heuristics)
const rankPatterns: { pattern: RegExp; level: RankLevel; priority: number }[] = [
  // Owner/Admin patterns
  { pattern: /^(owner|co-?owner|founder|dev(eloper)?|creator|op)$/i, level: 'owner', priority: 100 },
  { pattern: /^(admin(istrator)?|manager|sr\.?\s*admin|senior\s*admin|head\s*admin)$/i, level: 'admin', priority: 90 },

  // Moderator patterns
  { pattern: /^(mod(erator)?|sr\.?\s*mod|senior\s*mod|guardian|enforcer)$/i, level: 'mod', priority: 80 },
  { pattern: /^(helper|jr\.?\s*mod|junior\s*mod|trial\s*mod|trainee|support|assistant)$/i, level: 'helper', priority: 70 },

  // Elite/Top donor patterns
  { pattern: /^(elite|legend(ary)?|immortal|mythic|ultimate|overlord|god|titan|supreme)$/i, level: 'elite', priority: 60 },
  { pattern: /^(prestige|cosmic|divine|celestial|ethereal|transcendent)$/i, level: 'elite', priority: 59 },

  // MVP+ patterns
  { pattern: /^(mvp\+|mvp\s*plus|titanium|master|heroic|platinum\s*\+)$/i, level: 'mvp_plus', priority: 50 },
  { pattern: /^(emperor|king|queen|royal|noble\s*\+)$/i, level: 'mvp_plus', priority: 49 },

  // MVP patterns
  { pattern: /^(mvp|diamond|platinum|noble|champion|knight)$/i, level: 'mvp', priority: 40 },
  { pattern: /^(hero|warrior|lord|duke)$/i, level: 'mvp', priority: 39 },

  // VIP+ patterns
  { pattern: /^(vip\+|vip\s*plus|gold|premium|silver|emerald)$/i, level: 'vip_plus', priority: 30 },
  { pattern: /^(plus|enhanced|upgraded|super)$/i, level: 'vip_plus', priority: 29 },

  // VIP patterns
  { pattern: /^(vip|supporter|donator|donor|bronze|iron|copper)$/i, level: 'vip', priority: 20 },
  { pattern: /^(member\s*\+|patron|backer|contributor)$/i, level: 'vip', priority: 19 },

  // Player/Default patterns
  { pattern: /^(player|member|citizen|newcomer|recruit|default|guest|user)$/i, level: 'player', priority: 10 },
  { pattern: /^(beginner|starter|new|fresh)$/i, level: 'player', priority: 9 },
];

// Keywords that suggest certain rank types
const donorKeywords = ['vip', 'donor', 'donator', 'premium', 'supporter', 'gold', 'diamond', 'platinum', 'elite', 'mvp', 'legend'];
const staffKeywords = ['mod', 'admin', 'helper', 'owner', 'staff', 'manager', 'operator', 'guardian', 'enforcer'];

export function detectRankLevel(rankName: string): RankDetectionResult {
  const normalized = rankName.trim().toLowerCase();

  // Try exact pattern matches first
  const matches = rankPatterns
    .filter(({ pattern }) => pattern.test(normalized))
    .sort((a, b) => b.priority - a.priority);

  if (matches.length > 0) {
    return {
      level: matches[0].level,
      confidence: 'high',
      reason: `Matched pattern for "${rankName}"`,
    };
  }

  // Try keyword-based detection
  const words = normalized.split(/[\s\-_]+/);

  // Check for staff keywords
  for (const word of words) {
    if (staffKeywords.some(kw => word.includes(kw))) {
      // Determine which staff level
      if (word.includes('owner') || word.includes('founder')) {
        return { level: 'owner', confidence: 'medium', reason: 'Contains owner/founder keyword' };
      }
      if (word.includes('admin')) {
        return { level: 'admin', confidence: 'medium', reason: 'Contains admin keyword' };
      }
      if (word.includes('mod')) {
        return { level: 'mod', confidence: 'medium', reason: 'Contains mod keyword' };
      }
      if (word.includes('helper') || word.includes('trial') || word.includes('junior')) {
        return { level: 'helper', confidence: 'medium', reason: 'Contains helper keyword' };
      }
      return { level: 'mod', confidence: 'low', reason: 'Contains staff-related keyword' };
    }
  }

  // Check for donor keywords
  for (const word of words) {
    if (donorKeywords.some(kw => word.includes(kw))) {
      // Try to determine tier from other keywords
      if (word.includes('elite') || word.includes('legend') || word.includes('mythic') || word.includes('ultimate')) {
        return { level: 'elite', confidence: 'medium', reason: 'Contains elite-tier keyword' };
      }
      if (word.includes('mvp')) {
        if (normalized.includes('+') || normalized.includes('plus')) {
          return { level: 'mvp_plus', confidence: 'medium', reason: 'Contains MVP+ keyword' };
        }
        return { level: 'mvp', confidence: 'medium', reason: 'Contains MVP keyword' };
      }
      if (word.includes('vip')) {
        if (normalized.includes('+') || normalized.includes('plus')) {
          return { level: 'vip_plus', confidence: 'medium', reason: 'Contains VIP+ keyword' };
        }
        return { level: 'vip', confidence: 'medium', reason: 'Contains VIP keyword' };
      }
      if (word.includes('diamond') || word.includes('platinum')) {
        return { level: 'mvp', confidence: 'medium', reason: 'Contains premium tier keyword' };
      }
      if (word.includes('gold') || word.includes('silver')) {
        return { level: 'vip_plus', confidence: 'medium', reason: 'Contains mid-tier keyword' };
      }
      return { level: 'vip', confidence: 'low', reason: 'Contains donor-related keyword' };
    }
  }

  // Check for tier numbers (Tier 1, Tier 2, etc.)
  const tierMatch = normalized.match(/tier\s*(\d+)/i);
  if (tierMatch) {
    const tier = parseInt(tierMatch[1]);
    const levels: RankLevel[] = ['vip', 'vip_plus', 'mvp', 'mvp_plus', 'elite'];
    if (tier >= 1 && tier <= 5) {
      return { level: levels[tier - 1], confidence: 'medium', reason: `Matched Tier ${tier}` };
    }
  }

  // Check for Roman numerals (I, II, III, IV, V)
  const romanMatch = normalized.match(/\b(i{1,3}|iv|v)\b/i);
  if (romanMatch) {
    const romanMap: Record<string, number> = { 'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5 };
    const tier = romanMap[romanMatch[1].toLowerCase()] || 1;
    const levels: RankLevel[] = ['vip', 'vip_plus', 'mvp', 'mvp_plus', 'elite'];
    return { level: levels[tier - 1], confidence: 'low', reason: `Matched Roman numeral tier ${tier}` };
  }

  // Default to player
  return {
    level: 'player',
    confidence: 'low',
    reason: 'No matching patterns found, defaulting to player',
  };
}

// Description-based keywords for better detection
const descriptionKeywords: { keywords: string[]; level: RankLevel; isDonor: boolean }[] = [
  // Donor tiers based on price/value mentions
  { keywords: ['free', 'basic perk', 'small benefit', 'entry level donor', 'first tier', '$5', '$10'], level: 'vip', isDonor: true },
  { keywords: ['extra home', 'more homes', 'cooldown reduction', 'second tier', '$15', '$20', '$25'], level: 'vip_plus', isDonor: true },
  { keywords: ['priority', 'special kit', 'fly in claim', 'third tier', 'mid tier', '$30', '$40', '$50'], level: 'mvp', isDonor: true },
  { keywords: ['exclusive', 'special abilities', 'nickname color', 'fourth tier', '$60', '$75', '$100'], level: 'mvp_plus', isDonor: true },
  { keywords: ['all perks', 'everything', 'maximum', 'top tier', 'best donor', 'lifetime', '$150', '$200'], level: 'elite', isDonor: true },

  // Staff based on responsibilities
  { keywords: ['chat moderation', 'mute players', 'kick', 'trial', 'learning', 'new staff', 'assist'], level: 'helper', isDonor: false },
  { keywords: ['ban players', 'full mod', 'experienced staff', 'rollback', 'investigate', 'punish'], level: 'mod', isDonor: false },
  { keywords: ['server management', 'plugin config', 'spawn items', 'manage world', 'senior staff'], level: 'admin', isDonor: false },
  { keywords: ['full access', 'everything', 'server owner', 'co-owner', 'developer', 'console'], level: 'owner', isDonor: false },
];

// Enhanced rank detection with description context
export function detectRankLevelWithDescription(input: RankDetectionInput): RankDetectionResult {
  const { name, description, targetAudience } = input;

  // First, try name-based detection
  const nameResult = detectRankLevel(name);

  // If no description, return name-based result
  if (!description) {
    return nameResult;
  }

  const descLower = description.toLowerCase();

  // Use target audience as a strong hint
  if (targetAudience === 'donors') {
    // Look for tier indicators in description
    for (const { keywords, level, isDonor } of descriptionKeywords) {
      if (!isDonor) continue;
      if (keywords.some(kw => descLower.includes(kw.toLowerCase()))) {
        return {
          level,
          confidence: 'high',
          reason: `Description indicates ${level} donor tier`,
        };
      }
    }
    // Default donor to VIP if no specific tier found
    if (nameResult.confidence === 'low') {
      return {
        level: 'vip',
        confidence: 'medium',
        reason: 'Target audience is donors, defaulting to VIP tier',
      };
    }
  }

  if (targetAudience === 'staff') {
    // Look for responsibility indicators in description
    for (const { keywords, level, isDonor } of descriptionKeywords) {
      if (isDonor) continue;
      if (keywords.some(kw => descLower.includes(kw.toLowerCase()))) {
        return {
          level,
          confidence: 'high',
          reason: `Description indicates ${level} staff level`,
        };
      }
    }
    // Default staff to helper if no specific level found
    if (nameResult.confidence === 'low') {
      return {
        level: 'helper',
        confidence: 'medium',
        reason: 'Target audience is staff, defaulting to helper level',
      };
    }
  }

  // Try to detect from description without explicit audience
  for (const { keywords, level } of descriptionKeywords) {
    if (keywords.some(kw => descLower.includes(kw.toLowerCase()))) {
      return {
        level,
        confidence: 'medium',
        reason: `Description keyword match for ${level}`,
      };
    }
  }

  // Check for generic donor/staff indicators in description
  if (descLower.match(/\b(donat|support|pay|buy|purchas|subscri|tier|perk|benefit)\b/)) {
    // Seems like a donor rank
    if (nameResult.level === 'player' || !isDonorRank(nameResult.level)) {
      // Override with VIP if name detection didn't catch it as donor
      return {
        level: 'vip',
        confidence: 'medium',
        reason: 'Description suggests donor rank',
      };
    }
  }

  if (descLower.match(/\b(mod|staff|ban|mute|kick|admin|manage|enforce|punish)\b/)) {
    // Seems like a staff rank
    if (nameResult.level === 'player' || !isStaffRank(nameResult.level)) {
      return {
        level: 'helper',
        confidence: 'medium',
        reason: 'Description suggests staff rank',
      };
    }
  }

  // Fall back to name-based result
  return nameResult;
}

// Async version that can use API fallback
export async function detectRankLevelWithAI(input: RankDetectionInput | string): Promise<RankDetectionResult> {
  // Normalize input
  const normalizedInput: RankDetectionInput = typeof input === 'string'
    ? { name: input }
    : input;

  // First try local detection with description
  const localResult = normalizedInput.description
    ? detectRankLevelWithDescription(normalizedInput)
    : detectRankLevel(normalizedInput.name);

  // If high confidence or no API configured, return local result
  if (localResult.confidence === 'high' || !isAIConfigured()) {
    return localResult;
  }

  // For low/medium confidence, try API if available
  if (config.apiKey) {
    try {
      const descriptionContext = normalizedInput.description
        ? `\nDescription: "${normalizedInput.description}"`
        : '';
      const audienceContext = normalizedInput.targetAudience
        ? `\nTarget audience: ${normalizedInput.targetAudience}`
        : '';

      const aiResult = await callAI(`
        Classify this Minecraft server rank into one of these categories:
        - player (default rank for all players)
        - vip (donor tier 1 - basic perks like /back, nickname)
        - vip_plus (donor tier 2 - extra homes, colored nick)
        - mvp (donor tier 3 - enderchest, special kits)
        - mvp_plus (donor tier 4 - fly in claims, exclusive features)
        - elite (donor tier 5 - top donor with all perks)
        - helper (junior staff - can mute/kick)
        - mod (moderator - can ban, full moderation)
        - admin (administrator - server management)
        - owner (server owner - full access)

        Rank name: "${normalizedInput.name}"${descriptionContext}${audienceContext}

        Based on the name${normalizedInput.description ? ' and description' : ''}, respond with ONLY the category name, nothing else.
      `);

      const level = aiResult.trim().toLowerCase().replace(/[^a-z_]/g, '') as RankLevel;
      if (RANK_ORDER[level] !== undefined) {
        return {
          level,
          confidence: 'high',
          reason: 'AI classification based on context',
        };
      }
    } catch (error) {
      console.warn('AI rank detection failed, using local result:', error);
    }
  }

  return localResult;
}

// ============================================
// PLUGIN PERMISSION LOOKUP
// ============================================

export interface PluginLookupResult {
  found: boolean;
  pluginName: string;
  permissions: PermissionNode[];
  source: 'local' | 'web' | 'ai';
  error?: string;
}

// Known permission patterns for common plugin types
const permissionPatterns: Record<string, { prefix: string; common: string[] }> = {
  essentials: {
    prefix: 'essentials.',
    common: ['home', 'spawn', 'tp', 'tpa', 'warp', 'kit', 'heal', 'feed', 'fly', 'god'],
  },
  worldedit: {
    prefix: 'worldedit.',
    common: ['clipboard', 'region', 'selection', 'history', 'brush', 'tool'],
  },
  worldguard: {
    prefix: 'worldguard.',
    common: ['region', 'build', 'bypass', 'region.define', 'region.claim'],
  },
  luckperms: {
    prefix: 'luckperms.',
    common: ['user', 'group', 'track', 'log', 'sync', 'import', 'export'],
  },
};

// Generate common permissions for unknown plugins
function generateCommonPermissions(pluginName: string): PermissionNode[] {
  const slug = pluginName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const commonActions = ['use', 'admin', 'reload', 'help', 'gui', 'menu'];

  return commonActions.map((action) => ({
    id: `${slug}-${action}`,
    pluginId: slug,
    node: `${slug}.${action}`,
    description: `${action.charAt(0).toUpperCase() + action.slice(1)} permission for ${pluginName}`,
    recommendedRank: action === 'admin' || action === 'reload' ? 'admin' : 'player',
    riskLevel: action === 'admin' ? 'dangerous' : 'safe',
    serverTypes: ['survival', 'factions', 'skyblock', 'prison', 'minigames', 'creative', 'custom'] as ServerType[],
    isDefault: action === 'use' || action === 'help',
  }));
}

export async function lookupPluginPermissions(pluginName: string): Promise<PluginLookupResult> {
  const normalized = pluginName.toLowerCase().trim();

  // Check if we have known patterns
  if (permissionPatterns[normalized]) {
    const pattern = permissionPatterns[normalized];
    const permissions: PermissionNode[] = pattern.common.map((action, i) => ({
      id: `${normalized}-${action}`,
      pluginId: normalized,
      node: `${pattern.prefix}${action}`,
      description: `${action.charAt(0).toUpperCase() + action.slice(1)} permission`,
      recommendedRank: 'player',
      riskLevel: 'safe',
      serverTypes: ['survival', 'factions', 'skyblock', 'prison', 'minigames', 'creative', 'custom'] as ServerType[],
      isDefault: i < 3,
    }));

    return {
      found: true,
      pluginName,
      permissions,
      source: 'local',
    };
  }

  // Try web search if enabled
  if (config.enableWebSearch) {
    try {
      const webResult = await searchPluginPermissions(pluginName);
      if (webResult.found) {
        return webResult;
      }
    } catch (error) {
      console.warn('Web search failed:', error);
    }
  }

  // Try AI if configured
  if (config.apiKey) {
    try {
      const aiResult = await generatePermissionsWithAI(pluginName);
      if (aiResult.found) {
        return aiResult;
      }
    } catch (error) {
      console.warn('AI permission generation failed:', error);
    }
  }

  // Return generated common permissions as fallback
  return {
    found: true,
    pluginName,
    permissions: generateCommonPermissions(pluginName),
    source: 'local',
  };
}

// Search for plugin permissions on the web
async function searchPluginPermissions(pluginName: string): Promise<PluginLookupResult> {
  // This would need a backend proxy for CORS
  // For now, return not found
  return {
    found: false,
    pluginName,
    permissions: [],
    source: 'web',
    error: 'Web search not implemented - requires backend proxy',
  };
}

// Generate permissions using AI
async function generatePermissionsWithAI(pluginName: string): Promise<PluginLookupResult> {
  if (!config.apiKey) {
    return {
      found: false,
      pluginName,
      permissions: [],
      source: 'ai',
      error: 'No API key configured',
    };
  }

  try {
    const response = await callAI(`
      Generate a list of common permission nodes for the Minecraft plugin "${pluginName}".

      Return ONLY a JSON array with this structure (no markdown, no explanation):
      [
        {
          "node": "plugin.permission",
          "description": "What this permission does",
          "recommendedRank": "player|vip|vip_plus|mvp|mvp_plus|elite|helper|mod|admin|owner",
          "riskLevel": "safe|moderate|dangerous|critical"
        }
      ]

      Generate 5-10 common permissions. Be accurate based on typical plugin conventions.
    `);

    // Parse the JSON response
    const permissions = JSON.parse(response.trim());

    if (Array.isArray(permissions) && permissions.length > 0) {
      const slug = pluginName.toLowerCase().replace(/[^a-z0-9]/g, '');

      return {
        found: true,
        pluginName,
        permissions: permissions.map((p: any, i: number) => ({
          id: `${slug}-ai-${i}`,
          pluginId: slug,
          node: p.node,
          description: p.description,
          recommendedRank: p.recommendedRank || 'player',
          riskLevel: p.riskLevel || 'safe',
          serverTypes: ['survival', 'factions', 'skyblock', 'prison', 'minigames', 'creative', 'custom'] as ServerType[],
          isDefault: i < 3,
        })),
        source: 'ai',
      };
    }
  } catch (error) {
    console.error('Failed to parse AI response:', error);
  }

  return {
    found: false,
    pluginName,
    permissions: [],
    source: 'ai',
    error: 'Failed to generate permissions',
  };
}

// ============================================
// SMART RECOMMENDATIONS
// ============================================

export interface RecommendationContext {
  serverType: ServerType;
  installedPlugins: string[];
  existingRanks: { name: string; level: RankLevel }[];
}

export interface PermissionRecommendation {
  rankLevel: RankLevel;
  permissions: string[];
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

// Server type specific recommendations
const serverTypeRecommendations: Record<ServerType, { plugins: string[]; tips: string[] }> = {
  survival: {
    plugins: ['essentialsx', 'griefprevention', 'coreprotect', 'vault'],
    tips: [
      'Consider land claiming for player protection',
      'Rollback tools help with griefing incidents',
      'Economy adds progression goals',
    ],
  },
  factions: {
    plugins: ['factionsuuid', 'essentialsx', 'vault', 'silkspawners'],
    tips: [
      'Spawner control is crucial for economy balance',
      'TNT and raid mechanics need careful permission setup',
      'Consider fly permissions for top donors',
    ],
  },
  skyblock: {
    plugins: ['superiorskyblock', 'askyblock', 'bentobox', 'essentialsx'],
    tips: [
      'Island fly is a popular donor perk',
      'Island size/team limits make good tier progression',
      'Generator upgrades are good monetization',
    ],
  },
  prison: {
    plugins: ['essentialsx', 'prisonmines', 'vault', 'rankup'],
    tips: [
      'Mine access permissions control progression',
      'Prestige systems extend gameplay',
      'Backpacks/inventory expansions are popular donor perks',
    ],
  },
  minigames: {
    plugins: ['bedwars', 'skywars', 'murdermystery'],
    tips: [
      'Kit unlocks are good donor perks',
      'Cosmetics provide non-P2W monetization',
      'Queue priority for donors improves experience',
    ],
  },
  creative: {
    plugins: ['worldedit', 'plotsquared', 'headdb'],
    tips: [
      'Plot size is a natural tier progression',
      'WorldEdit access tiers (basic vs advanced)',
      'Creative building tools as donor perks',
    ],
  },
  custom: {
    plugins: ['essentialsx', 'vault', 'luckperms'],
    tips: [
      'Start with essential plugins and expand',
      'Consider your unique gameplay when assigning permissions',
    ],
  },
};

export function getServerRecommendations(serverType: ServerType): { plugins: string[]; tips: string[] } {
  return serverTypeRecommendations[serverType] || serverTypeRecommendations.custom;
}

export function getPermissionRecommendations(context: RecommendationContext): PermissionRecommendation[] {
  const recommendations: PermissionRecommendation[] = [];
  const serverRec = serverTypeRecommendations[context.serverType];

  // Check for missing recommended plugins
  const missingPlugins = serverRec.plugins.filter(
    p => !context.installedPlugins.some(ip => ip.toLowerCase().includes(p.toLowerCase()))
  );

  if (missingPlugins.length > 0) {
    recommendations.push({
      rankLevel: 'player',
      permissions: [],
      reason: `Consider adding: ${missingPlugins.join(', ')}`,
      priority: 'medium',
    });
  }

  // Server-specific permission recommendations
  switch (context.serverType) {
    case 'survival':
      recommendations.push({
        rankLevel: 'vip',
        permissions: ['essentials.back', 'essentials.sethome.multiple.vip'],
        reason: 'Basic convenience perks for entry-level donors',
        priority: 'high',
      });
      break;

    case 'factions':
      recommendations.push({
        rankLevel: 'elite',
        permissions: ['factions.fly', 'silkspawners.spawnegg.*'],
        reason: 'High-value perks for top donors',
        priority: 'high',
      });
      break;

    case 'skyblock':
      recommendations.push({
        rankLevel: 'mvp',
        permissions: ['askyblock.island.fly', 'bskyblock.island.fly'],
        reason: 'Island fly is a popular mid-tier perk',
        priority: 'high',
      });
      break;
  }

  return recommendations;
}

// ============================================
// AI API CALLS
// ============================================

async function callAI(prompt: string): Promise<string> {
  if (!config.apiKey) {
    throw new Error('No API key configured');
  }

  if (config.apiProvider === 'anthropic') {
    return callAnthropic(prompt);
  }

  // Default to OpenAI (gpt-4o-mini - most efficient)
  return callOpenAI(prompt);
}

async function callAnthropic(prompt: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function callOpenAI(prompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ============================================
// TYPE EXPORTS (interfaces are already exported inline)
// ============================================

// All functions are already exported inline with 'export function'
// Interfaces are already exported inline with 'export interface'
