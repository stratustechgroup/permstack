import { useState, useCallback } from 'react';
import { X, Upload, FileText, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { Button, Badge } from './ui';
import { parseConfig, convertToRanks, type ParsedConfig } from '../lib/configParser';
import { permissionPluginInfo, type PermissionPluginType } from '../lib/generateYaml';
import type { Rank } from '../data/types';

interface ConfigUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (ranks: Rank[], detectedPlugins: string[], sourcePlugin: PermissionPluginType) => void;
}

type ImportMode = 'migrate' | 'edit' | 'add';

export function ConfigUploadModal({ isOpen, onClose, onImport }: ConfigUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [parsedConfig, setParsedConfig] = useState<ParsedConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>('edit');
  const [targetPlugin, setTargetPlugin] = useState<PermissionPluginType>('luckperms');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const processFile = useCallback((file: File) => {
    setError(null);

    if (!file.name.endsWith('.yml') && !file.name.endsWith('.yaml') && !file.name.endsWith('.json')) {
      setError('Please upload a .yml, .yaml, or .json file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = parseConfig(content);

      if (!result) {
        setError('Could not parse the config file. Make sure it\'s a valid LuckPerms, GroupManager, or PermissionsEx config.');
        return;
      }

      if (result.ranks.length === 0) {
        setError('No ranks/groups found in the config file.');
        return;
      }

      setParsedConfig(result);
      setTargetPlugin(result.pluginType); // Default to same plugin
    };

    reader.onerror = () => {
      setError('Error reading file');
    };

    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const handleImport = () => {
    if (!parsedConfig) return;

    const ranks = convertToRanks(parsedConfig.ranks);
    onImport(ranks, parsedConfig.detectedPlugins, importMode === 'migrate' ? targetPlugin : parsedConfig.pluginType);
    handleClose();
  };

  const handleClose = () => {
    setParsedConfig(null);
    setError(null);
    setImportMode('edit');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-2xl bg-surface-900 border border-surface-800 rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-800">
          <div>
            <h2 className="text-xl font-semibold text-white">Import Configuration</h2>
            <p className="text-sm text-surface-400 mt-1">
              Upload your existing permission config to import ranks and permissions
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-surface-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {!parsedConfig ? (
            <>
              {/* Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                  dragActive
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-surface-700 hover:border-surface-600'
                }`}
              >
                <Upload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-primary-400' : 'text-surface-500'}`} />
                <p className="text-white font-medium mb-2">Drop your config file here</p>
                <p className="text-surface-400 text-sm mb-4">or click to browse</p>
                <input
                  type="file"
                  accept=".yml,.yaml,.json"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="secondary" size="sm" className="pointer-events-none">
                  Choose File
                </Button>
              </div>

              {/* Supported Formats */}
              <div className="mt-6 p-4 bg-surface-800/50 rounded-lg">
                <p className="text-sm font-medium text-surface-300 mb-2">Supported formats:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default" size="sm">LuckPerms YAML</Badge>
                  <Badge variant="default" size="sm">LuckPerms JSON</Badge>
                  <Badge variant="default" size="sm">GroupManager</Badge>
                  <Badge variant="default" size="sm">PermissionsEx</Badge>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Parsed Result */}
              <div className="space-y-6">
                {/* Detection Summary */}
                <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-200 font-medium">
                      Detected {permissionPluginInfo[parsedConfig.pluginType].name} configuration
                    </p>
                    <p className="text-sm text-green-200/70 mt-1">
                      Found {parsedConfig.ranks.length} rank{parsedConfig.ranks.length !== 1 ? 's' : ''} and {parsedConfig.detectedPlugins.length} plugin{parsedConfig.detectedPlugins.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Ranks Preview */}
                <div>
                  <h3 className="text-sm font-medium text-surface-400 uppercase tracking-wider mb-3">
                    Imported Ranks
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {parsedConfig.ranks.map((rank) => (
                      <div
                        key={rank.name}
                        className="flex items-center gap-2 px-3 py-1.5 bg-surface-800 rounded-lg"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: rank.color }}
                        />
                        <span className="text-sm text-white">{rank.displayName || rank.name}</span>
                        <span className="text-xs text-surface-500">
                          {rank.permissions.length} perms
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detected Plugins */}
                {parsedConfig.detectedPlugins.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-surface-400 uppercase tracking-wider mb-3">
                      Detected Plugins
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {parsedConfig.detectedPlugins.map((plugin) => (
                        <Badge key={plugin} variant="default" size="sm">
                          {plugin}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Import Mode */}
                <div>
                  <h3 className="text-sm font-medium text-surface-400 uppercase tracking-wider mb-3">
                    What would you like to do?
                  </h3>
                  <div className="space-y-2">
                    {[
                      {
                        id: 'edit',
                        label: 'Edit & Re-export',
                        description: 'Import ranks, modify them, and export in the same format',
                      },
                      {
                        id: 'migrate',
                        label: 'Migrate to another plugin',
                        description: 'Convert your config to a different permission plugin format',
                      },
                      {
                        id: 'add',
                        label: 'Add more plugins',
                        description: 'Keep your ranks and add permissions for new plugins',
                      },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setImportMode(mode.id as ImportMode)}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                          importMode === mode.id
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-surface-700 hover:border-surface-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              importMode === mode.id
                                ? 'border-primary-500'
                                : 'border-surface-600'
                            }`}
                          >
                            {importMode === mode.id && (
                              <div className="w-2 h-2 rounded-full bg-primary-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{mode.label}</p>
                            <p className="text-xs text-surface-400">{mode.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Plugin (for migration) */}
                {importMode === 'migrate' && (
                  <div>
                    <h3 className="text-sm font-medium text-surface-400 uppercase tracking-wider mb-3">
                      Target Permission Plugin
                    </h3>
                    <div className="flex items-center gap-4 p-4 bg-surface-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-surface-400" />
                        <span className="text-white">{permissionPluginInfo[parsedConfig.pluginType].name}</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-surface-500" />
                      <select
                        value={targetPlugin}
                        onChange={(e) => setTargetPlugin(e.target.value as PermissionPluginType)}
                        className="flex-1 px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {Object.entries(permissionPluginInfo).map(([id, info]) => (
                          <option key={id} value={id} disabled={id === parsedConfig.pluginType}>
                            {info.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-surface-800 bg-surface-900">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          {parsedConfig && (
            <Button onClick={handleImport}>
              Import Configuration
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
