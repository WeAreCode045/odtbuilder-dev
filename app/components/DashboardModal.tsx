import React, { useState, useEffect } from 'react';
import { FolderOpen, FileUp, Trash2, Plus, Layout, Upload } from 'lucide-react';

interface DashboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoadProject: (data: any) => void;
    onLoadImport: (blob: Blob) => void;
    onNewProject: () => void;
}

export const DashboardModal: React.FC<DashboardModalProps> = ({ isOpen, onClose, onLoadProject, onLoadImport, onNewProject }) => {
    const [activeTab, setActiveTab] = useState<'projects' | 'imports'>('projects');
    const [projects, setProjects] = useState<string[]>([]);
    const [imports, setImports] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const BACKEND_URL = "https://odt-generator.code045.nl";

    useEffect(() => {
        if (isOpen) {
            fetchLists();
        }
    }, [isOpen]);

    const fetchLists = async () => {
        setIsLoading(true);
        try {
            const projRes = await fetch(`${BACKEND_URL}/projects`);
            const projData = await projRes.json();
            setProjects(projData);

            const impRes = await fetch(`${BACKEND_URL}/imports`);
            const impData = await impRes.json();
            setImports(impData);
        } catch (e) {
            console.error("Failed to fetch lists", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProject = async (name: string) => {
        if (!confirm(`Wil je project "${name}" verwijderen?`)) return;
        await fetch(`${BACKEND_URL}/projects/${name}`, { method: 'DELETE' });
        fetchLists();
    };

    const handleDeleteImport = async (name: string) => {
        if (!confirm(`Wil je import "${name}" verwijderen?`)) return;
        await fetch(`${BACKEND_URL}/imports/${name}`, { method: 'DELETE' });
        fetchLists();
    };

    const handleLoadProject = async (name: string) => {
        const res = await fetch(`${BACKEND_URL}/projects/${name}`);
        if (res.ok) {
            const data = await res.json();
            onLoadProject(data);
            onClose();
        }
    };

    const handleLoadImport = async (name: string) => {
        const res = await fetch(`${BACKEND_URL}/imports/${name}`);
        if (res.ok) {
            const blob = await res.blob();
            onLoadImport(blob);
            onClose();
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${BACKEND_URL}/upload-odt`, {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                fetchLists();
                setActiveTab('imports');
            } else {
                alert("Upload mislukt");
            }
        } catch (e) {
            console.error(e);
            alert("Fout bij uploaden");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[500px] flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-800">Project Beheer</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Sluiten</button>
                </div>

                <div className="flex border-b border-gray-200">
                    <button 
                        onClick={() => setActiveTab('projects')}
                        className={`flex-1 py-3 text-sm font-medium ${activeTab === 'projects' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 bg-gray-50'}`}
                    >
                        Opgeslagen Projecten
                    </button>
                    <button 
                        onClick={() => setActiveTab('imports')}
                        className={`flex-1 py-3 text-sm font-medium ${activeTab === 'imports' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 bg-gray-50'}`}
                    >
                        Geïmporteerde Bestanden
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                    {isLoading ? (
                        <div className="flex justify-center py-10 text-gray-400">Laden...</div>
                    ) : (
                        <>
                            {activeTab === 'projects' && (
                                <div className="space-y-4">
                                    <button 
                                        onClick={() => { onNewProject(); onClose(); }}
                                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all mb-6 group"
                                    >
                                        <Plus size={24} className="mb-2 group-hover:scale-110 transition-transform"/>
                                        <span className="font-medium">Nieuw Leeg Project Starten</span>
                                    </button>

                                    {projects.length === 0 ? (
                                        <p className="text-center text-gray-400">Geen opgeslagen projecten.</p>
                                    ) : (
                                        <div className="grid gap-3">
                                            {projects.map(name => (
                                                <div key={name} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-100 text-blue-600 rounded">
                                                            <Layout size={20} />
                                                        </div>
                                                        <span className="font-medium text-gray-700">{name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => handleLoadProject(name)}
                                                            className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
                                                        >
                                                            Laden
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteProject(name)}
                                                            className="p-1.5 text-gray-400 hover:text-red-500"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'imports' && (
                                <div className="space-y-4">
                                    <label className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all mb-6 cursor-pointer group">
                                        <Upload size={24} className="mb-2 group-hover:scale-110 transition-transform"/>
                                        <span className="font-medium">Nieuwe ODT Uploaden & Opslaan</span>
                                        <input type="file" accept=".odt" className="hidden" onChange={handleFileUpload} />
                                    </label>

                                    {imports.length === 0 ? (
                                        <p className="text-center text-gray-400">Geen geïmporteerde bestanden.</p>
                                    ) : (
                                        <div className="grid gap-3">
                                            {imports.map(name => (
                                                <div key={name} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-purple-100 text-purple-600 rounded">
                                                            <FileUp size={20} />
                                                        </div>
                                                        <span className="font-medium text-gray-700 break-all">{name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => handleLoadImport(name)}
                                                            className="px-3 py-1.5 text-xs font-medium bg-purple-600 text-white rounded hover:bg-purple-700"
                                                        >
                                                            Gebruiken
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteImport(name)}
                                                            className="p-1.5 text-gray-400 hover:text-red-500"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};