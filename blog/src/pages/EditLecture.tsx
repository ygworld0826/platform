import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '../components/Editor';
import { Lecture } from '../types';
import { getLectureById, updateLecture } from '../services/storage';

const EditLecture: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const lectureData = getLectureById(id);
      if (lectureData) {
        setLecture(lectureData);
      }
      setLoading(false);
    }
  }, [id]);
  
  const handleSave = (updatedLecture: Lecture) => {
    updateLecture(updatedLecture);
    alert('Lecture updated successfully!');
    navigate(`/lecture/${updatedLecture.id}`);
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!lecture) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white shadow-sm rounded-lg p-6 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-2">Lecture not found</h2>
          <p className="text-gray-500 mb-4">The lecture you're trying to edit doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/archive')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go to Archive
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Lecture</h1>
        <p className="text-gray-600 mt-2">Update your lecture content</p>
      </div>
      
      <Editor 
        initialLecture={lecture} 
        onSave={handleSave} 
      />
    </div>
  );
};

export default EditLecture;