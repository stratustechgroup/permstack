import { useState } from 'react';
import { FileCode, Terminal, FileJson } from 'lucide-react';
import { Tabs, CodeBlock } from './ui';
import { generateYaml, generateCommands, generateJson } from '../lib/generateYaml';
import type { Rank, ServerType } from '../data';

interface OutputPanelProps {
  serverType: ServerType;
  selectedPlugins: string[];
  ranks: Rank[];
}

type OutputFormat = 'yaml' | 'commands' | 'json';

export function OutputPanel({ serverType, selectedPlugins, ranks }: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState<OutputFormat>('yaml');

  const tabs = [
    { id: 'yaml', label: 'YAML Config', icon: <FileCode className="w-4 h-4" /> },
    { id: 'commands', label: 'LP Commands', icon: <Terminal className="w-4 h-4" /> },
    { id: 'json', label: 'JSON Export', icon: <FileJson className="w-4 h-4" /> },
  ];

  const options = { serverType, selectedPlugins, ranks };

  const outputs: Record<OutputFormat, { code: string; filename: string }> = {
    yaml: {
      code: generateYaml(options),
      filename: 'groups.yml',
    },
    commands: {
      code: generateCommands(options),
      filename: 'luckperms-setup.txt',
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
          Copy or download your LuckPerms configuration in your preferred format.
        </p>
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
            <code className="bg-surface-800 px-1.5 py-0.5 rounded">/plugins/LuckPerms/groups.yml</code>{' '}
            and restart your server or run <code className="bg-surface-800 px-1.5 py-0.5 rounded">/lp sync</code>.
          </div>
        )}
        {activeTab === 'commands' && (
          <div className="text-sm text-surface-300">
            <strong className="text-white">Instructions:</strong> Run these commands in your server console
            or as an operator. Commands can be pasted one at a time or in batch.
          </div>
        )}
        {activeTab === 'json' && (
          <div className="text-sm text-surface-300">
            <strong className="text-white">Instructions:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Download the file</li>
              <li>Place in <code className="bg-surface-800 px-1.5 py-0.5 rounded">/plugins/LuckPerms/</code></li>
              <li>Run <code className="bg-surface-800 px-1.5 py-0.5 rounded">/lp import permstack-config.json --replace</code></li>
            </ol>
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
