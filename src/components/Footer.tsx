import { Logo } from './Logo';

interface FooterProps {
  onNavigate?: (page: 'terms' | 'privacy' | 'acceptable-use') => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-surface-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <Logo size="sm" />
              <p className="text-surface-500 text-sm text-center md:text-left max-w-xs">
                The easiest way to generate Minecraft server permissions.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-8 gap-y-3">
              <button
                onClick={() => onNavigate?.('terms')}
                className="text-surface-400 hover:text-white transition-colors text-sm"
              >
                Terms of Service
              </button>
              <button
                onClick={() => onNavigate?.('privacy')}
                className="text-surface-400 hover:text-white transition-colors text-sm"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => onNavigate?.('acceptable-use')}
                className="text-surface-400 hover:text-white transition-colors text-sm"
              >
                Acceptable Use
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-surface-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-surface-600 text-sm">
              © {currentYear} PermStack. All rights reserved.
            </p>
            <p className="text-surface-700 text-xs">
              Not affiliated with Mojang Studios or Microsoft.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
