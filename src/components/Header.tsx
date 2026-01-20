import { useState } from 'react';
import { Layers, Github, MessageCircle, ExternalLink } from 'lucide-react';
import { AISettings, AISettingsButton } from './AISettings';

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
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                  <Layers className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold text-white">
                Perm<span className="text-primary-400">Stack</span>
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <a
                href="#features"
                className="px-4 py-2 text-surface-400 hover:text-white hover:bg-surface-800/50 rounded-lg transition-all text-sm font-medium"
              >
                Features
              </a>
              <a
                href="https://luckperms.net"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-surface-400 hover:text-white hover:bg-surface-800/50 rounded-lg transition-all text-sm font-medium inline-flex items-center gap-1.5"
              >
                LuckPerms
                <ExternalLink className="w-3 h-3" />
              </a>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <AISettingsButton onClick={() => setShowAISettings(true)} />

              <div className="hidden sm:flex items-center gap-1 border-l border-surface-800 pl-2 ml-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-surface-500 hover:text-white hover:bg-surface-800/50 rounded-lg transition-all"
                  title="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-surface-500 hover:text-white hover:bg-surface-800/50 rounded-lg transition-all"
                  title="Discord"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>

              {onStart && (
                <button
                  onClick={onStart}
                  className="ml-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-primary-500/20"
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
