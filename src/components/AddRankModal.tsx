import { useState, useEffect } from 'react';
import { Sparkles, Loader2, Check, Info } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button, Badge } from './ui';
import { rankLevels } from '../data';
import type { Rank, RankLevel } from '../data';
import {
  detectRankLevelWithDescription,
  detectRankLevelWithAI,
  isAIConfigured,
  type RankDetectionInput,
  type RankDetectionResult,
} from '../lib/ai';

interface AddRankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (rank: Rank) => void;
  existingRanksCount: number;
}

type TargetAudience = 'donors' | 'staff' | 'players' | 'unknown';

// Capability suggestions for quick selection
const capabilitySuggestions = {
  donors: [
    { id: 'homes', label: 'Extra homes', desc: 'Set multiple home locations' },
    { id: 'fly', label: 'Fly mode', desc: 'Ability to fly in survival' },
    { id: 'chat_colors', label: 'Chat colors', desc: 'Use colors in chat messages' },
    { id: 'kits', label: 'Special kits', desc: 'Access to donor kits' },
    { id: 'nickname', label: 'Nickname', desc: 'Set custom nicknames' },
    { id: 'particles', label: 'Particles', desc: 'Cosmetic particle effects' },
    { id: 'priority_queue', label: 'Priority queue', desc: 'Skip queue when server is full' },
    { id: 'warps', label: 'Extra warps', desc: 'Create personal warps' },
  ],
  staff: [
    { id: 'kick', label: 'Kick players', desc: 'Remove players from server' },
    { id: 'mute', label: 'Mute players', desc: 'Silence disruptive players' },
    { id: 'ban', label: 'Ban players', desc: 'Permanently remove players' },
    { id: 'teleport', label: 'Teleport', desc: 'Teleport to players' },
    { id: 'gamemode', label: 'Gamemode', desc: 'Change game modes' },
    { id: 'vanish', label: 'Vanish', desc: 'Become invisible' },
    { id: 'world_edit', label: 'WorldEdit', desc: 'Edit the world' },
    { id: 'console', label: 'Console access', desc: 'Run console commands' },
  ],
  players: [
    { id: 'basic_home', label: 'Set home', desc: 'Basic home teleport' },
    { id: 'basic_tp', label: 'TPA requests', desc: 'Request teleport to players' },
    { id: 'basic_chat', label: 'Chat', desc: 'Basic chat privileges' },
    { id: 'help', label: 'Help command', desc: 'Access help resources' },
  ],
};

// Permission examples for each level
const levelPermissionExamples: Record<RankLevel, string[]> = {
  player: ['essentials.home', 'essentials.tpa', 'essentials.msg'],
  vip: ['essentials.sethome.multiple.2', 'essentials.nick', 'essentials.back'],
  vip_plus: ['essentials.sethome.multiple.3', 'essentials.nick.color', 'essentials.workbench'],
  mvp: ['essentials.fly', 'essentials.heal', 'essentials.feed'],
  mvp_plus: ['essentials.god', 'essentials.speed', 'essentials.enderchest'],
  elite: ['cmi.command.fly.safelogin', 'worldedit.wand', 'essentials.time'],
  helper: ['essentials.mute', 'essentials.kick', 'coreprotect.inspect'],
  mod: ['essentials.ban', 'essentials.tempban', 'essentials.vanish'],
  admin: ['essentials.*', 'worldedit.*', 'cmi.*'],
  owner: ['*'],
};

export function AddRankModal({ isOpen, onClose, onAdd, existingRanksCount }: AddRankModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('unknown');
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [detection, setDetection] = useState<RankDetectionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [manualLevel, setManualLevel] = useState<RankLevel | null>(null);
  const [showPermissionPreview, setShowPermissionPreview] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
      setTargetAudience('unknown');
      setSelectedCapabilities([]);
      setDetection(null);
      setManualLevel(null);
      setShowPermissionPreview(false);
    }
  }, [isOpen]);

  // Build combined description from text and capabilities
  const buildFullDescription = () => {
    const parts: string[] = [];
    if (description.trim()) {
      parts.push(description.trim());
    }
    if (selectedCapabilities.length > 0) {
      const allCaps = [...capabilitySuggestions.donors, ...capabilitySuggestions.staff, ...capabilitySuggestions.players];
      const capLabels = selectedCapabilities
        .map(id => allCaps.find(c => c.id === id)?.label)
        .filter(Boolean);
      if (capLabels.length > 0) {
        parts.push(`Capabilities: ${capLabels.join(', ')}`);
      }
    }
    return parts.join('. ');
  };

  const toggleCapability = (capId: string) => {
    setSelectedCapabilities(prev =>
      prev.includes(capId)
        ? prev.filter(id => id !== capId)
        : [...prev, capId]
    );
  };

  // Auto-detect rank level when inputs change
  useEffect(() => {
    if (!name.trim()) {
      setDetection(null);
      return;
    }

    const fullDescription = buildFullDescription();

    const input: RankDetectionInput = {
      name: name.trim(),
      description: fullDescription || undefined,
      targetAudience: targetAudience !== 'unknown' ? targetAudience : undefined,
    };

    // Debounce detection
    const timer = setTimeout(async () => {
      setIsDetecting(true);

      try {
        // Use AI if configured, otherwise use local detection
        const result = isAIConfigured()
          ? await detectRankLevelWithAI(input)
          : detectRankLevelWithDescription(input);

        setDetection(result);
      } catch (error) {
        console.error('Detection error:', error);
        setDetection(detectRankLevelWithDescription(input));
      } finally {
        setIsDetecting(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [name, description, targetAudience, selectedCapabilities]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    const level = manualLevel || detection?.level || 'player';

    const newRank: Rank = {
      id: `rank-${Date.now()}`,
      name: name.toLowerCase().replace(/\s+/g, ''),
      displayName: name.trim(),
      prefix: `[${name.trim()}] `,
      prefixColor: getDefaultColor(level),
      separator: ':',
      order: existingRanksCount,
      level,
    };

    onAdd(newRank);
    onClose();
  };

  const getDefaultColor = (level: RankLevel): string => {
    const colors: Record<RankLevel, string> = {
      player: '&7',
      vip: '&a',
      vip_plus: '&2',
      mvp: '&b',
      mvp_plus: '&3',
      elite: '&6',
      helper: '&9',
      mod: '&c',
      admin: '&4',
      owner: '&4&l',
    };
    return colors[level] || '&f';
  };

  const selectedLevel = manualLevel || detection?.level || 'player';
  const selectedLevelInfo = rankLevels.find(l => l.id === selectedLevel);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Rank" size="xl">
      <div className="space-y-5">
        {/* Rank Name */}
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">
            Rank Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input w-full"
            placeholder="e.g. Gold, Moderator, Champion"
            autoFocus
          />
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">
            Who is this rank for?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'donors', label: 'Donors', desc: 'Players who support the server' },
              { id: 'staff', label: 'Staff', desc: 'Moderators & administrators' },
              { id: 'players', label: 'Players', desc: 'Regular players / default' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setTargetAudience(option.id as TargetAudience)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  targetAudience === option.id
                    ? 'bg-primary-500/10 border-primary-500'
                    : 'bg-surface-800 border-surface-700 hover:border-surface-600'
                }`}
              >
                <div className="font-medium text-white text-sm">{option.label}</div>
                <div className="text-xs text-surface-400 mt-0.5">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Capabilities - Quick Select */}
        {targetAudience !== 'unknown' && (
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">
              What should this rank be able to do?
            </label>
            <div className="flex flex-wrap gap-2">
              {capabilitySuggestions[targetAudience].map((cap) => (
                <button
                  key={cap.id}
                  onClick={() => toggleCapability(cap.id)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-all flex items-center gap-1.5 ${
                    selectedCapabilities.includes(cap.id)
                      ? 'bg-primary-500/20 border-primary-500 text-primary-300'
                      : 'bg-surface-800 border-surface-700 text-surface-300 hover:border-surface-600'
                  }`}
                  title={cap.desc}
                >
                  {selectedCapabilities.includes(cap.id) && <Check className="w-3 h-3" />}
                  {cap.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-surface-500 mt-2">
              Click to select capabilities. This helps determine the permission level.
            </p>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">
            Additional details <span className="text-surface-500">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input w-full h-16 resize-none"
            placeholder="e.g. This is our $25 monthly donor rank. Should have more perks than VIP but less than MVP."
          />
        </div>

        {/* AI Detection Result */}
        {name.trim() && (
          <div className="bg-surface-800/50 rounded-lg p-4 border border-surface-700">
            <div className="flex items-center gap-2 mb-3">
              {isDetecting ? (
                <Loader2 className="w-4 h-4 text-primary-400 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-primary-400" />
              )}
              <span className="text-sm font-medium text-white">
                {isDetecting ? 'Analyzing...' : 'Suggested Permission Level'}
              </span>
              {detection && !isDetecting && (
                <Badge
                  variant={detection.confidence === 'high' ? 'success' : detection.confidence === 'medium' ? 'warning' : 'default'}
                  size="sm"
                >
                  {detection.confidence} confidence
                </Badge>
              )}
            </div>

            {detection && !isDetecting && (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-semibold text-white">
                    {selectedLevelInfo?.name || selectedLevel}
                  </span>
                  {manualLevel && (
                    <button
                      onClick={() => setManualLevel(null)}
                      className="text-xs text-primary-400 hover:text-primary-300"
                    >
                      Reset to suggestion
                    </button>
                  )}
                </div>
                <p className="text-sm text-surface-400 mb-3">
                  {manualLevel
                    ? `You've manually selected ${rankLevels.find(l => l.id === manualLevel)?.name}`
                    : detection.reason}
                </p>

                {/* Permission Preview */}
                <div className="mb-3">
                  <button
                    onClick={() => setShowPermissionPreview(!showPermissionPreview)}
                    className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300"
                  >
                    <Info className="w-3 h-3" />
                    {showPermissionPreview ? 'Hide' : 'Show'} example permissions for this level
                  </button>
                  {showPermissionPreview && (
                    <div className="mt-2 p-2 bg-surface-900 rounded border border-surface-700">
                      <p className="text-xs text-surface-500 mb-1.5">Example permissions this rank will receive:</p>
                      <div className="flex flex-wrap gap-1">
                        {levelPermissionExamples[selectedLevel].map((perm) => (
                          <code
                            key={perm}
                            className="px-1.5 py-0.5 text-xs bg-surface-800 text-green-400 rounded font-mono"
                          >
                            {perm}
                          </code>
                        ))}
                      </div>
                      <p className="text-xs text-surface-500 mt-2">
                        + inherits all permissions from lower ranks
                      </p>
                    </div>
                  )}
                </div>

                {/* Manual Override */}
                <div>
                  <p className="text-xs text-surface-500 mb-2">Not right? Select manually:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {rankLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setManualLevel(level.id)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          selectedLevel === level.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-surface-700 text-surface-300 hover:bg-surface-600'
                        }`}
                      >
                        {level.name.replace(' (Tier ', ' T').replace(')', '')}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-surface-800">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            Add Rank
          </Button>
        </div>
      </div>
    </Modal>
  );
}
