import React, { useState, useEffect } from 'react';
import { Lecture, MODULES } from '../types';
import { generateId } from '../services/storage';

interface EditorProps {
  initialLecture?: Lecture;
  onSave: (lecture: Lecture) => void;
}

const Editor: React.FC<EditorProps> = ({ initialLecture, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [module, setModule] = useState('');
  const [order, setOrder] = useState(1);

  // If editing an existing lecture, populate the form
  useEffect(() => {
    if (initialLecture) {
      setTitle(initialLecture.title);
      setContent(initialLecture.content);
      setModule(initialLecture.module);
      setOrder(initialLecture.order);
    } else if (MODULES.length > 0) {
      // Default to first module if creating new
      setModule(MODULES[0].id);
    }
  }, [initialLecture]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !module) {
      alert('Please fill all required fields');
      return;
    }

    const lecture: Lecture = {
      id: initialLecture?.id || generateId(),
      title: title.trim(),
      content: content.trim(),
      date: initialLecture?.date || new Date().toISOString(),
      module,
      order: Number(order)
    };

    onSave(lecture);
    
    // Clear form if not editing
    if (!initialLecture) {
      setTitle('');
      setContent('');
      setOrder(1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Lecture Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
          required
        />
      </div>

      <div>
        <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-1">
          Module
        </label>
        <select
          id="module"
          value={module}
          onChange={(e) => setModule(e.target.value)}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
          required
        >
          <option value="">Select a module</option>
          {MODULES.map((mod) => (
            <option key={mod.id} value={mod.id}>
              {mod.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
          Order in Module
        </label>
        <input
          type="number"
          id="order"
          min="1"
          value={order}
          onChange={(e) => setOrder(parseInt(e.target.value))}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialLecture ? 'Update Lecture' : 'Save Lecture'}
        </button>
      </div>
    </form>
  );
};

export default Editor;