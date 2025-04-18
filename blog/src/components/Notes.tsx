import React, { useState, useEffect } from 'react';
import { saveNote, getNote } from '../services/notes';

interface NotesProps {
  moduleId: string;
  lectureId: string;
}

const Notes: React.FC<NotesProps> = ({ moduleId, lectureId }) => {
  const [notes, setNotes] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load saved notes when component mounts
  useEffect(() => {
    const savedNote = getNote(moduleId, lectureId);
    if (savedNote) {
      setNotes(savedNote.content);
      setLastSaved(new Date(savedNote.updatedAt));
    } else {
      setNotes('');
      setLastSaved(null);
    }
  }, [moduleId, lectureId]);

  // Save notes with debounce
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    
    // Save the note
    saveNote(moduleId, lectureId, newNotes);
    setLastSaved(new Date());
  };

  // Format the last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return 'Not saved yet';
    
    return lastSaved.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mt-8 border-t pt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          My Notes {notes.trim() ? `(${notes.trim().split(/\s+/).length} words)` : ''}
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          {isExpanded ? 'Collapse' : 'Expand'} Notes
        </button>
      </div>
      
      <textarea
        className={`w-full p-3 border border-gray-300 rounded-md ${
          isExpanded ? 'min-h-[400px]' : 'min-h-[200px]'
        } focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300`}
        placeholder="Type your class notes here..."
        value={notes}
        onChange={handleNotesChange}
      ></textarea>
      
      <div className="flex justify-between items-center mt-2">
        <p className="text-sm text-gray-500">
          Notes are automatically saved to your browser
        </p>
        {lastSaved && (
          <p className="text-sm text-gray-500">
            Last saved: {formatLastSaved()}
          </p>
        )}
      </div>
      
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => {
            if (window.confirm('Clear all notes for this lecture?')) {
              setNotes('');
              saveNote(moduleId, lectureId, '');
              setLastSaved(new Date());
            }
          }}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Clear Notes
        </button>
        
        <button
          onClick={() => {
            // Create a download link for the notes
            const blob = new Blob([notes], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `notes_${moduleId}_${lectureId}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
          className="text-sm text-indigo-600 hover:text-indigo-800"
          disabled={!notes.trim()}
        >
          Download Notes
        </button>
      </div>
    </div>
  );
};