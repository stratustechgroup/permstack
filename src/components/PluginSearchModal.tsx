import { useState } from 'react';
import { Search, Loader2, Plus, AlertCircle, Sparkles, Check, Database, ChevronDown, ChevronUp, FileText, Wand2 } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button, Badge, Card } from './ui';
import { lookupPluginPermissions, isAIConfigured, parseDocumentation, type PluginLookupResult } from '../lib/ai';
import { saveCustomPlugin, type CustomPluginData } from '../data/customPlugins';
import type { PermissionNode, Plugin, ServerType } from '../data/types';

interface PluginSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlugin: (plugin: Plugin, permissions: PermissionNode[]) => void;
  existingPlugins: string[];
}

type SearchMode = 'search' | 'paste';

export function PluginSearchModal({
  isOpen,
  onClose,
  onAddPlugin,
  existingPlugins,
}: PluginSearchModalProps) {
  const [mode, setMode] = useState<SearchMode>('search');
  const [query, setQuery] = useState('');
  const [docText, setDocText] = useState('');
  const [pluginNameForDoc, setPluginNameForDoc] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<PluginLookupResult | null>(null);
  const [added, setAdded] = useState(false);
  const [expandedPermissions, setExpandedPermissions] = useState<Set<number>>(new Set());
  const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(new Set());

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setResult(null);
    setExpandedPermissions(new Set());
    setSelectedPermissions(new Set());

    try {
      const lookupResult = await lookupPluginPermissions(query.trim());
      setResult(lookupResult);
      // Select all permissions by default
      if (lookupResult.found) {
        setSelectedPermissions(new Set(lookupResult.permissions.map((_, i) => i)));
      }
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

  const handleParseDoc = () => {
    if (!docText.trim() || !pluginNameForDoc.trim()) return;

    setIsSearching(true);
    setResult(null);
    setExpandedPermissions(new Set());
    setSelectedPermissions(new Set());

    try {
      const parsed = parseDocumentation(docText, pluginNameForDoc);
      const slug = pluginNameForDoc.toLowerCase().replace(/[^a-z0-9]/g, '');

      if (parsed.length > 0) {
        const permissions: PermissionNode[] = parsed.map((p, i) => ({
          id: `${slug}-doc-${i}`,
          pluginId: slug,
          node: p.node,
          description: p.description + (p.command ? ` (${p.command})` : ''),
          recommendedRank: p.recommendedRank,
          riskLevel: p.riskLevel,
          serverTypes: ['survival', 'factions', 'skyblock', 'prison', 'minigames', 'creative', 'custom'] as ServerType[],
          isDefault: p.riskLevel === 'safe' && i < 5,
        }));

        setResult({
          found: true,
          pluginName: pluginNameForDoc,
          permissions,
          source: 'local',
        });
        setSelectedPermissions(new Set(permissions.map((_, i) => i)));
      } else {
        setResult({
          found: false,
          pluginName: pluginNameForDoc,
          permissions: [],
          source: 'local',
          error: 'Could not parse any permissions from the documentation. Try a different format.',
        });
      }
    } catch (error) {
      setResult({
        found: false,
        pluginName: pluginNameForDoc,
        permissions: [],
        source: 'local',
        error: 'Failed to parse documentation.',
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

    // Filter to only selected permissions
    const selectedPerms = result.permissions.filter((_, i) => selectedPermissions.has(i));

    // Save to internal database (localStorage)
    const customData: CustomPluginData = {
      plugin,
      permissions: selectedPerms,
      addedAt: new Date().toISOString(),
      source: result.source,
    };
    saveCustomPlugin(customData);

    onAddPlugin(plugin, selectedPerms);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuery('');
      setDocText('');
      setPluginNameForDoc('');
      setResult(null);
      setSelectedPermissions(new Set());
      onClose();
    }, 1000);
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedPermissions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedPermissions(newExpanded);
  };

  const toggleSelected = (index: number) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedPermissions(newSelected);
  };

  const toggleAllSelected = () => {
    if (result) {
      if (selectedPermissions.size === result.permissions.length) {
        setSelectedPermissions(new Set());
      } else {
        setSelectedPermissions(new Set(result.permissions.map((_, i) => i)));
      }
    }
  };

  const isAlreadyAdded = result
    ? existingPlugins.some(
        (p) => p.toLowerCase() === result.pluginName.toLowerCase().replace(/[^a-z0-9]/g, '')
      )
    : false;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'safe': return 'text-green-400 bg-green-500/20';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/20';
      case 'dangerous': return 'text-orange-400 bg-orange-500/20';
      case 'critical': return 'text-red-400 bg-red-500/20';
      default: return 'text-surface-400 bg-surface-500/20';
    }
  };

  const resetState = () => {
    setResult(null);
    setSelectedPermissions(new Set());
    setExpandedPermissions(new Set());
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Find Plugin Permissions" size="2xl">
      <div className="space-y-5">
        {/* Mode Toggle */}
        <div className="flex gap-2 p-1 bg-surface-800 rounded-lg">
          <button
            onClick={() => { setMode('search'); resetState(); }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'search'
                ? 'bg-primary-500 text-white'
                : 'text-surface-400 hover:text-white hover:bg-surface-700'
            }`}
          >
            <Search className="w-4 h-4" />
            Search by Name
          </button>
          <button
            onClick={() => { setMode('paste'); resetState(); }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'paste'
                ? 'bg-primary-500 text-white'
                : 'text-surface-400 hover:text-white hover:bg-surface-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            Paste Documentation
          </button>
        </div>

        {/* Info */}
        <div className="flex items-start gap-3 p-3 bg-surface-800 rounded-lg">
          <Sparkles className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
          <div>
            {mode === 'search' ? (
              <>
                <p className="text-sm text-white">
                  Search for plugins not in our database
                </p>
                <p className="text-xs text-surface-400 mt-1">
                  {isAIConfigured()
                    ? 'AI will generate permission nodes based on its knowledge. Added plugins are saved locally.'
                    : 'Basic permission patterns will be generated. Enable AI for better results.'}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-white">
                  Paste plugin documentation to extract permissions
                </p>
                <p className="text-xs text-surface-400 mt-1">
                  Paste command lists or permission docs from Spigot/Bukkit pages. Supports formats like:
                  <br />
                  <code className="text-primary-400">/plugin command (description)</code> or <code className="text-primary-400">permission.node - description</code>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Search Mode */}
        {mode === 'search' && (
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
                  placeholder="e.g. ClearLag, McMMO, Jobs"
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
        )}

        {/* Paste Mode */}
        {mode === 'paste' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">
                Plugin Name
              </label>
              <input
                type="text"
                value={pluginNameForDoc}
                onChange={(e) => setPluginNameForDoc(e.target.value)}
                className="input w-full"
                placeholder="e.g. ClearLag"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">
                Documentation Text
              </label>
              <textarea
                value={docText}
                onChange={(e) => setDocText(e.target.value)}
                className="input w-full h-32 resize-none font-mono text-xs"
                placeholder={`Paste documentation here, e.g.:\n\nCommands\n(Permissions are just pluginname.<command-name>)\n/plugin clear (Clears entities)\n/plugin reload (Reloads config)`}
              />
            </div>
            <Button
              onClick={handleParseDoc}
              disabled={!docText.trim() || !pluginNameForDoc.trim() || isSearching}
              className="w-full"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              Parse Documentation
            </Button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {result.found ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-white">{result.pluginName}</h3>
                    <Badge variant={result.source === 'ai' ? 'info' : 'default'} size="sm">
                      {result.source === 'ai' ? 'AI Generated' : mode === 'paste' ? 'From Docs' : 'Database'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAlreadyAdded && (
                      <Badge variant="warning" size="sm">Already Added</Badge>
                    )}
                    <button
                      onClick={toggleAllSelected}
                      className="text-xs text-primary-400 hover:text-primary-300"
                    >
                      {selectedPermissions.size === result.permissions.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                </div>

                {/* Permission List - Larger viewport */}
                <div className="max-h-[350px] overflow-y-auto space-y-2 pr-2">
                  {result.permissions.map((perm, i) => {
                    const isExpanded = expandedPermissions.has(i);
                    const isSelected = selectedPermissions.has(i);

                    return (
                      <Card
                        key={i}
                        className={`p-0 overflow-hidden transition-colors ${
                          isSelected ? 'ring-1 ring-primary-500/50' : 'opacity-60'
                        }`}
                      >
                        <div className="flex items-stretch">
                          {/* Selection checkbox */}
                          <button
                            onClick={() => toggleSelected(i)}
                            className={`px-3 flex items-center justify-center border-r border-surface-700 hover:bg-surface-700 transition-colors ${
                              isSelected ? 'bg-primary-500/20' : 'bg-surface-800'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border ${
                              isSelected
                                ? 'bg-primary-500 border-primary-500'
                                : 'border-surface-500'
                            } flex items-center justify-center`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </button>

                          {/* Main content */}
                          <div className="flex-1 p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <code className="text-sm text-primary-400 font-mono break-all">
                                  {perm.node}
                                </code>
                                <p className="text-xs text-surface-400 mt-1">
                                  {perm.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={`text-xs px-2 py-0.5 rounded ${getRiskColor(perm.riskLevel)}`}>
                                  {perm.riskLevel}
                                </span>
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
                            </div>

                            {/* Expandable details */}
                            <button
                              onClick={() => toggleExpanded(i)}
                              className="flex items-center gap-1 mt-2 text-xs text-surface-500 hover:text-surface-300"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-3 h-3" />
                                  Hide details
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3 h-3" />
                                  Show details
                                </>
                              )}
                            </button>

                            {isExpanded && (
                              <div className="mt-3 pt-3 border-t border-surface-700 space-y-2">
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                  <div>
                                    <span className="text-surface-500">Recommended Rank:</span>
                                    <span className="text-white ml-2">{perm.recommendedRank}</span>
                                  </div>
                                  <div>
                                    <span className="text-surface-500">Risk Level:</span>
                                    <span className={`ml-2 ${getRiskColor(perm.riskLevel).split(' ')[0]}`}>
                                      {perm.riskLevel}
                                    </span>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="text-surface-500">Server Types:</span>
                                    <span className="text-white ml-2">
                                      {perm.serverTypes?.join(', ') || 'All'}
                                    </span>
                                  </div>
                                  {perm.isDefault && (
                                    <div className="col-span-2">
                                      <Badge variant="info" size="sm">Default Permission</Badge>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-surface-500">
                  <span>
                    {selectedPermissions.size} of {result.permissions.length} permissions selected
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    <span>Will be saved to local database</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-surface-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-white">No permissions found</p>
                  <p className="text-xs text-surface-400 mt-0.5">
                    {result.error || 'Try a different plugin name or paste documentation.'}
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
              disabled={isAlreadyAdded || added || selectedPermissions.size === 0}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Added!
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Plugin ({selectedPermissions.size} perms)
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
