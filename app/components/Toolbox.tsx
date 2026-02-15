import React from 'react';
import { useEditor } from '@craftjs/core';
import { Tag, LayoutTemplate } from 'lucide-react';
import { Placeholder } from './user/Placeholder';

export const Toolbox: React.FC = () => {
  const { connectors } = useEditor();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-10">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Componenten</h2>
      </div>
      
      <div className="p-4 flex flex-col gap-3 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-400 mt-2 mb-1">Componenten</div>

        <div
          ref={(ref) => {
            if (ref) connectors.create(ref, <Placeholder text="${guest.firstName} ${guest.lastName}" fontSize={14} color="#4a5568" textAlign="left" fontFamily="inherit" fontWeight="normal" />);
          }}
          className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:border-blue-500 hover:shadow-sm transition-all"
        >
          <Tag size={18} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Placeholder</span>
        </div>
      </div>

      <div className="mt-auto p-4 bg-blue-50 border-t border-blue-100">
        <div className="flex items-start gap-3">
            <LayoutTemplate size={18} className="text-blue-600 mt-0.5" />
            <div>
                <p className="text-xs font-semibold text-blue-800">Layout Beheer</p>
                <p className="text-xs text-blue-600 mt-1">
                    Sleep een Sectie. Klik erop en gebruik het instellingenpaneel rechts om kolommen (1-4) en verhoudingen te kiezen.
                </p>
            </div>
        </div>
      </div>
    </aside>
  );
};