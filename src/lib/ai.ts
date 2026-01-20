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

// Load API key from environment variable (set in Vercel dashboard)
const ENV_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;

let config: AIConfig = {
  apiKey: ENV_API_KEY,
  apiProvider: 'openai',
};

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

// Known permission patterns for common plugin types with actual real permissions
interface PluginPermissionData {
  prefix: string;
  permissions: Array<{
    node: string;
    description: string;
    recommendedRank: RankLevel;
    riskLevel: 'safe' | 'moderate' | 'dangerous' | 'critical';
    command?: string;
  }>;
}

const knownPluginPermissions: Record<string, PluginPermissionData> = {
  essentialsx: {
    prefix: 'essentials.',
    permissions: [
      { node: 'essentials.home', description: 'Teleport to your home', recommendedRank: 'player', riskLevel: 'safe', command: '/home' },
      { node: 'essentials.sethome', description: 'Set your home location', recommendedRank: 'player', riskLevel: 'safe', command: '/sethome' },
      { node: 'essentials.sethome.multiple', description: 'Set multiple homes', recommendedRank: 'vip', riskLevel: 'safe' },
      { node: 'essentials.spawn', description: 'Teleport to spawn', recommendedRank: 'player', riskLevel: 'safe', command: '/spawn' },
      { node: 'essentials.tpa', description: 'Request to teleport to a player', recommendedRank: 'player', riskLevel: 'safe', command: '/tpa' },
      { node: 'essentials.tpaccept', description: 'Accept teleport requests', recommendedRank: 'player', riskLevel: 'safe', command: '/tpaccept' },
      { node: 'essentials.back', description: 'Return to previous location', recommendedRank: 'vip', riskLevel: 'safe', command: '/back' },
      { node: 'essentials.back.ondeath', description: 'Use /back after death', recommendedRank: 'vip_plus', riskLevel: 'moderate' },
      { node: 'essentials.warp', description: 'Teleport to warps', recommendedRank: 'player', riskLevel: 'safe', command: '/warp' },
      { node: 'essentials.kit', description: 'Use kits', recommendedRank: 'player', riskLevel: 'safe', command: '/kit' },
      { node: 'essentials.nick', description: 'Change your nickname', recommendedRank: 'vip', riskLevel: 'safe', command: '/nick' },
      { node: 'essentials.nick.color', description: 'Use colors in nickname', recommendedRank: 'vip_plus', riskLevel: 'safe' },
      { node: 'essentials.fly', description: 'Enable flight mode', recommendedRank: 'mvp_plus', riskLevel: 'moderate', command: '/fly' },
      { node: 'essentials.heal', description: 'Heal yourself', recommendedRank: 'mvp', riskLevel: 'moderate', command: '/heal' },
      { node: 'essentials.feed', description: 'Feed yourself', recommendedRank: 'vip_plus', riskLevel: 'safe', command: '/feed' },
      { node: 'essentials.god', description: 'Enable god mode', recommendedRank: 'admin', riskLevel: 'dangerous', command: '/god' },
      { node: 'essentials.tp', description: 'Teleport to players', recommendedRank: 'mod', riskLevel: 'dangerous', command: '/tp' },
      { node: 'essentials.tpo', description: 'Teleport override (ignores tptoggle)', recommendedRank: 'mod', riskLevel: 'dangerous' },
      { node: 'essentials.gamemode', description: 'Change gamemode', recommendedRank: 'admin', riskLevel: 'dangerous', command: '/gamemode' },
      { node: 'essentials.give', description: 'Give items to players', recommendedRank: 'admin', riskLevel: 'critical', command: '/give' },
      { node: 'essentials.vanish', description: 'Become invisible', recommendedRank: 'mod', riskLevel: 'dangerous', command: '/vanish' },
      { node: 'essentials.ban', description: 'Ban players', recommendedRank: 'mod', riskLevel: 'dangerous', command: '/ban' },
      { node: 'essentials.kick', description: 'Kick players', recommendedRank: 'helper', riskLevel: 'moderate', command: '/kick' },
      { node: 'essentials.mute', description: 'Mute players', recommendedRank: 'helper', riskLevel: 'moderate', command: '/mute' },
    ],
  },
  worldguard: {
    prefix: 'worldguard.',
    permissions: [
      { node: 'worldguard.region.claim', description: 'Claim regions', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'worldguard.region.select', description: 'Select regions', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'worldguard.region.info', description: 'View region info', recommendedRank: 'player', riskLevel: 'safe', command: '/rg info' },
      { node: 'worldguard.region.list', description: 'List regions', recommendedRank: 'player', riskLevel: 'safe', command: '/rg list' },
      { node: 'worldguard.region.addmember.own', description: 'Add members to your regions', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'worldguard.region.define', description: 'Define new regions', recommendedRank: 'admin', riskLevel: 'dangerous', command: '/rg define' },
      { node: 'worldguard.region.remove', description: 'Remove regions', recommendedRank: 'admin', riskLevel: 'dangerous', command: '/rg remove' },
      { node: 'worldguard.region.flag', description: 'Set region flags', recommendedRank: 'admin', riskLevel: 'dangerous', command: '/rg flag' },
      { node: 'worldguard.region.bypass', description: 'Bypass region protections', recommendedRank: 'admin', riskLevel: 'critical' },
    ],
  },
  griefprevention: {
    prefix: 'griefprevention.',
    permissions: [
      { node: 'griefprevention.createclaims', description: 'Create land claims', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'griefprevention.claimslist', description: 'List your claims', recommendedRank: 'player', riskLevel: 'safe', command: '/claimslist' },
      { node: 'griefprevention.abandonallclaims', description: 'Abandon all claims', recommendedRank: 'player', riskLevel: 'safe', command: '/abandonallclaims' },
      { node: 'griefprevention.trust', description: 'Trust players in claims', recommendedRank: 'player', riskLevel: 'safe', command: '/trust' },
      { node: 'griefprevention.untrust', description: 'Untrust players in claims', recommendedRank: 'player', riskLevel: 'safe', command: '/untrust' },
      { node: 'griefprevention.buyclaimblocks', description: 'Buy claim blocks', recommendedRank: 'player', riskLevel: 'safe', command: '/buyclaimblocks' },
      { node: 'griefprevention.adminclaims', description: 'Create admin claims', recommendedRank: 'admin', riskLevel: 'dangerous', command: '/adminclaims' },
      { node: 'griefprevention.deleteclaims', description: 'Delete other players claims', recommendedRank: 'admin', riskLevel: 'dangerous' },
      { node: 'griefprevention.ignoreclaims', description: 'Ignore claim protections', recommendedRank: 'admin', riskLevel: 'critical' },
      { node: 'griefprevention.adjustclaimblocks', description: 'Adjust claim block amounts', recommendedRank: 'admin', riskLevel: 'dangerous' },
    ],
  },
  mcmmo: {
    prefix: 'mcmmo.',
    permissions: [
      { node: 'mcmmo.skills.mining', description: 'Use mining skill', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'mcmmo.skills.woodcutting', description: 'Use woodcutting skill', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'mcmmo.skills.excavation', description: 'Use excavation skill', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'mcmmo.skills.fishing', description: 'Use fishing skill', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'mcmmo.skills.herbalism', description: 'Use herbalism skill', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'mcmmo.skills.swords', description: 'Use swords skill', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'mcmmo.skills.axes', description: 'Use axes skill', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'mcmmo.skills.archery', description: 'Use archery skill', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'mcmmo.skills.unarmed', description: 'Use unarmed skill', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'mcmmo.skills.taming', description: 'Use taming skill', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'mcmmo.skills.repair', description: 'Use repair skill', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'mcmmo.skills.acrobatics', description: 'Use acrobatics skill', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'mcmmo.skills.alchemy', description: 'Use alchemy skill', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'mcmmo.ability.mining.superbreaker', description: 'Use Super Breaker ability', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'mcmmo.ability.swords.serratedstrikes', description: 'Use Serrated Strikes ability', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'mcmmo.commands.mcstats', description: 'View mcMMO stats', recommendedRank: 'player', riskLevel: 'safe', command: '/mcstats' },
      { node: 'mcmmo.commands.mctop', description: 'View skill leaderboards', recommendedRank: 'player', riskLevel: 'safe', command: '/mctop' },
      { node: 'mcmmo.commands.mmoedit', description: 'Edit player skills', recommendedRank: 'admin', riskLevel: 'critical', command: '/mmoedit' },
      { node: 'mcmmo.bypass.levelcap', description: 'Bypass skill level caps', recommendedRank: 'elite', riskLevel: 'moderate' },
    ],
  },
  jobs: {
    prefix: 'jobs.',
    permissions: [
      { node: 'jobs.command.info', description: 'View job information', recommendedRank: 'player', riskLevel: 'safe', command: '/jobs info' },
      { node: 'jobs.command.join', description: 'Join jobs', recommendedRank: 'player', riskLevel: 'safe', command: '/jobs join' },
      { node: 'jobs.command.leave', description: 'Leave jobs', recommendedRank: 'player', riskLevel: 'safe', command: '/jobs leave' },
      { node: 'jobs.command.stats', description: 'View job stats', recommendedRank: 'player', riskLevel: 'safe', command: '/jobs stats' },
      { node: 'jobs.command.browse', description: 'Browse available jobs', recommendedRank: 'player', riskLevel: 'safe', command: '/jobs browse' },
      { node: 'jobs.command.top', description: 'View job leaderboards', recommendedRank: 'player', riskLevel: 'safe', command: '/jobs top' },
      { node: 'jobs.command.bonus', description: 'View job bonuses', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'jobs.max.2', description: 'Join up to 2 jobs', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'jobs.max.3', description: 'Join up to 3 jobs', recommendedRank: 'vip', riskLevel: 'safe' },
      { node: 'jobs.max.5', description: 'Join up to 5 jobs', recommendedRank: 'vip_plus', riskLevel: 'safe' },
      { node: 'jobs.boost.1.5', description: '1.5x job income boost', recommendedRank: 'vip', riskLevel: 'moderate' },
      { node: 'jobs.boost.2', description: '2x job income boost', recommendedRank: 'mvp', riskLevel: 'moderate' },
      { node: 'jobs.command.admin', description: 'Jobs admin commands', recommendedRank: 'admin', riskLevel: 'dangerous' },
      { node: 'jobs.command.give', description: 'Give job experience', recommendedRank: 'admin', riskLevel: 'critical' },
    ],
  },
  coreprotect: {
    prefix: 'coreprotect.',
    permissions: [
      { node: 'coreprotect.inspect', description: 'Inspect block changes', recommendedRank: 'helper', riskLevel: 'safe', command: '/co i' },
      { node: 'coreprotect.lookup', description: 'Lookup block history', recommendedRank: 'mod', riskLevel: 'safe', command: '/co lookup' },
      { node: 'coreprotect.rollback', description: 'Rollback block changes', recommendedRank: 'mod', riskLevel: 'dangerous', command: '/co rollback' },
      { node: 'coreprotect.restore', description: 'Restore rolled back changes', recommendedRank: 'mod', riskLevel: 'dangerous', command: '/co restore' },
      { node: 'coreprotect.purge', description: 'Purge old data', recommendedRank: 'admin', riskLevel: 'critical', command: '/co purge' },
      { node: 'coreprotect.reload', description: 'Reload configuration', recommendedRank: 'admin', riskLevel: 'dangerous', command: '/co reload' },
    ],
  },
  litebans: {
    prefix: 'litebans.',
    permissions: [
      { node: 'litebans.ban', description: 'Ban players', recommendedRank: 'mod', riskLevel: 'dangerous', command: '/ban' },
      { node: 'litebans.tempban', description: 'Temporarily ban players', recommendedRank: 'mod', riskLevel: 'dangerous', command: '/tempban' },
      { node: 'litebans.mute', description: 'Mute players', recommendedRank: 'helper', riskLevel: 'moderate', command: '/mute' },
      { node: 'litebans.tempmute', description: 'Temporarily mute players', recommendedRank: 'helper', riskLevel: 'moderate', command: '/tempmute' },
      { node: 'litebans.kick', description: 'Kick players', recommendedRank: 'helper', riskLevel: 'moderate', command: '/kick' },
      { node: 'litebans.warn', description: 'Warn players', recommendedRank: 'helper', riskLevel: 'safe', command: '/warn' },
      { node: 'litebans.unban', description: 'Unban players', recommendedRank: 'mod', riskLevel: 'moderate', command: '/unban' },
      { node: 'litebans.unmute', description: 'Unmute players', recommendedRank: 'helper', riskLevel: 'moderate', command: '/unmute' },
      { node: 'litebans.history', description: 'View player punishment history', recommendedRank: 'helper', riskLevel: 'safe', command: '/history' },
      { node: 'litebans.banlist', description: 'View ban list', recommendedRank: 'mod', riskLevel: 'safe', command: '/banlist' },
      { node: 'litebans.ipban', description: 'IP ban players', recommendedRank: 'admin', riskLevel: 'critical', command: '/ipban' },
    ],
  },
  vault: {
    prefix: 'vault.',
    permissions: [
      { node: 'vault.admin', description: 'Vault admin access', recommendedRank: 'admin', riskLevel: 'dangerous' },
    ],
  },
  shopgui: {
    prefix: 'shopguiplus.',
    permissions: [
      { node: 'shopguiplus.shop', description: 'Open the shop GUI', recommendedRank: 'player', riskLevel: 'safe', command: '/shop' },
      { node: 'shopguiplus.sell', description: 'Sell items', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'shopguiplus.buy', description: 'Buy items', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'shopguiplus.sellall', description: 'Sell all items at once', recommendedRank: 'vip', riskLevel: 'safe', command: '/sellall' },
      { node: 'shopguiplus.sellhand', description: 'Sell item in hand', recommendedRank: 'player', riskLevel: 'safe', command: '/sellhand' },
      { node: 'shopguiplus.admin', description: 'Shop admin commands', recommendedRank: 'admin', riskLevel: 'dangerous' },
    ],
  },
  silkspawners: {
    prefix: 'silkspawners.',
    permissions: [
      { node: 'silkspawners.silkdrop', description: 'Get spawner drops with silk touch', recommendedRank: 'vip', riskLevel: 'moderate' },
      { node: 'silkspawners.place', description: 'Place spawners', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'silkspawners.changetype', description: 'Change spawner mob types', recommendedRank: 'mvp', riskLevel: 'moderate' },
      { node: 'silkspawners.spawnegg', description: 'Use spawn eggs to change spawners', recommendedRank: 'vip_plus', riskLevel: 'moderate' },
      { node: 'silkspawners.viewtype', description: 'View spawner types', recommendedRank: 'player', riskLevel: 'safe' },
      { node: 'silkspawners.freealiases', description: 'Free spawner changes', recommendedRank: 'elite', riskLevel: 'moderate' },
    ],
  },
  clearlag: {
    prefix: 'lagg.',
    permissions: [
      { node: 'lagg.clear', description: 'Clears configured entities', recommendedRank: 'admin', riskLevel: 'dangerous', command: '/lagg clear' },
      { node: 'lagg.check', description: 'Displays world information', recommendedRank: 'mod', riskLevel: 'safe', command: '/lagg check' },
      { node: 'lagg.reload', description: 'Reloads the configuration', recommendedRank: 'admin', riskLevel: 'dangerous', command: '/lagg reload' },
      { node: 'lagg.killmobs', description: 'Kills configured mobs', recommendedRank: 'admin', riskLevel: 'dangerous', command: '/lagg killmobs' },
      { node: 'lagg.area', description: 'Removes entities in given radius', recommendedRank: 'admin', riskLevel: 'dangerous', command: '/lagg area' },
      { node: 'lagg.tpchunk', description: 'Teleports to given chunk', recommendedRank: 'admin', riskLevel: 'moderate', command: '/lagg tpchunk' },
      { node: 'lagg.admin', description: 'Manage ClearLag modules', recommendedRank: 'admin', riskLevel: 'dangerous', command: '/lagg admin' },
      { node: 'lagg.gc', description: 'Force garbage collection (not recommended)', recommendedRank: 'owner', riskLevel: 'critical', command: '/lagg gc' },
      { node: 'lagg.tps', description: 'View estimated TPS', recommendedRank: 'mod', riskLevel: 'safe', command: '/lagg tps' },
      { node: 'lagg.halt', description: 'Disable basic server functions temporarily', recommendedRank: 'admin', riskLevel: 'critical', command: '/lagg halt' },
      { node: 'lagg.samplememory', description: 'Sample memory usage per tick', recommendedRank: 'admin', riskLevel: 'moderate', command: '/lagg sampleMemory' },
      { node: 'lagg.sampleticks', description: 'Sample tick completion times', recommendedRank: 'admin', riskLevel: 'moderate', command: '/lagg sampleTicks' },
      { node: 'lagg.unloadchunks', description: 'Attempts to unload chunks', recommendedRank: 'admin', riskLevel: 'dangerous', command: '/lagg unloadchunks' },
      { node: 'lagg.profile', description: 'Profile activities like redstone', recommendedRank: 'admin', riskLevel: 'moderate', command: '/lagg profile' },
      { node: 'lagg.memory', description: 'View memory heap in realtime', recommendedRank: 'admin', riskLevel: 'safe', command: '/lagg memory' },
      { node: 'lagg.performance', description: 'View main-thread usage in real-time', recommendedRank: 'admin', riskLevel: 'safe', command: '/lagg performance' },
    ],
  },
};

// ============================================
// DOCUMENTATION PARSER
// ============================================

interface ParsedPermission {
  node: string;
  description: string;
  command?: string;
  recommendedRank: RankLevel;
  riskLevel: 'safe' | 'moderate' | 'dangerous' | 'critical';
}

/**
 * Parse plugin documentation text to extract permissions
 * Handles various common documentation formats:
 * - "Permissions are just pluginname.<command-name>"
 * - "/command - description (permission: node.here)"
 * - "permission.node - description"
 */
export function parseDocumentation(text: string, pluginName?: string): ParsedPermission[] {
  const permissions: ParsedPermission[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);

  // Try to detect the permission pattern from the text
  let permissionPrefix = '';
  const prefixMatch = text.match(/permissions?\s+(?:are|is)\s+(?:just\s+)?([a-z]+)\.<[^>]*>/i);
  if (prefixMatch) {
    permissionPrefix = prefixMatch[1].toLowerCase() + '.';
  } else if (pluginName) {
    permissionPrefix = pluginName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.';
  }

  for (const line of lines) {
    // Pattern 1: /command (description) - extract command name
    const commandMatch = line.match(/^\/([a-z]+)\s+([a-z_]+)(?:\s+[<\[].*)?(?:\s*\(([^)]+)\))?/i);
    if (commandMatch && permissionPrefix) {
      const baseCommand = commandMatch[1].toLowerCase();
      const subCommand = commandMatch[2].toLowerCase();
      const description = commandMatch[3] || `${subCommand} command`;

      const node = `${permissionPrefix.replace(/\.$/, '')}.${subCommand}`;
      const riskLevel = determineRiskLevel(subCommand, description);

      permissions.push({
        node,
        description,
        command: `/${baseCommand} ${subCommand}`,
        recommendedRank: determineRankFromRisk(riskLevel),
        riskLevel,
      });
      continue;
    }

    // Pattern 2: permission.node - description
    const permMatch = line.match(/^([a-z][a-z0-9._]+)\s*[-:]\s*(.+)/i);
    if (permMatch && permMatch[1].includes('.')) {
      const node = permMatch[1].toLowerCase();
      const description = permMatch[2].trim();
      const riskLevel = determineRiskLevel(node, description);

      permissions.push({
        node,
        description,
        recommendedRank: determineRankFromRisk(riskLevel),
        riskLevel,
      });
      continue;
    }

    // Pattern 3: /command - description (permission: node.here)
    const permInParenMatch = line.match(/\/([a-z][a-z0-9\s]*)\s*[-:]\s*(.+?)\s*\(permission:?\s*([a-z][a-z0-9._]+)\)/i);
    if (permInParenMatch) {
      const command = '/' + permInParenMatch[1].trim();
      const description = permInParenMatch[2].trim();
      const node = permInParenMatch[3].toLowerCase();
      const riskLevel = determineRiskLevel(node, description);

      permissions.push({
        node,
        description,
        command,
        recommendedRank: determineRankFromRisk(riskLevel),
        riskLevel,
      });
    }
  }

  return permissions;
}

// Determine risk level based on keywords
function determineRiskLevel(node: string, description: string): 'safe' | 'moderate' | 'dangerous' | 'critical' {
  const text = (node + ' ' + description).toLowerCase();

  // Critical: server-level dangerous operations
  if (text.match(/\b(gc|halt|shutdown|stop|delete|purge|reset|wipe|all|force|override|bypass|op|console|execute)\b/)) {
    return 'critical';
  }

  // Dangerous: moderation and entity manipulation
  if (text.match(/\b(ban|kick|mute|clear|kill|remove|reload|admin|give|spawn|teleport|tp\b|rollback|restore)\b/)) {
    return 'dangerous';
  }

  // Moderate: gameplay-affecting features
  if (text.match(/\b(fly|heal|feed|god|vanish|gamemode|edit|modify|set|change|area|chunk|unload|profile|sample)\b/)) {
    return 'moderate';
  }

  // Safe: information and basic features
  return 'safe';
}

// Determine rank from risk level
function determineRankFromRisk(riskLevel: 'safe' | 'moderate' | 'dangerous' | 'critical'): RankLevel {
  switch (riskLevel) {
    case 'critical': return 'owner';
    case 'dangerous': return 'admin';
    case 'moderate': return 'mod';
    case 'safe': return 'player';
  }
}

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
  const normalized = pluginName.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

  // Check multiple variations of the plugin name
  const variations = [
    normalized,
    normalized.replace('reborn', ''),
    normalized.replace('plus', ''),
    normalized + 'x',
    normalized.replace(/x$/, ''),
  ];

  // Check if we have known permissions for this plugin
  for (const variant of variations) {
    if (knownPluginPermissions[variant]) {
      const pluginData = knownPluginPermissions[variant];
      const permissions: PermissionNode[] = pluginData.permissions.map((perm, i) => ({
        id: `${normalized}-${i}`,
        pluginId: normalized,
        node: perm.node,
        description: perm.description + (perm.command ? ` (${perm.command})` : ''),
        recommendedRank: perm.recommendedRank,
        riskLevel: perm.riskLevel,
        serverTypes: ['survival', 'factions', 'skyblock', 'prison', 'minigames', 'creative', 'custom'] as ServerType[],
        isDefault: perm.riskLevel === 'safe' && i < 5,
      }));

      return {
        found: true,
        pluginName,
        permissions,
        source: 'local',
      };
    }
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

// Generate permissions using AI with comprehensive knowledge
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
You are a Minecraft server permissions expert with extensive knowledge of Spigot/Bukkit plugins.

For the Minecraft plugin "${pluginName}", provide the ACTUAL permission nodes as documented in the plugin's wiki, Spigot page, or Bukkit dev page.

IMPORTANT RULES:
1. Use REAL permission nodes that actually exist for this plugin (from your training data knowledge)
2. If you know this plugin exists, provide its actual documented permissions
3. Permission nodes typically follow patterns like: pluginname.command, pluginname.feature, pluginname.admin
4. Include command permissions (e.g., pluginname.command.commandname)
5. Include feature permissions (e.g., pluginname.use, pluginname.bypass)
6. Include admin permissions (e.g., pluginname.admin, pluginname.reload)
7. If this is a well-known plugin (EssentialsX, WorldGuard, GriefPrevention, mcMMO, Jobs, etc.), you MUST use the actual real permissions

Common permission structures for reference:
- EssentialsX: essentials.home, essentials.spawn, essentials.tp
- WorldGuard: worldguard.region.*, worldguard.build.*
- GriefPrevention: griefprevention.createclaims, griefprevention.adminclaims
- LuckPerms: luckperms.user.*, luckperms.group.*
- mcMMO: mcmmo.skills.*, mcmmo.ability.*
- Jobs: jobs.command.*, jobs.join.*

Return ONLY a valid JSON array (no markdown code blocks, no explanation):
[
  {
    "node": "actual.permission.node",
    "description": "Clear description of what this permission allows",
    "recommendedRank": "player|vip|vip_plus|mvp|mvp_plus|elite|helper|mod|admin|owner",
    "riskLevel": "safe|moderate|dangerous|critical",
    "isCommand": true/false,
    "command": "/commandname (if isCommand is true)"
  }
]

Generate 10-20 permissions covering:
- Basic user commands/features (safe, for players)
- VIP/donor perks (moderate, for donors)
- Staff commands (dangerous, for staff)
- Admin commands (critical, for admins)

If you don't recognize this plugin, still generate realistic permissions based on the plugin name following standard Minecraft plugin conventions.
    `);

    // Clean up the response - remove markdown code blocks if present
    let cleanResponse = response.trim();
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse the JSON response
    const permissions = JSON.parse(cleanResponse);

    if (Array.isArray(permissions) && permissions.length > 0) {
      const slug = pluginName.toLowerCase().replace(/[^a-z0-9]/g, '');

      return {
        found: true,
        pluginName,
        permissions: permissions.map((p: any, i: number) => ({
          id: `${slug}-ai-${i}`,
          pluginId: slug,
          node: p.node,
          description: p.description + (p.command ? ` (${p.command})` : ''),
          recommendedRank: p.recommendedRank || 'player',
          riskLevel: p.riskLevel || 'safe',
          serverTypes: ['survival', 'factions', 'skyblock', 'prison', 'minigames', 'creative', 'custom'] as ServerType[],
          isDefault: p.riskLevel === 'safe' && i < 5,
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
