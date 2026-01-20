import { Card } from './ui';
import { serverTypes } from '../data';
import type { ServerType } from '../data';

interface ServerTypeSelectorProps {
  value: ServerType | null;
  onChange: (value: ServerType) => void;
}

export function ServerTypeSelector({ value, onChange }: ServerTypeSelectorProps) {
  return (
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
            onClick={() => onChange(type.id)}
            className="flex flex-col items-center text-center p-6"
          >
            <span className="text-4xl mb-3">{type.icon}</span>
            <h3 className="font-semibold text-white mb-1">{type.name}</h3>
            <p className="text-sm text-surface-400">{type.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
