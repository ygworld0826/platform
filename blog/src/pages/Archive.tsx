import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import LectureList from '../components/LectureList';
import { Lecture, MODULES } from '../types';
import { getLectures, deleteLecture } from '../services/storage';

const Archive: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [searchParams] = useSearchParams();
  const moduleFilter = searchParams.get('module');
  
  const loadLectures = useCallback(() => {
    let allLectures = getLectures();
    
    // Apply module filter if present
    if (moduleFilter) {
      allLectures = allLectures.filter(lecture => lecture.module === moduleFilter);
    }
    
    setLectures(allLectures);
  }, [moduleFilter]);
  
  useEffect(() => {
    loadLectures();
  }, [loadLectures]);
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      deleteLecture(id);
      loadLectures();
    }
  };
  
  // Filter modules for display based on module filter
  const filteredModules = moduleFilter 
    ? MODULES.filter(module => module.id === moduleFilter) 
    : MODULES;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lecture Archive</h1>
          <p className="text-gray-600 mt-1">
            {moduleFilter 
              ? `Showing lectures for ${MODULES.find(m => m.id === moduleFilter)?.title || 'selected module'}`
              : 'All lecture materials'
            }
          </p>
        </div>
        
        {moduleFilter && (
          <a 
            href="/archive" 
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Show All Modules
          </a>
        )}
      </div>
      
      {lectures.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-6 text-center">
          <p className="text-gray-500">
            {moduleFilter 
              ? 'No lectures found for this module.' 
              : 'No lectures have been created yet.'
            }
          </p>
        </div>
      ) : (
        <LectureList 
          lectures={lectures} 
          modules={filteredModules}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Archive;