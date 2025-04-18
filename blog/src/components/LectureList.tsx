import React from 'react';
import { Link } from 'react-router-dom';
import { Lecture, Module } from '../types';

interface LectureListProps {
  lectures: Lecture[];
  modules: Module[];
  onDelete?: (id: string) => void;
}

const LectureList: React.FC<LectureListProps> = ({ lectures, modules, onDelete }) => {
  // Group lectures by module
  const lecturesByModule = modules.map(module => {
    const moduleLectures = lectures
      .filter(lecture => lecture.module === module.id)
      .sort((a, b) => a.order - b.order);
    
    return {
      module,
      lectures: moduleLectures
    };
  }).filter(group => group.lectures.length > 0);

  if (lectures.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No lectures available.</p>
        <Link to="/new" className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">
          Create your first lecture
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {lecturesByModule.map(({ module, lectures }) => (
        <div key={module.id} className="border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
            <p className="text-sm text-gray-500">{module.description}</p>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {lectures.map(lecture => (
              <li key={lecture.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/lecture/${lecture.id}`}
                      className="text-md font-medium text-indigo-600 hover:text-indigo-800 truncate"
                    >
                      {lecture.order}. {lecture.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(lecture.date)}
                    </p>
                  </div>
                  
                  {onDelete && (
                    <div className="flex space-x-3">
                      <Link 
                        to={`/edit/${lecture.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => onDelete(lecture.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default LectureList;