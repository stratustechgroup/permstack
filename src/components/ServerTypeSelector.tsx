import { Upload } from 'lucide-react';
import { Card, Button } from './ui';
import { serverTypes } from '../data';
import type { ServerType, Gamemode } from '../data';

interface ServerTypeSelectorProps {
  value: ServerType | null;
  onChange: (value: ServerType) => void;
  onGamemodeChange: (gamemode: Gamemode) => void;
  onImportClick: () => void;
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

export function ServerTypeSelector({ value, onChange, onGamemodeChange, onImportClick }: ServerTypeSelectorProps) {
  const handleServerTypeChange = (type: ServerType) => {
    onChange(type);
    // Auto-select corresponding gamemode
    onGamemodeChange(serverTypeToGamemode[type]);
  };

  return (
    <div className="space-y-6">
      {/* Import Existing Config */}
      <div className="flex items-center justify-between p-4 bg-surface-800/50 border border-surface-700 rounded-xl">
        <div>
          <h3 className="text-white font-medium">Have an existing config?</h3>
          <p className="text-sm text-surface-400">
            Import your LuckPerms, GroupManager, or PermissionsEx config to get started
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={onImportClick}>
          <Upload className="w-4 h-4 mr-2" />
          Import Config
        </Button>
      </div>

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
    </div>
  );
}
