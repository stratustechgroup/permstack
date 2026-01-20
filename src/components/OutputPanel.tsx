import { useState } from 'react';
import { FileCode, Terminal, FileJson, AlertCircle } from 'lucide-react';
import { Tabs, CodeBlock } from './ui';
import {
  generateYaml,
  generateCommands,
  generateJson,
  getSelectedPermissionPlugin,
  permissionPluginInfo,
} from '../lib/generateYaml';
import type { Rank, ServerType } from '../data';

interface OutputPanelProps {
  serverType: ServerType;
  selectedPlugins: string[];
  ranks: Rank[];
}

type OutputFormat = 'yaml' | 'commands' | 'json';

export function OutputPanel({ serverType, selectedPlugins, ranks }: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState<OutputFormat>('yaml');

  // Detect selected permission plugin
  const permissionPlugin = getSelectedPermissionPlugin(selectedPlugins);
  const pluginInfo = permissionPluginInfo[permissionPlugin];

  // Check if a permission plugin is selected
  const hasPermissionPlugin = selectedPlugins.some(p =>
    ['luckperms', 'groupmanager', 'permissionsex', 'ultrapermissions', 'powerfulperms'].includes(p)
  );

  const tabs = [
    { id: 'yaml', label: 'YAML Config', icon: <FileCode className="w-4 h-4" /> },
    { id: 'commands', label: `${pluginInfo.name} Commands`, icon: <Terminal className="w-4 h-4" /> },
    { id: 'json', label: 'JSON Export', icon: <FileJson className="w-4 h-4" /> },
  ];

  const options = { serverType, selectedPlugins, ranks, permissionPlugin };

  // Determine filename based on plugin
  const getYamlFilename = () => {
    switch (permissionPlugin) {
      case 'groupmanager':
        return 'groups.yml';
      case 'permissionsex':
        return 'permissions.yml';
      default:
        return 'groups.yml';
    }
  };

  const getCommandsFilename = () => {
    return `${permissionPlugin}-setup.txt`;
  };

  const outputs: Record<OutputFormat, { code: string; filename: string }> = {
    yaml: {
      code: generateYaml(options),
      filename: getYamlFilename(),
    },
    commands: {
      code: generateCommands(options),
      filename: getCommandsFilename(),
    },
    json: {
      code: generateJson(options),
      filename: 'permstack-config.json',
    },
  };

  const handleDownload = () => {
    const { code, filename } = outputs[activeTab];
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Generated Configuration</h2>
        <p className="text-surface-400">
          Copy or download your <span className="text-primary-400 font-medium">{pluginInfo.name}</span> configuration in your preferred format.
        </p>
      </div>

      {/* No permission plugin warning */}
      {!hasPermissionPlugin && (
        <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-200 font-medium">No permission plugin selected</p>
            <p className="text-sm text-yellow-200/70 mt-1">
              You haven't selected a permission plugin. Defaulting to LuckPerms format.
              Go back to Plugins to select your permission plugin for the correct output format.
            </p>
          </div>
        </div>
      )}

      {/* Plugin badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-800 rounded-lg">
        <span className="text-xs text-surface-500">Output format:</span>
        <span className="text-sm font-medium text-white">{pluginInfo.name}</span>
      </div>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as OutputFormat)}
      />

      {/* Format-specific instructions */}
      <div className="bg-surface-900 border border-surface-800 rounded-lg p-4">
        {activeTab === 'yaml' && (
          <div className="text-sm text-surface-300">
            <strong className="text-white">Instructions:</strong> Place this file at{' '}
            <code className="bg-surface-800 px-1.5 py-0.5 rounded">{pluginInfo.configPath}{getYamlFilename()}</code>{' '}
            and run <code className="bg-surface-800 px-1.5 py-0.5 rounded">{pluginInfo.syncCommand}</code> or restart your server.
          </div>
        )}
        {activeTab === 'commands' && (
          <div className="text-sm text-surface-300">
            <strong className="text-white">Instructions:</strong> Run these commands in your server console
            or as an operator. Commands are formatted for <span className="text-primary-400">{pluginInfo.name}</span>.
          </div>
        )}
        {activeTab === 'json' && (
          <div className="text-sm text-surface-300">
            <strong className="text-white">Instructions:</strong>
            {permissionPlugin === 'luckperms' ? (
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Download the file</li>
                <li>Place in <code className="bg-surface-800 px-1.5 py-0.5 rounded">/plugins/LuckPerms/</code></li>
                <li>Run <code className="bg-surface-800 px-1.5 py-0.5 rounded">/lp import permstack-config.json --replace</code></li>
              </ol>
            ) : (
              <p className="mt-2">
                JSON export is primarily for LuckPerms. For {pluginInfo.name}, use the YAML or Commands tab instead.
              </p>
            )}
          </div>
        )}
      </div>

      <CodeBlock
        code={outputs[activeTab].code}
        filename={outputs[activeTab].filename}
        language={activeTab === 'json' ? 'json' : activeTab === 'yaml' ? 'yaml' : 'bash'}
        onDownload={handleDownload}
      />
    </div>
  );
}
