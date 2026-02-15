import React from 'react';
import { PlaceholderItem } from './placeholdersData';

type Props = {
  title: string;
  items: PlaceholderItem[];
  onSelect?: (code: string) => void;
};

const PlaceholderDropdown: React.FC<Props> = ({ title, items, onSelect }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) return;
    if (onSelect) onSelect(val);
    // Try to copy to clipboard for convenience
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(val).catch(() => {});
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{title}</label>
      <select onChange={handleChange} className="w-full border rounded p-2" defaultValue="">
        <option value="">-- Kies placeholder --</option>
        {items.map((it, idx) => (
          <option key={idx} value={it.code}>{it.code}{it.desc ? ` — ${it.desc}` : ''}</option>
        ))}
      </select>
    </div>
  );
};

export default PlaceholderDropdown;
