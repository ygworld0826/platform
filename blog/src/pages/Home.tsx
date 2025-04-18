import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lecture, MODULES } from '../types';
import { getLectures } from '../services/storage';

const Home: React.FC = () => {
  const [recentLectures, setRecentLectures] = useState<Lecture[]>([]);
  const [stats, setStats] = useState({
    totalLectures: 0,
    modulesWithContent: 0
  });

  useEffect(() => {
    const lectures = getLectures();
    
    // Get recent lectures
    const sorted = [...lectures].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setRecentLectures(sorted.slice(0, 3));
    
    // Calculate stats
    const modulesWithContent = new Set(lectures.map(lecture => lecture.module)).size;
    setStats({
      totalLectures: lectures.length,
      modulesWithContent
    });
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Blockchain & Web Dev Bootcamp
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Your platform for blockchain and web development lecture materials
        </p>
        <div className="mt-6">
          <Link
            to="/new"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create New Lecture
          </Link>
        </div>
      </div>
      
      {/* Stats */}
      <div className="bg-white shadow rounded-lg mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">{stats.totalLectures}</p>
            <p className="text-sm text-gray-500">Total Lectures</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">{stats.modulesWithContent}</p>
            <p className="text-sm text-gray-500">Modules with Content</p>
          </div>
        </div>
      </div>
      
      {/* Recent Lectures */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Added</h2>
        
        {recentLectures.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {recentLectures.map(lecture => {
              const module = MODULES.find(m => m.id === lecture.module);
              return (
                <div key={lecture.id} className="bg-white shadow overflow-hidden rounded-lg">
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {module?.title || 'Unknown Module'}
                      </span>
                      <span className="mx-2">•</span>
                      <time dateTime={lecture.date}>{formatDate(lecture.date)}</time>
                    </div>
                    
                    <Link to={`/lecture/${lecture.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600">
                        {lecture.title}
                      </h3>
                    </Link>
                    
                    <p className="mt-3 text-gray-600 line-clamp-3">
                      {lecture.content.slice(0, 150)}
                      {lecture.content.length > 150 ? '...' : ''}
                    </p>
                    
                    <div className="mt-4">
                      <Link
                        to={`/lecture/${lecture.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No lectures available yet.</p>
            <Link to="/new" className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">
              Create your first lecture
            </Link>
          </div>
        )}
      </div>
      
      {/* Module Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Modules</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MODULES.map(module => (
            <div key={module.id} className="bg-white shadow overflow-hidden rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{module.description}</p>
                <Link
                  to={`/archive?module=${module.id}`}
                  className="mt-3 inline-block text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  View lectures →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;