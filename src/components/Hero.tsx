import { ArrowDown } from 'lucide-react';
import { Button } from './ui';

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
          Build your server ranks{' '}
          <span className="text-gradient">in 60 seconds</span>
        </h1>
        <p className="text-lg sm:text-xl text-surface-400 mb-8 max-w-2xl mx-auto">
          Stop copying permissions from outdated forum posts. PermStack generates
          best-practice LuckPerms configs for your exact setup.
        </p>
        <Button size="lg" onClick={onStart} className="group">
          Start Building
          <ArrowDown className="w-5 h-5 ml-2 group-hover:translate-y-0.5 transition-transform" />
        </Button>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto mt-20 px-4">
        <h2 className="text-center text-sm font-medium text-surface-500 uppercase tracking-wider mb-8">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Pick server type', desc: 'Survival, Factions, Skyblock...' },
            { step: '2', title: 'Select plugins', desc: 'EssentialsX, WorldGuard, etc.' },
            { step: '3', title: 'Choose ranks', desc: 'Use a preset or customize' },
            { step: '4', title: 'Export & go', desc: 'YAML, commands, or JSON' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
                {item.step}
              </div>
              <h3 className="font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-sm text-surface-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
