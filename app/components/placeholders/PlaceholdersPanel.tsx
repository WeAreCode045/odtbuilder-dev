import React, { useState } from 'react';
import PLACEHOLDER_GROUPS from './placeholdersData';

type Props = {
  onInsert?: (code: string) => void;
};

const PlaceholdersPanel: React.FC<Props> = ({ onInsert }) => {
  const [active, setActive] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleInsert = async (code: string) => {
    if (onInsert) onInsert(code);
    try {
      if (navigator && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      }
    } catch {}
    setCopied(code);
    setTimeout(() => setCopied(null), 1400);
  };

  return (
    <div className="p-3 bg-white rounded shadow max-h-[70vh] overflow-auto">
      <h3 className="text-lg font-semibold mb-3">Placeholders</h3>

      <div className="grid grid-cols-2 gap-2">
        {Object.keys(PLACEHOLDER_GROUPS).map((key) => (
          <button
            key={key}
            onClick={() => setActive(active === key ? null : key)}
            className={`text-sm p-3 rounded border transition-all text-left shadow-sm ${active === key ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:border-blue-300'}`}
          >
            <div className="font-medium text-gray-800">{PLACEHOLDER_GROUPS[key].title}</div>
            <div className="text-xs text-gray-500 mt-1">{PLACEHOLDER_GROUPS[key].items.length} placeholders</div>
          </button>
        ))}
      </div>

      {active && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold">{PLACEHOLDER_GROUPS[active].title}</h4>
            <button className="text-xs text-blue-600" onClick={() => setActive(null)}>Sluit</button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {PLACEHOLDER_GROUPS[active].items.map((it, idx) => (
              <button
                key={idx}
                onClick={() => handleInsert(it.code)}
                className="text-xs p-2 border rounded text-left hover:bg-gray-50"
                title={it.desc || it.code}
              >
                <div className="truncate">{it.code}</div>
                {copied === it.code && <div className="text-[10px] text-green-600 mt-1">Gekopieerd</div>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceholdersPanel;
