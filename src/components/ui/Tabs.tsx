import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-surface-900 rounded-lg border border-surface-800">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
            {
              'bg-primary-500 text-white': activeTab === tab.id,
              'text-surface-400 hover:text-white hover:bg-surface-800': activeTab !== tab.id,
            }
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
