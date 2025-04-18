// Notes management service

// Interface for a note
export interface Note {
    id: string;
    moduleId: string;
    lectureId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // Storage key for notes
  const NOTES_STORAGE_KEY = 'platform_notes';
  
  // Get all notes
  export const getAllNotes = (): Note[] => {
    try {
      const notesData = localStorage.getItem(NOTES_STORAGE_KEY);
      if (!notesData) return [];
      return JSON.parse(notesData);
    } catch (error) {
      console.error('Error retrieving notes from localStorage:', error);
      return [];
    }
  };
  
  // Save all notes
  export const saveAllNotes = (notes: Note[]): void => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes to localStorage:', error);
    }
  };
  
  // Get a specific note
  export const getNote = (moduleId: string, lectureId: string): Note | undefined => {
    const notes = getAllNotes();
    return notes.find(note => note.moduleId === moduleId && note.lectureId === lectureId);
  };
  
  // Save or update a note
  export const saveNote = (moduleId: string, lectureId: string, content: string): Note => {
    const notes = getAllNotes();
    const now = new Date().toISOString();
    
    // Check if the note already exists
    const existingNoteIndex = notes.findIndex(
      note => note.moduleId === moduleId && note.lectureId === lectureId
    );
    
    if (existingNoteIndex >= 0) {
      // Update existing note
      const updatedNote = {
        ...notes[existingNoteIndex],
        content,
        updatedAt: now
      };
      
      notes[existingNoteIndex] = updatedNote;
      saveAllNotes(notes);
      return updatedNote;
    } else {
      // Create a new note
      const newNote: Note = {
        id: `${moduleId}_${lectureId}_${Date.now()}`,
        moduleId,
        lectureId,
        content,
        createdAt: now,
        updatedAt: now
      };
      
      notes.push(newNote);
      saveAllNotes(notes);
      return newNote;
    }
  };
  
  // Get all notes for a specific module
  export const getNotesByModule = (moduleId: string): Note[] => {
    const notes = getAllNotes();
    return notes.filter(note => note.moduleId === moduleId);
  };
  
  // Delete a note
  export const deleteNote = (moduleId: string, lectureId: string): void => {
    const notes = getAllNotes();
    const filteredNotes = notes.filter(
      note => !(note.moduleId === moduleId && note.lectureId === lectureId)
    );
    saveAllNotes(filteredNotes);
  };
  
  // Export all notes as JSON
  export const exportNotes = (): string => {
    const notes = getAllNotes();
    return JSON.stringify(notes, null, 2);
  };
  
  // Import notes from JSON
  export const importNotes = (jsonData: string): boolean => {
    try {
      const notes = JSON.parse(jsonData) as Note[];
      // Basic validation to ensure proper format
      if (!Array.isArray(notes)) {
        return false;
      }
      saveAllNotes(notes);
      return true;
    } catch (error) {
      console.error('Error importing notes:', error);
      return false;
    }
  };