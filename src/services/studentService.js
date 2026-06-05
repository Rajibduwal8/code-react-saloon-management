import {
  getResource,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} from "./api";

/**
 * Student Service
 * Handles all student-related API calls and data management
 *
 * API Endpoints to implement:
 * - GET /students - List all students
 * - GET /students/:id - Get single student details
 * - POST /students - Create new student
 * - PUT /students/:id - Update student
 * - DELETE /students/:id - Delete student
 */

/**
 * Get all students
 * @returns {Promise<Array>} List of students
 */
export const getStudents = async () => {
  return getResource("students");
};

/**
 * Get single student by ID
 * @param {string} id - Student ID
 * @returns {Promise<Object>} Student details
 */
export const getStudentById = async (id) => {
  return getResourceById("students", id);
};

/**
 * Create new student
 * @param {Object} studentData - Student information
 * @returns {Promise<Object>} Created student with ID
 */
export const createStudent = async (studentData) => {
  const payload = {
    ...studentData,
    name: studentData.student || studentData.name || "",
    studentId: `ST${Date.now()}`,
  };
  delete payload.student;
  return createResource("students", payload);
};

/**
 * Update existing student
 * @param {string} id - Student ID
 * @param {Object} studentData - Updated student data
 * @returns {Promise<Object>} Updated student
 */
export const updateStudent = async (id, studentData) => {
  const payload = {
    ...studentData,
    ...(studentData.student ? { name: studentData.student } : {}),
  };
  delete payload.student;
  return updateResource("students", id, payload);
};

/**
 * Delete student
 * @param {string} id - Student ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteStudent = async (id) => {
  return deleteResource("students", id);
};
