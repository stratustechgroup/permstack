import { ArrowRight, Sparkles, Shield, Zap, Layers, Terminal, ChevronRight } from 'lucide-react';
import { Button } from './ui';

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Hero Content */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-800/80 border border-surface-700 text-sm mb-8">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-surface-300">AI-Powered Permission Generator</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Minecraft permissions,{' '}
            <span className="text-gradient">done right</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-surface-400 mb-10 max-w-2xl mx-auto">
            Stop copying permissions from outdated forum posts. Generate production-ready
            LuckPerms configs with AI-powered plugin detection in seconds.
          </p>

          {/* CTA Button */}
          <Button size="lg" onClick={onStart} className="inline-flex items-center gap-2">
            <span>Start Building</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-20 border-t border-surface-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'AI-Powered Detection',
                description: 'Our AI recognizes plugins and generates accurate permission nodes automatically.',
              },
              {
                icon: Shield,
                title: 'Risk Assessment',
                description: 'Every permission is analyzed for potential security risks before you deploy.',
              },
              {
                icon: Layers,
                title: 'Smart Inheritance',
                description: 'Automatic rank hierarchy with proper permission inheritance built-in.',
              },
              {
                icon: Terminal,
                title: 'Multiple Formats',
                description: 'Export as YAML, JSON, or direct LuckPerms commands ready to paste.',
              },
              {
                icon: Zap,
                title: 'Instant Generation',
                description: 'Generate complete permission setups in seconds, not hours.',
              },
              {
                icon: Shield,
                title: 'Rank Templates',
                description: 'Start with proven templates for donors, staff, or custom hierarchies.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group bg-surface-900/50 border border-surface-800 rounded-xl p-5 hover:border-surface-700 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-20 border-t border-surface-800/50 bg-surface-900/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
            Three steps to perfect permissions
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Select Plugins',
                description: 'Choose from 100+ supported plugins or add your own.',
              },
              {
                step: '2',
                title: 'Define Ranks',
                description: 'Use templates or describe what each rank should do.',
              },
              {
                step: '3',
                title: 'Export & Deploy',
                description: 'Download configs or copy commands. Done.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-surface-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
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
