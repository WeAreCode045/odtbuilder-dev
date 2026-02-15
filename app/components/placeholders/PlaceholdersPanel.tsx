import React from 'react';
import PLACEHOLDER_GROUPS from './placeholdersData';
import { usePlaceholderUI } from './placeholderContext';

type Props = {
  onInsert?: (code: string) => void;
};

const PlaceholdersPanel: React.FC<Props> = ({ onInsert }) => {
  const { activeGroup } = usePlaceholderUI();

  if (!activeGroup) {
    return (
      <div className="p-4 bg-white rounded shadow max-h-[70vh] overflow-auto">
        <h3 className="text-lg font-semibold mb-3">Placeholders</h3>
        <div className="text-sm text-gray-500">Selecteer een placeholder categorie in de Toolbox om te beginnen.</div>
      </div>
    );
  }

  const group = (PLACEHOLDER_GROUPS as any)[activeGroup];

  return (
    <div className="p-4 bg-white rounded shadow max-h-[70vh] overflow-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{group.title}</h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {group.items.map((it: any, idx: number) => (
          <div
            key={idx}
            className="p-2 border border-gray-200 rounded-sm bg-white text-xs cursor-pointer hover:shadow-sm"
            onClick={() => {
              const code = it.code;
              const inserter = (window as any).__odtInsertPlaceholder;
              if (onInsert) return onInsert(code);
              if (inserter && typeof inserter === 'function') return inserter(code);
              if (navigator && navigator.clipboard) navigator.clipboard.writeText(code).catch(() => {});
              alert('Placeholder gekopieerd naar klembord');
            }}
          >
            <div className="truncate">{it.code}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaceholdersPanel;
