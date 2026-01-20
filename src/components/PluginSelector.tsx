import { useState } from 'react';
import { Search, Check, Plus, AlertCircle, Package } from 'lucide-react';
import { Card, Button, Badge } from './ui';
import { PluginSearchModal } from './PluginSearchModal';
import { RequestPluginModal } from './RequestPluginModal';
import { plugins, pluginsByCategory } from '../data';
import { SINGLE_SELECT_CATEGORIES } from '../data/types';
import type { Plugin, PermissionNode, PluginCategory } from '../data/types';

interface PluginSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const categoryLabels: Record<string, string> = {
  permissions: 'Permission Plugin',
  essentials: 'Essentials',
  protection: 'Protection',
  economy: 'Economy',
  moderation: 'Moderation',
  world: 'World Management',
  fun: 'Fun & RPG',
  chat: 'Chat',
  display: 'Display',
  gamemodes: 'Gamemodes',
  utility: 'Utility',
  combat: 'Combat',
};

// Order categories with permissions first
const categoryOrder: PluginCategory[] = [
  'permissions',
  'essentials',
  'protection',
  'economy',
  'moderation',
  'world',
  'fun',
  'chat',
  'display',
  'gamemodes',
  'utility',
  'combat',
];

export function PluginSelector({ value, onChange }: PluginSelectorProps) {
  const [search, setSearch] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [customPlugins, setCustomPlugins] = useState<Plugin[]>([]);

  const allPlugins = [...plugins, ...customPlugins];

  const handleAddCustomPlugin = (plugin: Plugin, _permissions: PermissionNode[]) => {
    setCustomPlugins((prev) => [...prev, plugin]);
    onChange([...value, plugin.id]);
  };

  const filteredPlugins = allPlugins.filter(
    (plugin) =>
      plugin.name.toLowerCase().includes(search.toLowerCase()) ||
      plugin.description.toLowerCase().includes(search.toLowerCase())
  );

  // Get the plugin's category
  const getPluginCategory = (pluginId: string): PluginCategory | null => {
    const plugin = allPlugins.find(p => p.id === pluginId);
    return plugin?.category || null;
  };

  // Check if a category is single-select
  const isSingleSelectCategory = (category: PluginCategory): boolean => {
    return SINGLE_SELECT_CATEGORIES.includes(category);
  };

  // Get selected plugin for a single-select category
  const getSelectedForCategory = (category: PluginCategory): string | null => {
    const categoryPlugins = pluginsByCategory[category] || [];
    return value.find(id => categoryPlugins.some(p => p.id === id)) || null;
  };

  const togglePlugin = (pluginId: string) => {
    const category = getPluginCategory(pluginId);

    if (category && isSingleSelectCategory(category)) {
      // Single selection: replace any existing selection in this category
      const categoryPlugins = pluginsByCategory[category] || [];
      const otherSelections = value.filter(
        id => !categoryPlugins.some(p => p.id === id)
      );

      if (value.includes(pluginId)) {
        // Deselecting - just remove it
        onChange(otherSelections);
      } else {
        // Selecting - replace any existing in this category
        onChange([...otherSelections, pluginId]);
      }
    } else {
      // Multi selection: toggle normally
      if (value.includes(pluginId)) {
        onChange(value.filter((id) => id !== pluginId));
      } else {
        onChange([...value, pluginId]);
      }
    }
  };

  // Get ordered categories that have plugins
  const categories = categoryOrder.filter(cat => pluginsByCategory[cat]?.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Select Installed Plugins</h2>
          <p className="text-surface-400">
            Choose the plugins you have installed. We'll generate permissions for these.
          </p>
        </div>

        {/* Action buttons - top right */}
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={() => setShowSearchModal(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Find Plugins
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setShowRequestModal(true)}>
            <Package className="w-4 h-4 mr-1" />
            Request Plugin
          </Button>
        </div>
      </div>

      {/* Search and count row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
          <input
            type="text"
            placeholder="Search plugins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface-900 border border-surface-800 rounded-lg text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-surface-400 whitespace-nowrap">
            {value.length} selected
          </span>
          {value.length > 0 && (
            <button
              onClick={() => onChange([])}
              className="text-sm text-primary-400 hover:text-primary-300 whitespace-nowrap"
            >
              Clear all
            </button>
          )}
        </div>
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
              isSingleSelect={isSingleSelectCategory(plugin.category)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => {
            const isSingle = isSingleSelectCategory(category);
            const selectedInCategory = getSelectedForCategory(category);

            return (
              <div key={category}>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-sm font-medium text-surface-400 uppercase tracking-wider">
                    {categoryLabels[category] || category}
                  </h3>
                  {isSingle && (
                    <Badge variant="warning" size="sm">
                      Select One
                    </Badge>
                  )}
                </div>

                {isSingle && (
                  <div className="flex items-start gap-2 p-3 mb-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-200/80">
                      You can only use one permission plugin at a time. Select the one your server uses.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pluginsByCategory[category].map((plugin) => (
                    <PluginCard
                      key={plugin.id}
                      plugin={plugin}
                      selected={value.includes(plugin.id)}
                      onToggle={() => togglePlugin(plugin.id)}
                      isSingleSelect={isSingle}
                      isDisabledBySelection={isSingle && selectedInCategory !== null && selectedInCategory !== plugin.id}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom plugins section */}
      {customPlugins.length > 0 && !search && (
        <div>
          <h3 className="text-sm font-medium text-surface-400 uppercase tracking-wider mb-3">
            Custom Plugins
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {customPlugins.map((plugin) => (
              <PluginCard
                key={plugin.id}
                plugin={plugin}
                selected={value.includes(plugin.id)}
                onToggle={() => togglePlugin(plugin.id)}
                isSingleSelect={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Plugin Search Modal */}
      <PluginSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onAddPlugin={handleAddCustomPlugin}
        existingPlugins={value}
      />

      {/* Request Plugin Modal */}
      <RequestPluginModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
    </div>
  );
}

interface PluginCardProps {
  plugin: Plugin;
  selected: boolean;
  onToggle: () => void;
  isSingleSelect: boolean;
  isDisabledBySelection?: boolean;
}

function PluginCard({ plugin, selected, onToggle, isSingleSelect, isDisabledBySelection }: PluginCardProps) {
  return (
    <Card
      hoverable={!isDisabledBySelection}
      selected={selected}
      onClick={isDisabledBySelection ? undefined : onToggle}
      className={`flex items-start gap-3 p-4 ${isDisabledBySelection ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div
        className={`flex-shrink-0 w-5 h-5 flex items-center justify-center transition-colors ${
          isSingleSelect
            ? `rounded-full border-2 ${
                selected
                  ? 'bg-primary-500 border-primary-500'
                  : 'border-surface-600 hover:border-surface-500'
              }`
            : `rounded border-2 ${
                selected
                  ? 'bg-primary-500 border-primary-500'
                  : 'border-surface-600 hover:border-surface-500'
              }`
        }`}
      >
        {selected && (
          isSingleSelect ? (
            <div className="w-2 h-2 rounded-full bg-white" />
          ) : (
            <Check className="w-3 h-3 text-white" />
          )
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-white truncate">{plugin.name}</h4>
          {plugin.isPopular && (
            <span className="text-xs bg-primary-500/20 text-primary-400 px-1.5 py-0.5 rounded">
              Recommended
            </span>
          )}
        </div>
        <p className="text-sm text-surface-400 line-clamp-2">{plugin.description}</p>
      </div>
    </Card>
  );
}
