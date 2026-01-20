import { useState, useEffect } from 'react';
import { ArrowRight, Copy, Check, Layers, FileCode, Shield, Zap, ChevronRight } from 'lucide-react';
import { Button } from './ui';

interface HeroProps {
  onStart: () => void;
}

// Sample plugins for the preview
const previewPlugins = [
  { id: 'luckperms', name: 'LuckPerms', selected: true },
  { id: 'essentialsx', name: 'EssentialsX', selected: true },
  { id: 'worldguard', name: 'WorldGuard', selected: true },
  { id: 'vault', name: 'Vault', selected: false },
  { id: 'griefprevention', name: 'GriefPrevention', selected: false },
];

// Sample ranks for the preview
const previewRanks = [
  { name: 'Default', color: '#9CA3AF' },
  { name: 'VIP', color: '#10B981' },
  { name: 'MVP', color: '#8B5CF6' },
  { name: 'Admin', color: '#EF4444' },
];

// Sample output configs for different permission plugins
const outputFormats: Record<string, { name: string; extension: string; lines: { text: string; type: string }[] }> = {
  luckperms: {
    name: 'LuckPerms',
    extension: 'yml',
    lines: [
      { text: '# LuckPerms Group Configuration', type: 'comment' },
      { text: 'vip:', type: 'key' },
      { text: '  permissions:', type: 'subkey' },
      { text: '    - essentials.back', type: 'value' },
      { text: '    - essentials.sethome.multiple.3', type: 'value' },
      { text: '    - worldguard.region.bypass.*', type: 'value' },
      { text: '  parents:', type: 'subkey' },
      { text: '    - default', type: 'parent' },
    ],
  },
  groupmanager: {
    name: 'GroupManager',
    extension: 'yml',
    lines: [
      { text: '# GroupManager Configuration', type: 'comment' },
      { text: 'groups:', type: 'key' },
      { text: '  vip:', type: 'subkey' },
      { text: '    permissions:', type: 'subkey' },
      { text: '      - essentials.back', type: 'value' },
      { text: '      - essentials.sethome.multiple.3', type: 'value' },
      { text: '    inheritance:', type: 'subkey' },
      { text: '      - default', type: 'parent' },
    ],
  },
  permissionsex: {
    name: 'PermissionsEx',
    extension: 'yml',
    lines: [
      { text: '# PermissionsEx Configuration', type: 'comment' },
      { text: 'groups:', type: 'key' },
      { text: '  vip:', type: 'subkey' },
      { text: '    permissions:', type: 'subkey' },
      { text: '    - essentials.back', type: 'value' },
      { text: '    - essentials.sethome.multiple.3', type: 'value' },
      { text: '    parents:', type: 'subkey' },
      { text: '    - default', type: 'parent' },
    ],
  },
};

export function Hero({ onStart }: HeroProps) {
  const [copied, setCopied] = useState(false);
  const [activeFormat, setActiveFormat] = useState<'luckperms' | 'groupmanager' | 'permissionsex'>('luckperms');
  const [visibleLines, setVisibleLines] = useState(0);

  // Reset animation when format changes
  useEffect(() => {
    setVisibleLines(0);
  }, [activeFormat]);

  // Typing animation
  useEffect(() => {
    const lines = outputFormats[activeFormat].lines;
    if (visibleLines < lines.length) {
      const timer = setTimeout(() => {
        setVisibleLines(v => v + 1);
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [visibleLines, activeFormat]);

  const handleCopy = () => {
    const text = outputFormats[activeFormat].lines.map(l => l.text).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLineColor = (type: string) => {
    switch (type) {
      case 'comment': return 'text-surface-500';
      case 'key': return 'text-purple-400';
      case 'subkey': return 'text-blue-400';
      case 'value': return 'text-green-400';
      case 'parent': return 'text-yellow-400';
      default: return 'text-surface-400';
    }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-800/80 border border-surface-700 text-xs font-medium text-surface-300 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Works with LuckPerms, GroupManager, PermissionsEx & more
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Minecraft Permission Generator
            </h1>

            <p className="text-surface-400 text-lg max-w-2xl mx-auto mb-8">
              Select your plugins, define your ranks, and export configurations for any
              permission plugin. Compatible with 100+ plugins across all server types.
            </p>

            <Button size="lg" onClick={onStart} className="inline-flex items-center gap-2">
              <span>Start Building</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Product Preview - Two Column */}
          <div className="grid lg:grid-cols-2 gap-6 mt-12">
            {/* Left: Builder Preview */}
            <div className="bg-surface-900 border border-surface-800 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-surface-800/50 border-b border-surface-700 flex items-center justify-between">
                <span className="text-sm font-medium text-surface-300">Plugin Selection</span>
                <span className="text-xs text-surface-500">Step 2 of 4</span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {previewPlugins.map(plugin => (
                    <div
                      key={plugin.id}
                      className={`px-3 py-2 rounded-lg border text-sm flex items-center gap-2 ${
                        plugin.selected
                          ? 'bg-primary-500/10 border-primary-500/30 text-white'
                          : 'bg-surface-800/50 border-surface-700 text-surface-400'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        plugin.selected ? 'bg-primary-500 border-primary-500' : 'border-surface-600'
                      }`}>
                        {plugin.selected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      {plugin.name}
                    </div>
                  ))}
                </div>

                <div className="border-t border-surface-800 pt-4">
                  <span className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-2 block">Ranks</span>
                  <div className="flex gap-2">
                    {previewRanks.map(rank => (
                      <div
                        key={rank.name}
                        className="px-3 py-1.5 rounded-md bg-surface-800 text-sm flex items-center gap-2"
                      >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: rank.color }} />
                        <span className="text-surface-300">{rank.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Output Preview */}
            <div className="bg-surface-900 border border-surface-800 rounded-xl overflow-hidden">
              {/* Format Tabs */}
              <div className="px-4 py-2 bg-surface-800/50 border-b border-surface-700 flex items-center justify-between">
                <div className="flex gap-1">
                  {Object.entries(outputFormats).map(([key, format]) => (
                    <button
                      key={key}
                      onClick={() => setActiveFormat(key as 'luckperms' | 'groupmanager' | 'permissionsex')}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        activeFormat === key
                          ? 'bg-primary-500/20 text-primary-400'
                          : 'text-surface-400 hover:text-surface-300'
                      }`}
                    >
                      {format.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2 py-1 text-xs text-surface-400 hover:text-white transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Preview */}
              <div className="p-4 font-mono text-sm leading-relaxed h-52 overflow-hidden">
                {outputFormats[activeFormat].lines.slice(0, visibleLines).map((line, i) => (
                  <div key={i} className={getLineColor(line.type)}>
                    {line.text}
                  </div>
                ))}
                {visibleLines < outputFormats[activeFormat].lines.length && (
                  <span className="inline-block w-2 h-4 bg-primary-500 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-t border-surface-800/50 bg-surface-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Built for compatibility</h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              Generate configs for any permission plugin and server type
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Layers,
                title: 'Multiple Formats',
                description: 'Export for LuckPerms, GroupManager, PermissionsEx, UltraPermissions, and more',
              },
              {
                icon: FileCode,
                title: 'All Server Types',
                description: 'Survival, Skyblock, Factions, Minigames - filter plugins by gamemode',
              },
              {
                icon: Shield,
                title: 'Smart Inheritance',
                description: 'Automatic rank hierarchy with proper permission inheritance',
              },
              {
                icon: Zap,
                title: '100+ Plugins',
                description: 'Pre-configured permissions for the most popular Minecraft plugins',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-surface-800/30 border border-surface-800 rounded-lg p-5"
              >
                <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center mb-3">
                  <feature.icon className="w-4 h-4 text-primary-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-xs text-surface-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 border-t border-surface-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white">How it works</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Choose type', desc: 'Select your server gamemode' },
              { num: '2', title: 'Pick plugins', desc: 'Select installed plugins' },
              { num: '3', title: 'Define ranks', desc: 'Configure your rank hierarchy' },
              { num: '4', title: 'Export', desc: 'Download or copy your config' },
            ].map((step, i) => (
              <div key={step.num} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center text-sm font-semibold text-surface-400">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white mb-0.5">{step.title}</h3>
                  <p className="text-xs text-surface-500">{step.desc}</p>
                </div>
                {i < 3 && (
                  <ChevronRight className="hidden md:block w-4 h-4 text-surface-700 ml-auto self-center" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              <span>Get Started</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
