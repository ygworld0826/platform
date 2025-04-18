import React from 'react';
import { Link } from 'react-router-dom';
import { Lecture, MODULES } from '../types';
import ReactMarkdown from 'react-markdown';

interface LectureViewProps {
  lecture: Lecture;
  onEdit?: () => void;
  onDelete?: () => void;
}

const LectureView: React.FC<LectureViewProps> = ({ lecture, onEdit, onDelete }) => {
  const module = MODULES.find(m => m.id === lecture.module);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <article className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
            {module?.title || 'Unknown Module'}
          </span>
          <span className="mx-2">•</span>
          <time dateTime={lecture.date}>{formatDate(lecture.date)}</time>
          <span className="mx-2">•</span>
          <span>Lecture {lecture.order}</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{lecture.title}</h1>
        
        <div className="prose max-w-none">
          <ReactMarkdown>{lecture.content}</ReactMarkdown>
        </div>
      </div>
      
      {(onEdit || onDelete) && (
        <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-4 border-t">
          {onEdit && (
            <button 
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button 
              onClick={onDelete}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          )}
        </div>
      )}
      
      <div className="bg-gray-50 px-6 py-3 border-t">
        <Link 
          to="/archive" 
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to Archive
        </Link>
      </div>
    </article>
  );
};

export default LectureView;