import { Card, Badge } from './ui';
import { rankTemplates } from '../data';
import type { Rank, RankTemplate } from '../data';

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
}: RankBuilderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Choose Rank Structure</h2>
        <p className="text-surface-400">
          Select a preset rank template. Each rank inherits permissions from ranks below it.
        </p>
      </div>

      {/* Template selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rankTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            selected={selectedTemplate === template.id}
            onSelect={() => onTemplateChange(template.id)}
          />
        ))}
      </div>

      {/* Rank preview */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-surface-400 uppercase tracking-wider">
          Rank Hierarchy (highest to lowest)
        </h3>
        <div className="flex flex-wrap gap-2">
          {[...ranks].reverse().map((rank, index) => (
            <div
              key={rank.id}
              className="flex items-center gap-2 bg-surface-900 border border-surface-800 rounded-lg px-3 py-2"
            >
              <span className="text-surface-500 text-sm">{ranks.length - index}.</span>
              <span
                className="font-mono text-sm"
                dangerouslySetInnerHTML={{
                  __html: formatMinecraftColors(`${rank.prefixColor}${rank.prefix}${rank.displayName}`),
                }}
              />
              {index < ranks.length - 1 && (
                <span className="text-surface-600 ml-1">→</span>
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-surface-500">
          Each rank inherits all permissions from ranks below it in the hierarchy.
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
    <Card
      hoverable
      selected={selected}
      onClick={onSelect}
      className="cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-white">{template.name}</h3>
        {selected && <Badge variant="info">Selected</Badge>}
      </div>
      <p className="text-sm text-surface-400 mb-4">{template.description}</p>
      <div className="flex flex-wrap gap-1">
        {template.ranks.map((rank) => (
          <span
            key={rank.id}
            className="text-xs bg-surface-800 text-surface-300 px-2 py-1 rounded"
          >
            {rank.displayName}
          </span>
        ))}
      </div>
    </Card>
  );
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

  // Handle colors
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
