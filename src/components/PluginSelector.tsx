import { useState } from 'react';
import { Search, Check } from 'lucide-react';
import { Card } from './ui';
import { plugins, pluginsByCategory } from '../data';

interface PluginSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const categoryLabels: Record<string, string> = {
  essentials: 'Essentials',
  protection: 'Protection',
  economy: 'Economy',
  moderation: 'Moderation',
  world: 'World Management',
  fun: 'Fun & RPG',
};

export function PluginSelector({ value, onChange }: PluginSelectorProps) {
  const [search, setSearch] = useState('');

  const filteredPlugins = plugins.filter(
    (plugin) =>
      plugin.name.toLowerCase().includes(search.toLowerCase()) ||
      plugin.description.toLowerCase().includes(search.toLowerCase())
  );

  const togglePlugin = (pluginId: string) => {
    if (value.includes(pluginId)) {
      onChange(value.filter((id) => id !== pluginId));
    } else {
      onChange([...value, pluginId]);
    }
  };

  const categories = Object.keys(pluginsByCategory);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Select Installed Plugins</h2>
        <p className="text-surface-400">
          Choose the plugins you have installed. We'll generate permissions for these.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
        <input
          type="text"
          placeholder="Search plugins..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-surface-900 border border-surface-800 rounded-lg text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Selected count */}
      <div className="flex items-center justify-between">
        <span className="text-surface-400">
          {value.length} plugin{value.length !== 1 ? 's' : ''} selected
        </span>
        {value.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="text-sm text-primary-400 hover:text-primary-300"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Plugin grid */}
      {search ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPlugins.map((plugin) => (
            <PluginCard
              key={plugin.id}
              plugin={plugin}
              selected={value.includes(plugin.id)}
              onToggle={() => togglePlugin(plugin.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-surface-400 uppercase tracking-wider mb-3">
                {categoryLabels[category] || category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pluginsByCategory[category].map((plugin) => (
                  <PluginCard
                    key={plugin.id}
                    plugin={plugin}
                    selected={value.includes(plugin.id)}
                    onToggle={() => togglePlugin(plugin.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface PluginCardProps {
  plugin: (typeof plugins)[0];
  selected: boolean;
  onToggle: () => void;
}

function PluginCard({ plugin, selected, onToggle }: PluginCardProps) {
  return (
    <Card
      hoverable
      selected={selected}
      onClick={onToggle}
      className="flex items-start gap-3 p-4 cursor-pointer"
    >
      <div
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          selected
            ? 'bg-primary-500 border-primary-500'
            : 'border-surface-600 hover:border-surface-500'
        }`}
      >
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-white truncate">{plugin.name}</h4>
          {plugin.isPopular && (
            <span className="text-xs bg-primary-500/20 text-primary-400 px-1.5 py-0.5 rounded">
              Popular
            </span>
          )}
        </div>
        <p className="text-sm text-surface-400 line-clamp-2">{plugin.description}</p>
      </div>
    </Card>
  );
}
