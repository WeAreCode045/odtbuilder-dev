import React, { useState } from 'react';
import { PlaceholderItem } from './placeholdersData';

type Props = {
  title: string;
  items: PlaceholderItem[];
  onSelect?: (code: string) => void;
};

const PlaceholderDropdown: React.FC<Props> = ({ title, items, onSelect }) => {
  const [copied, setCopied] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) return;
    if (onSelect) onSelect(val);
    // Try to copy to clipboard for convenience and show hint
    try {
      if (navigator && navigator.clipboard) {
        await navigator.clipboard.writeText(val);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }
    } catch (err) {
      // ignore clipboard errors
    }
  };

  return (
    <div className="mb-4 relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{title}</label>
      <select onChange={handleChange} className="w-full border rounded p-2" defaultValue="">
        <option value="">-- Kies placeholder --</option>
        {items.map((it, idx) => (
          <option key={idx} value={it.code}>{it.code}{it.desc ? ` — ${it.desc}` : ''}</option>
        ))}
      </select>
      {copied && (
        <div className="absolute right-2 top-0 mt-8 bg-black text-white text-xs px-2 py-1 rounded">Gekopieerd</div>
      )}
    </div>
  );
};

export default PlaceholderDropdown;
