import _BaseAPIService from "./_BaseAPIService";
import { getResource, getResourceById, createResource, updateResource, deleteResource } from "./api";

const apiService = _BaseAPIService.instance;

/**
 * Staff Service
 * Handles all staff-related API calls and data management
 */

/**
 * Get all staff members with optional pagination
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Records per page
 */
export const getStaff = async (page = 1, pageSize = 10) => {
  try {
    const response = await apiService.get(`/staff?Page=${page}&PageSize=${pageSize}`);
    return response.data;
  } catch {
    return getResource("staff");
  }
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
