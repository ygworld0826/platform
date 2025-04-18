import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LectureView from '../components/LectureView';
import { Lecture as LectureType } from '../types';
import { getLectureById, deleteLecture } from '../services/storage';

const Lecture: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<LectureType | null>(null);
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
  
  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      if (id) {
        deleteLecture(id);
        navigate('/archive');
      }
    }
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
          <p className="text-gray-500 mb-4">The lecture you're looking for doesn't exist or has been removed.</p>
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
      <LectureView 
        lecture={lecture} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Lecture;