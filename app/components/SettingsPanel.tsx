import React from 'react';
import { useEditor } from '@craftjs/core';
import { Settings2 } from 'lucide-react';
import PLACEHOLDER_GROUPS from './placeholders/placeholdersData';
import { usePlaceholderUI } from './placeholders/placeholderContext';
import { Tekst } from './user/Tekst';

export const SettingsPanel: React.FC = () => {
  const { selected, actions, query, connectors } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.displayName,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
    }

    return {
      selected,
      actions: query && query, // passthrough (not used here)
      query,
      connectors: (null as any),
    };
  });

  const { activeGroup, setActiveGroup } = usePlaceholderUI();

  return (
    <aside className="w-72 bg-white border-l border-gray-200 flex flex-col z-10">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Instellingen</h2>
        <Settings2 size={16} className="text-gray-400" />
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {selected ? (
          // If the selected node is the Placeholder component, show placeholder groups
          selected.name === 'Placeholder' ? (
            <PlaceholderArea />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded text-gray-700">
                      {selected.name}
                  </span>
                  {selected.isDeletable && (
                      <button
                          className="text-xs text-red-500 hover:text-red-700 underline"
                          onClick={() => {
                              actions.delete(selected.id);
                          }}
                      >
                          Verwijderen
                      </button>
                  )}
              </div>

              <div className="border-t border-gray-100 my-2"></div>

              {selected.settings && React.createElement(selected.settings)}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-sm text-gray-400">Selecteer een component om de instellingen te bekijken.</p>
          </div>
        )}
      </div>
    </aside>
  );

  function PlaceholderArea() {
    if (!activeGroup) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <p className="text-sm text-gray-400">Klik een placeholder categorie aan in de linkerkolom om de placeholders te bekijken.</p>
        </div>
      );
    }

    const group = (PLACEHOLDER_GROUPS as any)[activeGroup];
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">{group.title}</h3>
          <button className="text-xs text-gray-500" onClick={() => setActiveGroup(null)}>Sluit</button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {group.items.map((it: any, idx: number) => (
            <PlaceholderCard key={idx} code={it.code} />
          ))}
        </div>
      </div>
    );
  }

  function PlaceholderCard({ code }: { code: string }) {
    const { connectors } = useEditor();
    return (
      <div
        ref={(ref) => {
          if (!ref) return;
          // Make card draggable to create a Tekst node prefilled with the placeholder
          connectors.create(ref, <Tekst text={code} fontSize={14} color="#4a5568" textAlign="left" fontFamily="inherit" fontWeight="normal" />);
        }}
        className="p-2 border border-gray-200 rounded-sm bg-white text-xs cursor-grab hover:shadow-sm"
        onClick={() => {
          const inserter = (window as any).__odtInsertPlaceholder;
          if (inserter && typeof inserter === 'function') {
            inserter(code);
          } else {
            if (navigator && navigator.clipboard) navigator.clipboard.writeText(code).catch(() => {});
            alert('Placeholder gekopieerd naar klembord');
          }
        }}
      >
        <div className="truncate">{code}</div>
      </div>
    );
  }
};