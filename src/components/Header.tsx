import { useState } from 'react';
import { AISettings, AISettingsButton } from './AISettings';
import { Logo } from './Logo';

interface HeaderProps {
  onStart?: () => void;
}

export function Header({ onStart }: HeaderProps) {
  const [showAISettings, setShowAISettings] = useState(false);

  return (
    <>
      <header className="border-b border-surface-800/50 bg-surface-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo />

            {/* Right side */}
            <div className="flex items-center gap-3">
              <AISettingsButton onClick={() => setShowAISettings(true)} />

              {onStart && (
                <button
                  onClick={onStart}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-primary-500/20"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AISettings isOpen={showAISettings} onClose={() => setShowAISettings(false)} />
    </>
  );
}
