import { Lecture } from '../types';

const STORAGE_KEY = 'platform_lectures';

// Save lectures to localStorage
export const saveLectures = (lectures: Lecture[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lectures));
  } catch (error) {
    console.error('Error saving lectures to localStorage:', error);
  }
};

// Get all lectures from localStorage
export const getLectures = (): Lecture[] => {
  try {
    const lecturesData = localStorage.getItem(STORAGE_KEY);
    if (!lecturesData) return [];
    return JSON.parse(lecturesData);
  } catch (error) {
    console.error('Error retrieving lectures from localStorage:', error);
    return [];
  }
};

// Add a new lecture
export const addLecture = (lecture: Lecture): void => {
  const lectures = getLectures();
  lectures.push(lecture);
  saveLectures(lectures);
};

// Update an existing lecture
export const updateLecture = (updatedLecture: Lecture): void => {
  const lectures = getLectures();
  const index = lectures.findIndex(lecture => lecture.id === updatedLecture.id);
  
  if (index !== -1) {
    lectures[index] = updatedLecture;
    saveLectures(lectures);
  }
};

// Delete a lecture
export const deleteLecture = (lectureId: string): void => {
  const lectures = getLectures();
  const filteredLectures = lectures.filter(lecture => lecture.id !== lectureId);
  saveLectures(filteredLectures);
};

// Get lectures for a specific module
export const getLecturesByModule = (moduleId: string): Lecture[] => {
  const lectures = getLectures();
  return lectures
    .filter(lecture => lecture.module === moduleId)
    .sort((a, b) => a.order - b.order);
};

// Get a lecture by ID
export const getLectureById = (lectureId: string): Lecture | undefined => {
  const lectures = getLectures();
  return lectures.find(lecture => lecture.id === lectureId);
};

// Generate a unique ID for new lectures
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};