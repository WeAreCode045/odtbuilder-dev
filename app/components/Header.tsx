import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import { Download, FileText, Save, FolderOpen, Loader2 } from 'lucide-react';
import { DashboardModal } from './DashboardModal';
import { parseOdt } from '../utils/odtImporter';

export const Header: React.FC = () => {
  const { query, actions } = useEditor();
  const [isLoading, setIsLoading] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const BACKEND_URL = "https://odt-generator.code045.nl"; // Backend URL for API calls

  // --- ACTIONS ---

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const json = query.serialize();
      const response = await fetch(`${BACKEND_URL}/generate-odt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          data: typeof json === 'string' ? JSON.parse(json) : json 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Export mislukt");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'document.odt');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Fout bij exporteren:", error);
      alert(`Er is een fout opgetreden: ${error instanceof Error ? error.message : 'Onbekende fout'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProject = async () => {
    const name = prompt("Geef dit project een naam:");
    if (!name) return;

    setIsLoading(true);
    try {
        const json = query.serialize();
        const data = typeof json === 'string' ? JSON.parse(json) : json;
        
        const response = await fetch(`${BACKEND_URL}/save-project`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, data })
        });
        
        if (response.ok) {
            alert("Project opgeslagen!");
        } else {
            throw new Error("Opslaan mislukt");
        }
    } catch (e) {
        alert("Kon project niet opslaan: " + e);
    } finally {
        setIsLoading(false);
    }
  };

  const handleLoadProject = (data: any) => {
      try {
        actions.deserialize(data);
      } catch (e) {
          alert("Fout bij laden van project: " + e);
      }
  };

  const handleLoadImport = async (blob: Blob) => {
      setIsLoading(true);
      try {
          const newNodes = await parseOdt(blob);
          actions.deserialize(newNodes);
      } catch (e) {
          console.error(e);
          alert("Fout bij verwerken van ODT: " + (e instanceof Error ? e.message : 'Onbekende fout'));
      } finally {
          setIsLoading(false);
      }
  };

  const handleNewProject = () => {
      // Basic reset by clearing nodes. 
      // Craft.js doesn't have a simple "clear all" that resets to default text easily without a refresh or explicit re-render.
      // But we can just deserialize a clean state if we had one.
      // For now, reload the page is the cleanest "New Project" if we don't track a default state.
      if (confirm("Wil je een nieuw leeg project starten? Niet-opgeslagen wijzigingen gaan verloren.")) {
          window.location.reload(); 
      }
  };

  return (
    <>
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 shadow-sm">
        <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-md text-white">
            <FileText size={20} />
            </div>
            <h1 className="font-semibold text-gray-800 text-lg">DocuBuild A4</h1>
        </div>
        
        <div className="flex items-center gap-3">
            {isLoading ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-500 rounded-md text-sm font-medium">
                <Loader2 size={16} className="animate-spin" />
                Verwerken...
            </div>
            ) : (
            <>
                <button 
                    onClick={() => setIsDashboardOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                    <FolderOpen size={16} />
                    Project / Nieuw
                </button>

                <button 
                    onClick={handleSaveProject}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                    <Save size={16} />
                    Opslaan
                </button>

                <button 
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                    <Download size={16} />
                    Exporteer ODT
                </button>
            </>
            )}
        </div>
        </header>

        <DashboardModal 
            isOpen={isDashboardOpen}
            onClose={() => setIsDashboardOpen(false)}
            onLoadProject={handleLoadProject}
            onLoadImport={handleLoadImport}
            onNewProject={handleNewProject}
        />
    </>
  );
};