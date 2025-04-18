import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllNotes, Note, exportNotes, importNotes } from '../services/notes';
import { MODULES } from '../types';

const AllNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filter, setFilter] = useState<string>('all');
  
  useEffect(() => {
    loadNotes();
  }, []);
  
  const loadNotes = () => {
    const allNotes = getAllNotes();
    setNotes(allNotes);
  };
  
  const handleExportNotes = () => {
    const jsonData = exportNotes();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bootcamp_notes_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleImportNotes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importNotes(content);
      
      if (success) {
        alert('Notes imported successfully!');
        loadNotes();
      } else {
        alert('Failed to import notes. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    e.target.value = '';
  };
  
  // Filter notes based on selected module
  const filteredNotes = filter === 'all' 
    ? notes 
    : notes.filter(note => note.moduleId === filter);
    
  // Group notes by module
  const notesByModule = filteredNotes.reduce((acc, note) => {
    if (!acc[note.moduleId]) {
      acc[note.moduleId] = [];
    }
    acc[note.moduleId].push(note);
    return acc;
  }, {} as Record<string, Note[]>);
  
  // Format the preview text
  const formatPreview = (content: string, maxLength = 100) => {
    if (!content.trim()) return 'No content';
    return content.trim().length > maxLength 
      ? `${content.trim().substring(0, maxLength)}...` 
      : content.trim();
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All My Notes</h1>
          <p className="text-gray-600 mt-1">
            Browse and manage all your class notes
          </p>
        </div>
        
        <div className="flex mt-4 md:mt-0 space-x-4">
          <button
            onClick={handleExportNotes}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            disabled={notes.length === 0}
          >
            Export All Notes
          </button>
          
          <label
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            Import Notes
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportNotes}
            />
          </label>
        </div>
      </div>
      
      {/* Module filter */}
      <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
        <label htmlFor="module-filter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Module:
        </label>
        <select
          id="module-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="all">All Modules</option>
          {MODULES.map((module) => (
            <option key={module.id} value={module.id}>
              {module.title}
            </option>
          ))}
        </select>
      </div>
      
      {Object.entries(notesByModule).length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-6 text-center">
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'You haven\'t created any notes yet.'
              : 'No notes found for this module.'
            }
          </p>
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">
            Go to lectures
          </Link>
        </div>
      ) : (
        Object.entries(notesByModule).map(([moduleId, moduleNotes]) => {
          const module = MODULES.find(m => m.id === moduleId);
          
          return (
            <div key={moduleId} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {module?.title || 'Unknown Module'}
              </h2>
              
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {moduleNotes.map(note => {
                    // Find the lecture this note belongs to
                    return (
                      <li key={note.id} className="p-4 hover:bg-gray-50">
                        <Link to={`/lecture/${note.lectureId}`} className="block">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">
                                Updated: {new Date(note.updatedAt).toLocaleDateString()}
                              </p>
                              <p className="mt-1 text-gray-900">
                                {formatPreview(note.content)}
                              </p>
                            </div>
                            <div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {note.content.trim().split(/\s+/).length} words
                              </span>
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AllNotes;