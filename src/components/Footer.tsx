import { Logo } from './Logo';

interface FooterProps {
  onNavigate?: (page: 'terms' | 'privacy' | 'acceptable-use') => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-surface-800 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Logo size="sm" />
            <p className="text-surface-500 text-sm">
              Simplifying Minecraft server permission management for server owners worldwide.
            </p>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate?.('terms')}
                  className="text-surface-400 hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('privacy')}
                  className="text-surface-400 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('acceptable-use')}
                  className="text-surface-400 hover:text-white transition-colors text-sm"
                >
                  Acceptable Use Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://luckperms.net/wiki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-surface-400 hover:text-white transition-colors text-sm"
                >
                  LuckPerms Wiki
                </a>
              </li>
              <li>
                <a
                  href="https://www.spigotmc.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-surface-400 hover:text-white transition-colors text-sm"
                >
                  SpigotMC
                </a>
              </li>
              <li>
                <a
                  href="https://papermc.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-surface-400 hover:text-white transition-colors text-sm"
                >
                  PaperMC
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-surface-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-surface-600 text-sm">
              © {currentYear} PermStack. All rights reserved.
            </p>
            <p className="text-surface-600 text-xs">
              Not affiliated with Mojang Studios or Microsoft.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
