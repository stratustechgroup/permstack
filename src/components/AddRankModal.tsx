import { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
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

export function AddRankModal({ isOpen, onClose, onAdd, existingRanksCount }: AddRankModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('unknown');
  const [detection, setDetection] = useState<RankDetectionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [manualLevel, setManualLevel] = useState<RankLevel | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
      setTargetAudience('unknown');
      setDetection(null);
      setManualLevel(null);
    }
  }, [isOpen]);

  // Auto-detect rank level when inputs change
  useEffect(() => {
    if (!name.trim()) {
      setDetection(null);
      return;
    }

    const input: RankDetectionInput = {
      name: name.trim(),
      description: description.trim() || undefined,
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
  }, [name, description, targetAudience]);

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
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Rank" size="lg">
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

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">
            Description <span className="text-surface-500">(helps AI suggest the right level)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input w-full h-20 resize-none"
            placeholder="e.g. This rank is for players who donate $25. They get extra homes, colored chat, and a special kit."
          />
          <p className="text-xs text-surface-500 mt-1">
            Describe what this rank is for and what perks/responsibilities it has.
          </p>
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
