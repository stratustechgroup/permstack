import { useState, useRef } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Palette } from 'lucide-react';
import { Card, Badge, Button } from './ui';
import { AddRankModal } from './AddRankModal';
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
  const [showAddModal, setShowAddModal] = useState(false);

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

  const handleAddRank = (newRank: Rank) => {
    onRanksChange([...ranks, newRank]);
    setExpandedRank(newRank.id);
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
          <Button size="sm" variant="secondary" onClick={() => setShowAddModal(true)}>
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

      {/* Add Rank Modal */}
      <AddRankModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddRank}
        existingRanksCount={ranks.length}
      />
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
      } ${isDragOver && !expanded ? 'ring-2 ring-primary-400 bg-primary-500/10' : ''}`}
      draggable={!expanded}
      onDragStart={!expanded ? onDragStart : undefined}
      onDragOver={!expanded ? onDragOver : undefined}
      onDragLeave={!expanded ? onDragLeave : undefined}
      onDrop={!expanded ? onDrop : undefined}
      onDragEnd={!expanded ? onDragEnd : undefined}
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-surface-300 mb-1">
                Chat Prefix
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={rank.prefix}
                  onChange={(e) => onUpdate({ prefix: e.target.value })}
                  className="input w-full font-mono"
                  placeholder="e.g. [Mod] "
                />
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-surface-500 self-center">Text styles:</span>
                  {textStylePresets.map((style) => (
                    <button
                      key={style.label}
                      onClick={() => onUpdate({ prefix: transformText(rank.prefix, style.id) })}
                      className="px-2 py-1 text-xs rounded border border-surface-700 hover:border-surface-500 text-surface-300 hover:text-white transition-colors"
                      title={style.description}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
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

// Text style presets for Unicode transformations
const textStylePresets = [
  { id: 'smallcaps', label: 'ꜱᴍᴀʟʟ ᴄᴀᴘꜱ', description: 'Convert to small caps' },
  { id: 'bold', label: '𝗕𝗼𝗹𝗱', description: 'Convert to bold Unicode' },
  { id: 'italic', label: '𝘐𝘵𝘢𝘭𝘪𝘤', description: 'Convert to italic Unicode' },
  { id: 'normal', label: 'Normal', description: 'Reset to normal text' },
];

// Transform text to different Unicode styles
function transformText(text: string, style: string): string {
  // Extract just the text content (remove brackets if present)
  const bracketMatch = text.match(/^\[(.+)\]\s*$/);
  const hasBrackets = !!bracketMatch;
  const innerText = bracketMatch ? bracketMatch[1] : text.replace(/[\[\]]/g, '').trim();

  // First, normalize any existing Unicode styled text back to ASCII
  const normalizedText = toNormalText(innerText);

  let transformed: string;

  switch (style) {
    case 'smallcaps':
      transformed = toSmallCaps(normalizedText);
      break;
    case 'bold':
      transformed = toBoldUnicode(normalizedText);
      break;
    case 'italic':
      transformed = toItalicUnicode(normalizedText);
      break;
    case 'normal':
    default:
      transformed = normalizedText;
      break;
  }

  // Re-add brackets and trailing space if they were present
  if (hasBrackets) {
    return `[${transformed}] `;
  }
  return text.endsWith(' ') ? `${transformed} ` : transformed;
}

// Convert Unicode styled text back to normal ASCII
function toNormalText(text: string): string {
  const reverseMap: Record<string, string> = {
    // Small caps to normal
    'ᴀ': 'A', 'ʙ': 'B', 'ᴄ': 'C', 'ᴅ': 'D', 'ᴇ': 'E', 'ꜰ': 'F', 'ɢ': 'G', 'ʜ': 'H',
    'ɪ': 'I', 'ᴊ': 'J', 'ᴋ': 'K', 'ʟ': 'L', 'ᴍ': 'M', 'ɴ': 'N', 'ᴏ': 'O', 'ᴘ': 'P',
    'ǫ': 'Q', 'ʀ': 'R', 'ꜱ': 'S', 'ᴛ': 'T', 'ᴜ': 'U', 'ᴠ': 'V', 'ᴡ': 'W',
    'ʏ': 'Y', 'ᴢ': 'Z',
    // Bold to normal
    '𝗮': 'a', '𝗯': 'b', '𝗰': 'c', '𝗱': 'd', '𝗲': 'e', '𝗳': 'f', '𝗴': 'g', '𝗵': 'h',
    '𝗶': 'i', '𝗷': 'j', '𝗸': 'k', '𝗹': 'l', '𝗺': 'm', '𝗻': 'n', '𝗼': 'o', '𝗽': 'p',
    '𝗾': 'q', '𝗿': 'r', '𝘀': 's', '𝘁': 't', '𝘂': 'u', '𝘃': 'v', '𝘄': 'w', '𝘅': 'x',
    '𝘆': 'y', '𝘇': 'z',
    '𝗔': 'A', '𝗕': 'B', '𝗖': 'C', '𝗗': 'D', '𝗘': 'E', '𝗙': 'F', '𝗚': 'G', '𝗛': 'H',
    '𝗜': 'I', '𝗝': 'J', '𝗞': 'K', '𝗟': 'L', '𝗠': 'M', '𝗡': 'N', '𝗢': 'O', '𝗣': 'P',
    '𝗤': 'Q', '𝗥': 'R', '𝗦': 'S', '𝗧': 'T', '𝗨': 'U', '𝗩': 'V', '𝗪': 'W', '𝗫': 'X',
    '𝗬': 'Y', '𝗭': 'Z',
    '𝟬': '0', '𝟭': '1', '𝟮': '2', '𝟯': '3', '𝟰': '4', '𝟱': '5', '𝟲': '6', '𝟳': '7',
    '𝟴': '8', '𝟵': '9',
    // Italic to normal
    '𝘢': 'a', '𝘣': 'b', '𝘤': 'c', '𝘥': 'd', '𝘦': 'e', '𝘧': 'f', '𝘨': 'g', '𝘩': 'h',
    '𝘪': 'i', '𝘫': 'j', '𝘬': 'k', '𝘭': 'l', '𝘮': 'm', '𝘯': 'n', '𝘰': 'o', '𝘱': 'p',
    '𝘲': 'q', '𝘳': 'r', '𝘴': 's', '𝘵': 't', '𝘶': 'u', '𝘷': 'v', '𝘸': 'w', '𝘹': 'x',
    '𝘺': 'y', '𝘻': 'z',
    '𝘈': 'A', '𝘉': 'B', '𝘊': 'C', '𝘋': 'D', '𝘌': 'E', '𝘍': 'F', '𝘎': 'G', '𝘏': 'H',
    '𝘐': 'I', '𝘑': 'J', '𝘒': 'K', '𝘓': 'L', '𝘔': 'M', '𝘕': 'N', '𝘖': 'O', '𝘗': 'P',
    '𝘘': 'Q', '𝘙': 'R', '𝘚': 'S', '𝘛': 'T', '𝘜': 'U', '𝘝': 'V', '𝘞': 'W', '𝘟': 'X',
    '𝘠': 'Y', '𝘡': 'Z',
  };
  return Array.from(text).map(char => reverseMap[char] || char).join('');
}

function toSmallCaps(text: string): string {
  const smallCapsMap: Record<string, string> = {
    'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ',
    'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ',
    'q': 'ǫ', 'r': 'ʀ', 's': 'ꜱ', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x',
    'y': 'ʏ', 'z': 'ᴢ',
    'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ', 'F': 'ꜰ', 'G': 'ɢ', 'H': 'ʜ',
    'I': 'ɪ', 'J': 'ᴊ', 'K': 'ᴋ', 'L': 'ʟ', 'M': 'ᴍ', 'N': 'ɴ', 'O': 'ᴏ', 'P': 'ᴘ',
    'Q': 'ǫ', 'R': 'ʀ', 'S': 'ꜱ', 'T': 'ᴛ', 'U': 'ᴜ', 'V': 'ᴠ', 'W': 'ᴡ', 'X': 'x',
    'Y': 'ʏ', 'Z': 'ᴢ',
  };
  return text.split('').map(char => smallCapsMap[char] || char).join('');
}

function toBoldUnicode(text: string): string {
  const boldMap: Record<string, string> = {
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
    'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽',
    'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
    'y': '𝘆', 'z': '𝘇',
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛',
    'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣',
    'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫',
    'Y': '𝗬', 'Z': '𝗭',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳',
    '8': '𝟴', '9': '𝟵',
  };
  return text.split('').map(char => boldMap[char] || char).join('');
}

function toItalicUnicode(text: string): string {
  const italicMap: Record<string, string> = {
    'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩',
    'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱',
    'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹',
    'y': '𝘺', 'z': '𝘻',
    'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏',
    'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗',
    'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟',
    'Y': '𝘠', 'Z': '𝘡',
  };
  return text.split('').map(char => italicMap[char] || char).join('');
}

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
