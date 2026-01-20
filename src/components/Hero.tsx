import { ArrowRight, Sparkles, Shield, Zap, Layers, Check, Terminal, Users, Clock } from 'lucide-react';
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
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Hero Content */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column - Text */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-800/80 border border-surface-700 text-sm mb-8">
                <Sparkles className="w-4 h-4 text-primary-400" />
                <span className="text-surface-300">AI-Powered Permission Generator</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Minecraft permissions,{' '}
                <span className="relative">
                  <span className="text-gradient">done right</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 4 100 2 150 6C200 10 250 4 298 8" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="300" y2="0">
                        <stop stopColor="#6366f1" />
                        <stop offset="1" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-surface-400 mb-8 max-w-xl mx-auto lg:mx-0">
                Stop copying permissions from outdated forum posts. Generate production-ready
                LuckPerms configs with AI-powered plugin detection in under 60 seconds.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Button size="lg" onClick={onStart} className="group">
                  Start Building Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="secondary" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                  See How It Works
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 justify-center lg:justify-start text-sm text-surface-500">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>No account required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>100% free</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Export instantly</span>
                </div>
              </div>
            </div>

            {/* Right Column - Visual Preview */}
            <div className="relative">
              {/* Floating cards effect */}
              <div className="relative">
                {/* Main preview card */}
                <div className="bg-surface-900/90 backdrop-blur-sm border border-surface-800 rounded-2xl shadow-2xl overflow-hidden">
                  {/* Terminal header */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-surface-800/50 border-b border-surface-700">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-surface-500 ml-2">luckperms/groups.yml</span>
                  </div>

                  {/* Code preview */}
                  <div className="p-4 font-mono text-sm">
                    <div className="text-surface-500"># Generated by PermStack</div>
                    <div className="mt-2">
                      <span className="text-purple-400">vip</span>
                      <span className="text-surface-500">:</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-blue-400">permissions</span>
                      <span className="text-surface-500">:</span>
                    </div>
                    <div className="pl-8 text-green-400">- essentials.back</div>
                    <div className="pl-8 text-green-400">- essentials.sethome.multiple.2</div>
                    <div className="pl-8 text-green-400">- essentials.nick</div>
                    <div className="pl-4 mt-1">
                      <span className="text-blue-400">parents</span>
                      <span className="text-surface-500">:</span>
                    </div>
                    <div className="pl-8 text-yellow-400">- default</div>
                    <div className="mt-3">
                      <span className="text-purple-400">mvp</span>
                      <span className="text-surface-500">:</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-blue-400">permissions</span>
                      <span className="text-surface-500">:</span>
                    </div>
                    <div className="pl-8 text-green-400">- essentials.fly</div>
                    <div className="pl-8 text-green-400">- essentials.heal</div>
                    <div className="pl-8 text-surface-600">...</div>
                  </div>
                </div>

                {/* Floating badge 1 */}
                <div className="absolute -top-4 -right-4 bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-xs text-surface-500">Risk Level</div>
                      <div className="text-sm font-semibold text-white">Safe Config</div>
                    </div>
                  </div>
                </div>

                {/* Floating badge 2 */}
                <div className="absolute -bottom-4 -left-4 bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <div className="text-xs text-surface-500">Plugins Detected</div>
                      <div className="text-sm font-semibold text-white">12 Active</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 border-y border-surface-800 bg-surface-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '100+', label: 'Plugin Permissions', icon: Layers },
              { value: '10+', label: 'Rank Templates', icon: Users },
              { value: '<60s', label: 'Setup Time', icon: Clock },
              { value: 'Free', label: 'Forever', icon: Sparkles },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-surface-800 rounded-xl mb-4">
                  <stat.icon className="w-6 h-6 text-primary-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-surface-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to manage permissions
            </h2>
            <p className="text-lg text-surface-400 max-w-2xl mx-auto">
              From simple survival servers to complex network setups, PermStack handles it all.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'AI-Powered Detection',
                description: 'Our AI recognizes plugins and generates accurate permission nodes automatically.',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: Shield,
                title: 'Risk Assessment',
                description: 'Every permission is analyzed for potential security risks before you deploy.',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: Layers,
                title: 'Smart Inheritance',
                description: 'Automatic rank hierarchy with proper permission inheritance built-in.',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Terminal,
                title: 'Multiple Formats',
                description: 'Export as YAML, JSON, or direct LuckPerms commands ready to paste.',
                color: 'from-orange-500 to-amber-500',
              },
              {
                icon: Zap,
                title: 'Instant Generation',
                description: 'Generate complete permission setups in seconds, not hours.',
                color: 'from-primary-500 to-violet-500',
              },
              {
                icon: Users,
                title: 'Rank Templates',
                description: 'Start with proven templates for donors, staff, or custom hierarchies.',
                color: 'from-rose-500 to-red-500',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-surface-900/50 border border-surface-800 rounded-2xl p-6 hover:border-surface-700 transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-surface-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - Redesigned */}
      <section className="relative py-24 bg-surface-900/50 border-y border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Three steps to perfect permissions
            </h2>
            <p className="text-lg text-surface-400">
              No more guessing. No more broken configs.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '01',
                title: 'Choose Your Setup',
                description: 'Select your server type and the plugins you use. We support 100+ popular plugins out of the box.',
                visual: (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {['Survival', 'Factions', 'Skyblock', 'Prison'].map((type) => (
                      <span key={type} className="px-3 py-1 bg-surface-800 rounded-lg text-sm text-surface-300">
                        {type}
                      </span>
                    ))}
                  </div>
                ),
              },
              {
                step: '02',
                title: 'Define Your Ranks',
                description: 'Start with a template or build custom ranks. Describe what each rank should do and AI handles the rest.',
                visual: (
                  <div className="flex flex-col gap-2 mt-4">
                    {['Owner', 'Admin', 'MVP', 'VIP', 'Default'].map((rank, i) => (
                      <div key={rank} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-red-500' : i === 1 ? 'bg-orange-500' : i === 2 ? 'bg-purple-500' : i === 3 ? 'bg-blue-500' : 'bg-surface-600'}`} />
                        <span className="text-sm text-surface-400">{rank}</span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                step: '03',
                title: 'Export & Deploy',
                description: 'Download your configuration files or copy commands directly. Drop into your server and you\'re done.',
                visual: (
                  <div className="flex gap-2 mt-4">
                    {['YAML', 'JSON', 'Commands'].map((format) => (
                      <span key={format} className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-lg text-sm font-medium">
                        {format}
                      </span>
                    ))}
                  </div>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-surface-800 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-surface-400">{item.description}</p>
                {item.visual}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Button size="lg" onClick={onStart} className="group">
              Start Building Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-primary-500/20 blur-3xl" />

            <div className="relative bg-surface-900/80 backdrop-blur-sm border border-surface-800 rounded-3xl p-8 lg:p-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to build your permission system?
              </h2>
              <p className="text-lg text-surface-400 mb-8 max-w-2xl mx-auto">
                Join thousands of server owners who stopped wasting time on permissions
                and started focusing on what matters - their community.
              </p>
              <Button size="lg" onClick={onStart} className="group">
                Get Started - It's Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
