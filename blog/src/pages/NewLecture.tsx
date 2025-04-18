import React from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '../components/Editor';
import { Lecture } from '../types';
import { addLecture } from '../services/storage';

const NewLecture: React.FC = () => {
  const navigate = useNavigate();

  const handleSave = (lecture: Lecture) => {
    addLecture(lecture);
    alert('Lecture saved successfully!');
    navigate(`/lecture/${lecture.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Lecture</h1>
        <p className="text-gray-600 mt-2">Add a new lecture to your bootcamp curriculum</p>
      </div>
      
      <Editor onSave={handleSave} />
    </div>
  );
};

export default NewLecture;