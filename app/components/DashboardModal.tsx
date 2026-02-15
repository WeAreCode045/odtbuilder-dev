import React, { useState, useEffect } from 'react';
import { FolderOpen, FileUp, Trash2, Plus, Layout, Upload, FileText } from 'lucide-react';

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
    const BACKEND_URL = "http://odt-generator.code045.nl"; 

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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[600px] flex flex-col overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <FolderOpen size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Mijn Documenten</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">Sluiten</button>
                </div>

                <div className="flex border-b border-gray-200 bg-gray-50/50">
                    <button 
                        onClick={() => setActiveTab('projects')}
                        className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${activeTab === 'projects' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                    >
                        <Layout size={18} />
                        Opgeslagen Projecten
                    </button>
                    <button 
                        onClick={() => setActiveTab('imports')}
                        className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${activeTab === 'imports' ? 'text-purple-600 border-b-2 border-purple-600 bg-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                    >
                        <FileUp size={18} />
                        Geïmporteerde ODT's
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'projects' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <button 
                                            onClick={() => { onNewProject(); onClose(); }}
                                            className="p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all group shadow-sm hover:shadow-md"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <Plus size={24} />
                                            </div>
                                            <span className="font-bold text-lg">Leeg Project Starten</span>
                                            <span className="text-sm text-gray-400 mt-1">Begin met een schone lei</span>
                                        </button>

                                        <button 
                                            onClick={() => setActiveTab('imports')}
                                            className="p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50/50 transition-all group shadow-sm hover:shadow-md"
                                        >
                                             <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <FileUp size={24} />
                                            </div>
                                            <span className="font-bold text-lg">Start vanuit Import</span>
                                            <span className="text-sm text-gray-400 mt-1">Gebruik een bestaand bestand</span>
                                        </button>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pl-1">Recent Opgeslagen</h3>
                                        {projects.length === 0 ? (
                                            <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
                                                <p className="text-gray-400 text-sm">Nog geen opgeslagen projecten.</p>
                                            </div>
                                        ) : (
                                            <div className="grid gap-3">
                                                {projects.map(name => (
                                                    <div key={name} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                                <Layout size={20} />
                                                            </div>
                                                            <div>
                                                                <span className="font-semibold text-gray-800 block">{name}</span>
                                                                <span className="text-xs text-gray-400">Laatst bewerkt: Vandaag</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={() => handleLoadProject(name)}
                                                                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                                            >
                                                                Laden
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteProject(name)}
                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                                title="Verwijderen"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'imports' && (
                                <div className="space-y-6">
                                    <label className="w-full py-8 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all cursor-pointer group bg-white">
                                        <div className="w-14 h-14 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-3 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                                            <Upload size={28} />
                                        </div>
                                        <span className="font-bold text-lg">Nieuw Bestand Uploaden</span>
                                        <span className="text-sm text-gray-400 mt-1">Selecteer een .odt bestand</span>
                                        <input type="file" accept=".odt" className="hidden" onChange={handleFileUpload} />
                                    </label>

                                    <div>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pl-1">Beschikbare Imports</h3>
                                        {imports.length === 0 ? (
                                            <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
                                                <p className="text-gray-400 text-sm">Geen geïmporteerde bestanden.</p>
                                            </div>
                                        ) : (
                                            <div className="grid gap-3">
                                                {imports.map(name => (
                                                    <div key={name} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-purple-200 transition-all group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                                                                <FileText size={20} />
                                                            </div>
                                                            <span className="font-semibold text-gray-800">{name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={() => handleLoadImport(name)}
                                                                className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                                                            >
                                                                Gebruiken
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteImport(name)}
                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                                title="Verwijderen"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
