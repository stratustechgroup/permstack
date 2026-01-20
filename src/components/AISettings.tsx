import { useState, useEffect } from 'react';
import { Settings, Key, Sparkles, Check, X } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button, Badge } from './ui';
import { configureAI, getAIConfig, isAIConfigured, type AIConfig } from '../lib/ai';

interface AISettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AISettings({ isOpen, onClose }: AISettingsProps) {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<'anthropic' | 'openai'>('anthropic');
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load existing config
  useEffect(() => {
    const config = getAIConfig();
    if (config.apiKey) {
      setApiKey(config.apiKey);
    }
    if (config.apiProvider) {
      setProvider(config.apiProvider);
    }
    if (config.enableWebSearch !== undefined) {
      setEnableWebSearch(config.enableWebSearch);
    }
  }, [isOpen]);

  const handleSave = () => {
    const config: AIConfig = {
      apiKey: apiKey.trim() || undefined,
      apiProvider: provider,
      enableWebSearch,
    };

    configureAI(config);

    // Store in localStorage for persistence
    if (apiKey.trim()) {
      localStorage.setItem('permstack_ai_config', JSON.stringify({
        apiKey: apiKey.trim(),
        apiProvider: provider,
        enableWebSearch,
      }));
    } else {
      localStorage.removeItem('permstack_ai_config');
    }

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setApiKey('');
    configureAI({});
    localStorage.removeItem('permstack_ai_config');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Settings" size="md">
      <div className="space-y-5">
        <div className="flex items-start gap-3 p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg">
          <Sparkles className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white font-medium">Enhanced AI Features</p>
            <p className="text-xs text-surface-400 mt-1">
              Adding an API key enables smarter rank detection and plugin permission lookup.
              Your key is stored locally and never sent to our servers.
            </p>
          </div>
        </div>

        {/* Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-2">
            AI Provider
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setProvider('anthropic')}
              className={`p-3 rounded-lg border text-left transition-all ${
                provider === 'anthropic'
                  ? 'bg-primary-500/10 border-primary-500'
                  : 'bg-surface-800 border-surface-700 hover:border-surface-600'
              }`}
            >
              <div className="font-medium text-white text-sm">Anthropic (Claude)</div>
              <div className="text-xs text-surface-400 mt-0.5">Recommended</div>
            </button>
            <button
              onClick={() => setProvider('openai')}
              className={`p-3 rounded-lg border text-left transition-all ${
                provider === 'openai'
                  ? 'bg-primary-500/10 border-primary-500'
                  : 'bg-surface-800 border-surface-700 hover:border-surface-600'
              }`}
            >
              <div className="font-medium text-white text-sm">OpenAI (GPT)</div>
              <div className="text-xs text-surface-400 mt-0.5">Alternative</div>
            </button>
          </div>
        </div>

        {/* API Key */}
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">
            API Key <span className="text-surface-500">(optional)</span>
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="input w-full pl-10 pr-10 font-mono text-sm"
              placeholder={provider === 'anthropic' ? 'sk-ant-...' : 'sk-...'}
            />
            {apiKey && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-xs text-surface-500 mt-1">
            Get your API key from{' '}
            <a
              href={provider === 'anthropic' ? 'https://console.anthropic.com/' : 'https://platform.openai.com/api-keys'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:underline"
            >
              {provider === 'anthropic' ? 'console.anthropic.com' : 'platform.openai.com'}
            </a>
          </p>
        </div>

        {/* Web Search Toggle */}
        <div className="flex items-center justify-between p-3 bg-surface-800 rounded-lg">
          <div>
            <p className="text-sm text-white font-medium">Enable Web Search</p>
            <p className="text-xs text-surface-400 mt-0.5">
              Search for plugin permissions online (requires backend)
            </p>
          </div>
          <button
            onClick={() => setEnableWebSearch(!enableWebSearch)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              enableWebSearch ? 'bg-primary-500' : 'bg-surface-600'
            }`}
            disabled
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                enableWebSearch ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <Badge variant={isAIConfigured() ? 'success' : 'default'}>
            {isAIConfigured() ? 'AI Configured' : 'Using Local Detection'}
          </Badge>
          {!isAIConfigured() && (
            <span className="text-xs text-surface-400">
              Local heuristics will be used for rank detection
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-surface-800">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saved}>
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Saved!
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Button to open AI settings
export function AISettingsButton({ onClick }: { onClick: () => void }) {
  const configured = isAIConfigured();

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
        configured
          ? 'border-primary-500/50 bg-primary-500/10 text-primary-400 hover:bg-primary-500/20'
          : 'border-surface-700 text-surface-400 hover:border-surface-600 hover:text-white'
      }`}
    >
      {configured ? (
        <Sparkles className="w-4 h-4" />
      ) : (
        <Settings className="w-4 h-4" />
      )}
      <span className="text-sm">AI {configured ? 'Enabled' : 'Settings'}</span>
    </button>
  );
}

// Initialize AI config from localStorage
export function initializeAIConfig() {
  try {
    const stored = localStorage.getItem('permstack_ai_config');
    if (stored) {
      const config = JSON.parse(stored);
      configureAI(config);
    }
  } catch (error) {
    console.warn('Failed to load AI config:', error);
  }
}
