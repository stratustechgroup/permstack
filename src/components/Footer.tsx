import { Layers } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-surface-800 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="text-surface-400">
              Made for server owners, by server owners
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-surface-500">
            <a href="https://github.com" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="https://discord.gg" className="hover:text-white transition-colors">
              Discord
            </a>
            <span>© {new Date().getFullYear()} PermStack</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
