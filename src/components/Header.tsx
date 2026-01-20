import { useState } from 'react';
import { Layers } from 'lucide-react';
import { AISettings, AISettingsButton } from './AISettings';

export function Header() {
  const [showAISettings, setShowAISettings] = useState(false);

  return (
    <>
      <header className="border-b border-surface-800 bg-surface-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PermStack</span>
            </div>
            <nav className="flex items-center gap-4">
              <AISettingsButton onClick={() => setShowAISettings(true)} />
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-surface-400 hover:text-white transition-colors text-sm"
              >
                GitHub
              </a>
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-surface-400 hover:text-white transition-colors text-sm"
              >
                Discord
              </a>
            </nav>
          </div>
        </div>
      </header>

      <AISettings isOpen={showAISettings} onClose={() => setShowAISettings(false)} />
    </>
  );
}
