interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
  lg: 'w-12 h-12',
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
};

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      <div className="relative">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-primary-500/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Logo SVG */}
        <div className={`relative ${sizeClasses[size]}`}>
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                <stop offset="50%" stopColor="white" stopOpacity="0.1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                <feOffset in="blur" dx="0" dy="2" result="offsetBlur" />
                <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
              </filter>
            </defs>

            {/* Background rounded square */}
            <rect
              x="2"
              y="2"
              width="44"
              height="44"
              rx="12"
              fill="url(#logoGradient)"
            />

            {/* Shine overlay */}
            <rect
              x="2"
              y="2"
              width="44"
              height="22"
              rx="12"
              fill="url(#shineGradient)"
            />

            {/* Stacked layers - representing permission hierarchy */}
            {/* Bottom layer (largest) */}
            <path
              d="M12 32 L24 38 L36 32 L36 28 L24 34 L12 28 Z"
              fill="white"
              fillOpacity="0.6"
            />

            {/* Middle layer */}
            <path
              d="M12 26 L24 32 L36 26 L36 22 L24 28 L12 22 Z"
              fill="white"
              fillOpacity="0.8"
            />

            {/* Top layer (smallest, most prominent) */}
            <path
              d="M12 20 L24 26 L36 20 L36 16 L24 22 L12 16 Z"
              fill="white"
              fillOpacity="1"
            />

            {/* Shield/lock icon at top - representing security */}
            <path
              d="M24 10 L18 13 L18 17 C18 20.5 20.5 23.5 24 25 C27.5 23.5 30 20.5 30 17 L30 13 Z"
              fill="white"
              fillOpacity="0.95"
            />

            {/* Checkmark inside shield */}
            <path
              d="M21 16.5 L23 18.5 L27 14.5"
              stroke="url(#logoGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {showText && (
        <span className={`${textSizeClasses[size]} font-bold text-white`}>
          Perm<span className="text-primary-400">Stack</span>
        </span>
      )}
    </div>
  );
}

// Standalone icon component for favicons, etc.
export function LogoIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradientStandalone" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>

      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="12"
        fill="url(#logoGradientStandalone)"
      />

      {/* Stacked layers */}
      <path
        d="M12 32 L24 38 L36 32 L36 28 L24 34 L12 28 Z"
        fill="white"
        fillOpacity="0.6"
      />
      <path
        d="M12 26 L24 32 L36 26 L36 22 L24 28 L12 22 Z"
        fill="white"
        fillOpacity="0.8"
      />
      <path
        d="M12 20 L24 26 L36 20 L36 16 L24 22 L12 16 Z"
        fill="white"
        fillOpacity="1"
      />

      {/* Shield with checkmark */}
      <path
        d="M24 10 L18 13 L18 17 C18 20.5 20.5 23.5 24 25 C27.5 23.5 30 20.5 30 17 L30 13 Z"
        fill="white"
        fillOpacity="0.95"
      />
      <path
        d="M21 16.5 L23 18.5 L27 14.5"
        stroke="url(#logoGradientStandalone)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
