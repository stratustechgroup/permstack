import { useState } from 'react';
import { Search, Loader2, Plus, AlertCircle, Sparkles, Check } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button, Badge, Card } from './ui';
import { lookupPluginPermissions, isAIConfigured, type PluginLookupResult } from '../lib/ai';
import type { PermissionNode, Plugin } from '../data/types';

interface PluginSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlugin: (plugin: Plugin, permissions: PermissionNode[]) => void;
  existingPlugins: string[];
}

export function PluginSearchModal({
  isOpen,
  onClose,
  onAddPlugin,
  existingPlugins,
}: PluginSearchModalProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<PluginLookupResult | null>(null);
  const [added, setAdded] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setResult(null);

    try {
      const lookupResult = await lookupPluginPermissions(query.trim());
      setResult(lookupResult);
    } catch (error) {
      setResult({
        found: false,
        pluginName: query,
        permissions: [],
        source: 'local',
        error: 'Search failed. Please try again.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdd = () => {
    if (!result || !result.found) return;

    const slug = result.pluginName.toLowerCase().replace(/[^a-z0-9]/g, '');

    const plugin: Plugin = {
      id: slug,
      name: result.pluginName,
      slug,
      description: `Custom plugin: ${result.pluginName}`,
      category: 'utility',
      isPopular: false,
    };

    onAddPlugin(plugin, result.permissions);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuery('');
      setResult(null);
      onClose();
    }, 1000);
  };

  const isAlreadyAdded = result
    ? existingPlugins.some(
        (p) => p.toLowerCase() === result.pluginName.toLowerCase().replace(/[^a-z0-9]/g, '')
      )
    : false;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Find Plugin Permissions" size="lg">
      <div className="space-y-5">
        {/* Info */}
        <div className="flex items-start gap-3 p-3 bg-surface-800 rounded-lg">
          <Sparkles className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white">
              Search for plugins not in our database
            </p>
            <p className="text-xs text-surface-400 mt-1">
              {isAIConfigured()
                ? 'AI will generate common permission nodes for the plugin.'
                : 'Basic permission patterns will be generated. Enable AI for better results.'}
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">
            Plugin Name
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="input w-full pl-10"
                placeholder="e.g. CustomPlugin, MyPlugin"
                autoFocus
              />
            </div>
            <Button onClick={handleSearch} disabled={!query.trim() || isSearching}>
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {result.found ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-white">{result.pluginName}</h3>
                    <Badge variant={result.source === 'ai' ? 'info' : 'default'} size="sm">
                      {result.source === 'ai' ? 'AI Generated' : 'Pattern Based'}
                    </Badge>
                  </div>
                  {isAlreadyAdded && (
                    <Badge variant="warning" size="sm">Already Added</Badge>
                  )}
                </div>

                {/* Permission List */}
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {result.permissions.map((perm, i) => (
                    <Card key={i} className="p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <code className="text-sm text-primary-400 font-mono">
                            {perm.node}
                          </code>
                          <p className="text-xs text-surface-400 mt-0.5">
                            {perm.description}
                          </p>
                        </div>
                        <Badge
                          variant={
                            perm.riskLevel === 'safe'
                              ? 'success'
                              : perm.riskLevel === 'moderate'
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                        >
                          {perm.recommendedRank}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>

                <p className="text-xs text-surface-500">
                  {result.permissions.length} permissions found. You can edit these after adding.
                </p>
              </>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-surface-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-white">No permissions found</p>
                  <p className="text-xs text-surface-400 mt-0.5">
                    {result.error || 'Try a different plugin name or enable AI for better results.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-surface-800">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {result?.found && (
            <Button
              onClick={handleAdd}
              disabled={isAlreadyAdded || added}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Added!
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Plugin
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
