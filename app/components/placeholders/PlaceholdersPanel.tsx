import React from 'react';
import PlaceholderDropdown from './PlaceholderDropdown';
import PLACEHOLDER_GROUPS from './placeholdersData';

type Props = {
  onInsert?: (code: string) => void;
};

const PlaceholdersPanel: React.FC<Props> = ({ onInsert }) => {
  return (
    <div className="p-4 bg-white rounded shadow max-h-[70vh] overflow-auto">
      <h3 className="text-lg font-semibold mb-3">Placeholders</h3>
      {Object.keys(PLACEHOLDER_GROUPS).map((key) => (
        <PlaceholderDropdown
          key={key}
          title={PLACEHOLDER_GROUPS[key].title}
          items={PLACEHOLDER_GROUPS[key].items}
          onSelect={(code) => onInsert ? onInsert(code) : undefined}
        />
      ))}
    </div>
  );
};

export default PlaceholdersPanel;
