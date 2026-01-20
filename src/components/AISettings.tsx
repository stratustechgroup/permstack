import { useState } from 'react';
import { Sparkles, Check, Zap, Shield, Brain, AlertCircle } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button, Badge } from './ui';
import { isAIConfigured } from '../lib/ai';

interface AISettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AISettings({ isOpen, onClose }: AISettingsProps) {
  const [preferences, setPreferences] = useState({
    autoSuggestRanks: true,
    smartPermissions: true,
  });
  const [saved, setSaved] = useState(false);
  const aiEnabled = isAIConfigured();

  const handleSave = () => {
    // Save preferences to localStorage
    localStorage.setItem('permstack_ai_preferences', JSON.stringify(preferences));
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Assistant" size="md">
      <div className="space-y-5">
        {/* AI Status */}
        {aiEnabled ? (
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-primary-500/20 to-purple-500/20 border border-primary-500/30 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-white font-medium">AI Assistant Active</p>
                <Badge variant="success" size="sm">Enabled</Badge>
              </div>
              <p className="text-xs text-surface-400 mt-1">
                Powered by GPT-4o-mini to help you create better permission configurations.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-white font-medium">AI Not Configured</p>
                <Badge variant="warning" size="sm">Limited</Badge>
              </div>
              <p className="text-xs text-surface-400 mt-1">
                Local pattern matching is still available. AI features require API configuration.
              </p>
            </div>
          </div>
        )}

        {/* Features */}
        <div>
          <h3 className="text-sm font-medium text-surface-300 mb-3">AI Features</h3>
          <div className="space-y-3">
            <FeatureItem
              icon={Brain}
              title="Smart Rank Detection"
              description="Automatically suggests permission levels based on rank names and descriptions"
              enabled={aiEnabled}
            />
            <FeatureItem
              icon={Zap}
              title="Plugin Permission Lookup"
              description="Finds and generates permissions for plugins not in our database"
              enabled={aiEnabled}
            />
            <FeatureItem
              icon={Shield}
              title="Risk Assessment"
              description="Identifies potentially dangerous permissions and suggests safer alternatives"
              enabled={aiEnabled}
            />
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h3 className="text-sm font-medium text-surface-300 mb-3">Preferences</h3>
          <div className="space-y-3">
            <PreferenceToggle
              label="Auto-suggest rank levels"
              description="Show AI suggestions when adding new ranks"
              checked={preferences.autoSuggestRanks}
              onChange={(checked) => setPreferences(p => ({ ...p, autoSuggestRanks: checked }))}
            />
            <PreferenceToggle
              label="Smart permission recommendations"
              description="Get context-aware permission suggestions"
              checked={preferences.smartPermissions}
              onChange={(checked) => setPreferences(p => ({ ...p, smartPermissions: checked }))}
            />
          </div>
        </div>

        {/* Info */}
        <p className="text-xs text-surface-500">
          AI features are provided at no cost. Your data is processed securely and never stored.
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-surface-800">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSave} disabled={saved}>
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Saved!
              </>
            ) : (
              'Save Preferences'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

interface FeatureItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
}

function FeatureItem({ icon: Icon, title, description, enabled }: FeatureItemProps) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${enabled ? 'bg-surface-800' : 'bg-surface-800/50 opacity-60'}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${enabled ? 'bg-primary-500/20 text-primary-400' : 'bg-surface-700 text-surface-500'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-sm text-white font-medium">{title}</p>
        <p className="text-xs text-surface-400 mt-0.5">{description}</p>
      </div>
      {enabled && (
        <Check className="w-4 h-4 text-green-400 ml-auto flex-shrink-0" />
      )}
    </div>
  );
}

interface PreferenceToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function PreferenceToggle({ label, description, checked, onChange }: PreferenceToggleProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-surface-800 rounded-lg">
      <div>
        <p className="text-sm text-white font-medium">{label}</p>
        <p className="text-xs text-surface-400 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-primary-500' : 'bg-surface-600'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  );
}

// Button to open AI settings
export function AISettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary-500/50 bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors"
    >
      <Sparkles className="w-4 h-4" />
      <span className="text-sm">AI Assistant</span>
    </button>
  );
}

// Initialize AI preferences from localStorage
export function initializeAIConfig() {
  try {
    const stored = localStorage.getItem('permstack_ai_preferences');
    if (stored) {
      // Preferences loaded - could be used elsewhere
      JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load AI preferences:', error);
  }
}
