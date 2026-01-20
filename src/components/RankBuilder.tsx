import { useState, useRef } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Palette } from 'lucide-react';
import { Card, Badge, Button } from './ui';
import { rankTemplates, rankLevels, separatorPresets } from '../data';
import type { Rank, RankTemplate, RankLevel } from '../data';

interface RankBuilderProps {
  selectedTemplate: string;
  ranks: Rank[];
  onTemplateChange: (templateId: string) => void;
  onRanksChange: (ranks: Rank[]) => void;
}

export function RankBuilder({
  selectedTemplate,
  ranks,
  onTemplateChange,
  onRanksChange,
}: RankBuilderProps) {
  const [expandedRank, setExpandedRank] = useState<string | null>(null);
  const [draggedRank, setDraggedRank] = useState<string | null>(null);
  const [dragOverRank, setDragOverRank] = useState<string | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    onTemplateChange(templateId);
    const template = rankTemplates.find((t) => t.id === templateId);
    if (template) {
      onRanksChange([...template.ranks]);
    }
  };

  const handleRankUpdate = (rankId: string, updates: Partial<Rank>) => {
    onRanksChange(
      ranks.map((r) => (r.id === rankId ? { ...r, ...updates } : r))
    );
  };

  const handleAddRank = () => {
    const newId = `rank-${Date.now()}`;
    const newRank: Rank = {
      id: newId,
      name: 'newrank',
      displayName: 'New Rank',
      prefix: '[New] ',
      prefixColor: '&f',
      separator: ':',
      order: ranks.length,
      level: 'player',
    };
    onRanksChange([...ranks, newRank]);
    setExpandedRank(newId);
  };

  const handleRemoveRank = (rankId: string) => {
    if (ranks.length <= 1) return;
    const filtered = ranks.filter((r) => r.id !== rankId);
    // Reorder
    const reordered = filtered.map((r, i) => ({ ...r, order: i }));
    onRanksChange(reordered);
  };

  const handleMoveRank = (rankId: string, direction: 'up' | 'down') => {
    const index = ranks.findIndex((r) => r.id === rankId);
    if (
      (direction === 'up' && index === ranks.length - 1) ||
      (direction === 'down' && index === 0)
    ) {
      return;
    }

    const newRanks = [...ranks];
    const swapIndex = direction === 'up' ? index + 1 : index - 1;
    [newRanks[index], newRanks[swapIndex]] = [newRanks[swapIndex], newRanks[index]];

    // Update order values
    const reordered = newRanks.map((r, i) => ({ ...r, order: i }));
    onRanksChange(reordered);
  };

  const handleDragStart = (rankId: string) => {
    setDraggedRank(rankId);
  };

  const handleDragOver = (e: React.DragEvent, rankId: string) => {
    e.preventDefault();
    if (draggedRank && draggedRank !== rankId) {
      setDragOverRank(rankId);
    }
  };

  const handleDragLeave = () => {
    setDragOverRank(null);
  };

  const handleDrop = (targetRankId: string) => {
    if (!draggedRank || draggedRank === targetRankId) {
      setDraggedRank(null);
      setDragOverRank(null);
      return;
    }

    const draggedIndex = ranks.findIndex((r) => r.id === draggedRank);
    const targetIndex = ranks.findIndex((r) => r.id === targetRankId);

    const newRanks = [...ranks];
    const [removed] = newRanks.splice(draggedIndex, 1);
    newRanks.splice(targetIndex, 0, removed);

    // Update order values
    const reordered = newRanks.map((r, i) => ({ ...r, order: i }));
    onRanksChange(reordered);

    setDraggedRank(null);
    setDragOverRank(null);
  };

  const handleDragEnd = () => {
    setDraggedRank(null);
    setDragOverRank(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Define Your Ranks</h2>
        <p className="text-surface-400">
          Choose a template to start, then customize your ranks. Each rank inherits permissions from ranks below it.
        </p>
      </div>

      {/* Template selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {rankTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            selected={selectedTemplate === template.id}
            onSelect={() => handleTemplateSelect(template.id)}
          />
        ))}
      </div>

      {/* Rank editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-surface-400 uppercase tracking-wider">
            Rank Hierarchy (lowest to highest)
          </h3>
          <Button size="sm" variant="secondary" onClick={handleAddRank}>
            <Plus className="w-4 h-4 mr-1" />
            Add Rank
          </Button>
        </div>

        <div className="space-y-2">
          {ranks.map((rank, index) => (
            <RankEditor
              key={rank.id}
              rank={rank}
              index={index}
              total={ranks.length}
              expanded={expandedRank === rank.id}
              isDragging={draggedRank === rank.id}
              isDragOver={dragOverRank === rank.id}
              onToggle={() => setExpandedRank(expandedRank === rank.id ? null : rank.id)}
              onUpdate={(updates) => handleRankUpdate(rank.id, updates)}
              onRemove={() => handleRemoveRank(rank.id)}
              onMoveUp={() => handleMoveRank(rank.id, 'up')}
              onMoveDown={() => handleMoveRank(rank.id, 'down')}
              onDragStart={() => handleDragStart(rank.id)}
              onDragOver={(e) => handleDragOver(e, rank.id)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(rank.id)}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>

        <p className="text-sm text-surface-500">
          Tip: Ranks at the top inherit all permissions from ranks below. Set the permission level to control what permissions each rank receives.
        </p>
      </div>
    </div>
  );
}

interface TemplateCardProps {
  template: RankTemplate;
  selected: boolean;
  onSelect: () => void;
}

function TemplateCard({ template, selected, onSelect }: TemplateCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`p-3 rounded-lg border text-left transition-all ${
        selected
          ? 'bg-primary-500/10 border-primary-500'
          : 'bg-surface-900 border-surface-800 hover:border-surface-700'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="font-medium text-white text-sm">{template.name}</span>
        {selected && <Badge variant="info" size="sm">Selected</Badge>}
      </div>
      <p className="text-xs text-surface-400 line-clamp-2">{template.description}</p>
    </button>
  );
}

interface RankEditorProps {
  rank: Rank;
  index: number;
  total: number;
  expanded: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  onToggle: () => void;
  onUpdate: (updates: Partial<Rank>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: () => void;
  onDragEnd: () => void;
}

function RankEditor({
  rank,
  index,
  total,
  expanded,
  isDragging,
  isDragOver,
  onToggle,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: RankEditorProps) {
  const levelInfo = rankLevels.find((l) => l.id === rank.level);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card
      className={`transition-all ${expanded ? 'ring-1 ring-primary-500/50' : ''} ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${isDragOver ? 'ring-2 ring-primary-400 bg-primary-500/10' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      {/* Collapsed view */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-0.5">
          <button
            onClick={onMoveUp}
            disabled={index === total - 1}
            className="p-0.5 text-surface-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === 0}
            className="p-0.5 text-surface-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <GripVertical className="w-4 h-4 text-surface-600 cursor-grab active:cursor-grabbing" />

        <div className="flex-1 flex items-center gap-3 cursor-pointer" onClick={onToggle}>
          <span className="text-surface-500 text-sm font-mono w-6">{index + 1}.</span>
          <span
            className="font-mono"
            dangerouslySetInnerHTML={{
              __html: formatMinecraftColors(`${rank.prefixColor}${rank.prefix}${rank.displayName}`),
            }}
          />
          <Badge variant={getLevelVariant(rank.level)} size="sm">
            {levelInfo?.name || rank.level}
          </Badge>
        </div>

        <button
          onClick={onRemove}
          disabled={total <= 1}
          className="p-1.5 text-surface-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-surface-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={rank.displayName}
                onChange={(e) => onUpdate({ displayName: e.target.value })}
                className="input w-full"
                placeholder="e.g. Moderator"
              />
            </div>

            {/* Internal Name */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1">
                Internal Name <span className="text-surface-500">(no spaces)</span>
              </label>
              <input
                type="text"
                value={rank.name}
                onChange={(e) => onUpdate({ name: e.target.value.toLowerCase().replace(/\s/g, '') })}
                className="input w-full font-mono"
                placeholder="e.g. moderator"
              />
            </div>

            {/* Prefix */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1">
                Chat Prefix
              </label>
              <input
                type="text"
                value={rank.prefix}
                onChange={(e) => onUpdate({ prefix: e.target.value })}
                className="input w-full font-mono"
                placeholder="e.g. [Mod] "
              />
            </div>

            {/* Prefix Color */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-surface-300 mb-1">
                Prefix Color <span className="text-surface-500">(legacy codes, hex, or gradients)</span>
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={rank.prefixColor}
                    onChange={(e) => onUpdate({ prefixColor: e.target.value })}
                    className="input flex-1 font-mono"
                    placeholder="e.g. &c, #FF5555, or <gradient:#FF0000:#00FF00>"
                  />
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className={`p-2 rounded border transition-colors ${
                      showColorPicker
                        ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                        : 'border-surface-700 hover:border-surface-500 text-surface-400'
                    }`}
                    title="Toggle color picker"
                  >
                    <Palette className="w-5 h-5" />
                  </button>
                  <input
                    ref={colorInputRef}
                    type="color"
                    className="sr-only"
                    onChange={(e) => onUpdate({ prefixColor: e.target.value })}
                  />
                </div>

                {/* Quick color codes */}
                <div className="flex flex-wrap gap-1">
                  {colorCodes.map((code) => (
                    <button
                      key={code.code}
                      onClick={() => onUpdate({ prefixColor: code.code })}
                      className={`w-6 h-6 rounded border transition-all ${
                        rank.prefixColor === code.code
                          ? 'border-white ring-1 ring-white scale-110'
                          : 'border-surface-700 hover:border-surface-500 hover:scale-105'
                      }`}
                      style={{ backgroundColor: code.hex }}
                      title={`${code.name} (${code.code})`}
                    />
                  ))}
                </div>

                {/* Expanded color picker */}
                {showColorPicker && (
                  <div className="bg-surface-800 rounded-lg p-3 space-y-3">
                    <div>
                      <label className="block text-xs text-surface-400 mb-1">Hex Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={rank.prefixColor.startsWith('#') ? rank.prefixColor : '#FFFFFF'}
                          onChange={(e) => onUpdate({ prefixColor: e.target.value })}
                          className="w-10 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          placeholder="#FF5555"
                          value={rank.prefixColor.startsWith('#') ? rank.prefixColor : ''}
                          onChange={(e) => onUpdate({ prefixColor: e.target.value })}
                          className="input flex-1 font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-surface-400 mb-1">
                        Gradient (MiniMessage format)
                      </label>
                      <input
                        type="text"
                        placeholder="<gradient:#FF0000:#00FF00>text</gradient>"
                        value={rank.prefixColor.includes('gradient') ? rank.prefixColor : ''}
                        onChange={(e) => onUpdate({ prefixColor: e.target.value })}
                        className="input w-full font-mono text-sm"
                      />
                      <div className="flex gap-2 mt-2">
                        {gradientPresets.map((preset) => (
                          <button
                            key={preset.label}
                            onClick={() => onUpdate({ prefixColor: preset.value })}
                            className="px-2 py-1 text-xs rounded border border-surface-600 hover:border-surface-500"
                            style={{
                              background: `linear-gradient(to right, ${preset.colors[0]}, ${preset.colors[1]})`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Separator */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-surface-300 mb-1">
                Chat Separator <span className="text-surface-500">(character between name and message)</span>
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={rank.separator || ':'}
                  onChange={(e) => onUpdate({ separator: e.target.value })}
                  className="input w-full font-mono"
                  placeholder="e.g. : or → or »"
                />
                <div className="flex flex-wrap gap-2">
                  {separatorPresets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => onUpdate({ separator: preset.value })}
                      className={`px-3 py-1.5 rounded border text-sm transition-all ${
                        rank.separator === preset.value
                          ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                          : 'border-surface-700 hover:border-surface-500 text-surface-300'
                      }`}
                    >
                      <span className="mr-2">{preset.label}</span>
                      <span className="font-mono text-surface-400">{preset.value || '(none)'}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Permission Level */}
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">
              Permission Level <span className="text-surface-500">(determines which permissions this rank receives)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {rankLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => onUpdate({ level: level.id })}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    rank.level === level.id
                      ? 'bg-primary-500/10 border-primary-500'
                      : 'bg-surface-800 border-surface-700 hover:border-surface-600'
                  }`}
                >
                  <div className="font-medium text-white text-sm">{level.name}</div>
                  <div className="text-xs text-surface-400 mt-0.5">{level.description}</div>
                  <div className="text-xs text-surface-500 mt-1">
                    e.g. {level.examples.slice(0, 3).join(', ')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1">
              Preview
            </label>
            <div className="bg-surface-800 rounded-lg p-3 font-mono">
              <span
                dangerouslySetInnerHTML={{
                  __html: formatMinecraftColors(`${rank.prefixColor}${rank.prefix}${rank.displayName}&7${rank.separator || ':'} Hello everyone!`),
                }}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

// Color code palette for quick selection
const colorCodes = [
  { code: '&0', hex: '#000000', name: 'Black' },
  { code: '&1', hex: '#0000AA', name: 'Dark Blue' },
  { code: '&2', hex: '#00AA00', name: 'Dark Green' },
  { code: '&3', hex: '#00AAAA', name: 'Dark Aqua' },
  { code: '&4', hex: '#AA0000', name: 'Dark Red' },
  { code: '&5', hex: '#AA00AA', name: 'Dark Purple' },
  { code: '&6', hex: '#FFAA00', name: 'Gold' },
  { code: '&7', hex: '#AAAAAA', name: 'Gray' },
  { code: '&8', hex: '#555555', name: 'Dark Gray' },
  { code: '&9', hex: '#5555FF', name: 'Blue' },
  { code: '&a', hex: '#55FF55', name: 'Green' },
  { code: '&b', hex: '#55FFFF', name: 'Aqua' },
  { code: '&c', hex: '#FF5555', name: 'Red' },
  { code: '&d', hex: '#FF55FF', name: 'Light Purple' },
  { code: '&e', hex: '#FFFF55', name: 'Yellow' },
  { code: '&f', hex: '#FFFFFF', name: 'White' },
];

// Gradient presets for MiniMessage format
const gradientPresets = [
  { label: 'Fire', value: '<gradient:#FF0000:#FFAA00>', colors: ['#FF0000', '#FFAA00'] },
  { label: 'Ocean', value: '<gradient:#0000AA:#55FFFF>', colors: ['#0000AA', '#55FFFF'] },
  { label: 'Sunset', value: '<gradient:#FF5555:#AA00AA>', colors: ['#FF5555', '#AA00AA'] },
  { label: 'Forest', value: '<gradient:#00AA00:#FFFF55>', colors: ['#00AA00', '#FFFF55'] },
  { label: 'Royal', value: '<gradient:#5555FF:#AA00AA>', colors: ['#5555FF', '#AA00AA'] },
  { label: 'Gold', value: '<gradient:#FFAA00:#FFFF55>', colors: ['#FFAA00', '#FFFF55'] },
];

function getLevelVariant(level: RankLevel): 'default' | 'info' | 'success' | 'warning' | 'danger' {
  switch (level) {
    case 'player':
      return 'default';
    case 'vip':
      return 'success';
    case 'helper':
      return 'info';
    case 'mod':
      return 'warning';
    case 'admin':
    case 'owner':
      return 'danger';
    default:
      return 'default';
  }
}

// Helper to convert Minecraft color codes to HTML
function formatMinecraftColors(text: string): string {
  const colorMap: Record<string, string> = {
    '&0': '#000000',
    '&1': '#0000AA',
    '&2': '#00AA00',
    '&3': '#00AAAA',
    '&4': '#AA0000',
    '&5': '#AA00AA',
    '&6': '#FFAA00',
    '&7': '#AAAAAA',
    '&8': '#555555',
    '&9': '#5555FF',
    '&a': '#55FF55',
    '&b': '#55FFFF',
    '&c': '#FF5555',
    '&d': '#FF55FF',
    '&e': '#FFFF55',
    '&f': '#FFFFFF',
  };

  let result = text;
  let isBold = false;

  // Handle bold
  if (result.includes('&l')) {
    isBold = true;
    result = result.replace(/&l/g, '');
  }

  // Check for gradient format: <gradient:#COLOR1:#COLOR2>text</gradient> or just <gradient:#COLOR1:#COLOR2>
  const gradientMatch = result.match(/<gradient:(#[A-Fa-f0-9]{6}):(#[A-Fa-f0-9]{6})>/);
  if (gradientMatch) {
    const [fullMatch, color1, color2] = gradientMatch;

    // Remove the gradient tags from the text
    let cleanText = result.replace(fullMatch, '').replace('</gradient>', '');

    // If the gradient is at the start, apply it to the following text until the next color code
    const nextColorIndex = cleanText.search(/&[0-9a-f]/i);
    let gradientText: string;
    let remainingText: string;

    if (nextColorIndex > 0) {
      gradientText = cleanText.substring(0, nextColorIndex);
      remainingText = cleanText.substring(nextColorIndex);
    } else if (nextColorIndex === -1) {
      gradientText = cleanText;
      remainingText = '';
    } else {
      gradientText = '';
      remainingText = cleanText;
    }

    // Create gradient span
    const gradientStyle = `background: linear-gradient(to right, ${color1}, ${color2}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;${isBold ? ' font-weight: bold;' : ''}`;

    if (gradientText) {
      result = `<span style="${gradientStyle}">${gradientText}</span>`;
      // Process remaining text with standard colors
      if (remainingText) {
        result += formatMinecraftColors(remainingText);
      }
      return result;
    }
  }

  // Check for hex color format: #RRGGBB at the start
  const hexMatch = result.match(/^(#[A-Fa-f0-9]{6})/);
  if (hexMatch) {
    const hexColor = hexMatch[1];
    const remainingText = result.substring(hexColor.length);

    // Find where the hex color should stop (at next color code)
    const nextColorIndex = remainingText.search(/&[0-9a-f]/i);
    let coloredText: string;
    let afterText: string;

    if (nextColorIndex > 0) {
      coloredText = remainingText.substring(0, nextColorIndex);
      afterText = remainingText.substring(nextColorIndex);
    } else if (nextColorIndex === -1) {
      coloredText = remainingText;
      afterText = '';
    } else {
      coloredText = '';
      afterText = remainingText;
    }

    result = `<span style="color: ${hexColor}${isBold ? '; font-weight: bold' : ''}">${coloredText}</span>`;
    if (afterText) {
      result += formatMinecraftColors(afterText);
    }
    return result;
  }

  // Handle legacy colors
  for (const [code, color] of Object.entries(colorMap)) {
    if (result.includes(code)) {
      result = result.replace(
        code,
        `<span style="color: ${color}${isBold ? '; font-weight: bold' : ''}">`
      );
    }
  }

  // Close any open spans
  const openSpans = (result.match(/<span/g) || []).length;
  result += '</span>'.repeat(openSpans);

  return result;
}
