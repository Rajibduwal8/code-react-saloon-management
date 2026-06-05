import {
  getResource,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} from "./api";

/**
 * Course Service
 * Handles all course-related API calls and data management
 *
 * API Endpoints to implement:
 * - GET /courses - List all courses
 * - GET /courses/:id - Get single course details
 * - POST /courses - Create new course
 * - PUT /courses/:id - Update course
 * - DELETE /courses/:id - Delete course
 */

/**
 * Get all courses
 * @returns {Promise<Array>} List of courses
 */
export const getCourses = async () => {
  return getResource("courses");
};

/**
 * Get single course by ID
 * @param {string} id - Course ID
 * @returns {Promise<Object>} Course details
 */
export const getCourseById = async (id) => {
  return getResourceById("courses", id);
};

/**
 * Create new course
 * @param {Object} courseData - Course information
 * @returns {Promise<Object>} Created course with ID
 */
export const createCourse = async (courseData) => {
  const course = {
    ...courseData,
    students: 0,
  };
  return createResource("courses", course);
};

/**
 * Update existing course
 * @param {string} id - Course ID
 * @param {Object} courseData - Updated course data
 * @returns {Promise<Object>} Updated course
 */
export const updateCourse = async (id, courseData) => {
  return updateResource("courses", id, courseData);
};

/**
 * Delete course
 * @param {string} id - Course ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteCourse = async (id) => {
  return deleteResource("courses", id);
};
