import { Card } from './ui';
import { serverTypes, GAMEMODE_INFO } from '../data';
import type { ServerType, Gamemode } from '../data';

interface ServerTypeSelectorProps {
  value: ServerType | null;
  gamemode: Gamemode;
  onChange: (value: ServerType) => void;
  onGamemodeChange: (gamemode: Gamemode) => void;
}

// Map server types to default gamemodes
const serverTypeToGamemode: Record<ServerType, Gamemode> = {
  survival: 'survival',
  factions: 'factions',
  skyblock: 'skyblock',
  prison: 'skyblock', // Prison often uses similar plugins to skyblock
  minigames: 'minigames',
  creative: 'survival',
  custom: 'all',
};

export function ServerTypeSelector({ value, gamemode, onChange, onGamemodeChange }: ServerTypeSelectorProps) {
  const handleServerTypeChange = (type: ServerType) => {
    onChange(type);
    // Auto-select corresponding gamemode
    onGamemodeChange(serverTypeToGamemode[type]);
  };

  return (
    <div className="space-y-8">
      {/* Server Type Selection */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Select Server Type</h2>
          <p className="text-surface-400">
            Choose the type of server you're setting up. This helps us recommend the right permissions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {serverTypes.map((type) => (
            <Card
              key={type.id}
              selected={value === type.id}
              hoverable
              onClick={() => handleServerTypeChange(type.id)}
              className="flex flex-col items-center text-center p-6"
            >
              <span className="text-4xl mb-3">{type.icon}</span>
              <h3 className="font-semibold text-white mb-1">{type.name}</h3>
              <p className="text-sm text-surface-400">{type.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Gamemode Filter Selection */}
      {value && (
        <div className="space-y-4 pt-4 border-t border-surface-800">
          <div>
            <h3 className="text-lg font-medium text-white mb-1">Plugin Filter</h3>
            <p className="text-surface-400 text-sm">
              Filter plugins by gamemode to see the most relevant options first.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.entries(GAMEMODE_INFO) as [Gamemode, { name: string; description: string }][]).map(([id, info]) => (
              <button
                key={id}
                onClick={() => onGamemodeChange(id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  gamemode === id
                    ? 'bg-primary-500 text-white'
                    : 'bg-surface-800 text-surface-400 hover:text-white hover:bg-surface-700'
                }`}
              >
                {info.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
