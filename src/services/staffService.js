import {
  getResource,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} from "./api";

/**
 * Staff Service
 * Handles all staff-related API calls and data management
 *
 * API Endpoints to implement:
 * - GET /staff - List all staff members
 * - GET /staff/:id - Get single staff details
 * - POST /staff - Create new staff
 * - PUT /staff/:id - Update staff
 * - DELETE /staff/:id - Delete staff
 */

/**
 * Get all staff
 * @returns {Promise<Array>} List of staff members
 */
export const getStaff = async () => {
  return getResource("staff");
};

/**
 * Get single staff member by ID
 * @param {string} id - Staff ID
 * @returns {Promise<Object>} Staff details
 */
export const getStaffById = async (id) => {
  return getResourceById("staff", id);
};

/**
 * Create new staff member
 * @param {Object} staffData - Staff information
 * @returns {Promise<Object>} Created staff with ID
 */
export const createStaff = async (staffData) => {
  const staff = {
    ...staffData,
    joinDate: new Date().toISOString().split("T")[0],
  };
  return createResource("staff", staff);
};

/**
 * Update existing staff member
 * @param {string} id - Staff ID
 * @param {Object} staffData - Updated staff data
 * @returns {Promise<Object>} Updated staff
 */
export const updateStaff = async (id, staffData) => {
  return updateResource("staff", id, staffData);
};

/**
 * Delete staff member
 * @param {string} id - Staff ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteStaff = async (id) => {
  return deleteResource("staff", id);
};
