import _BaseAPIService from "./_BaseAPIService";
import { getResource, getResourceById, createResource, updateResource, deleteResource } from "./api";

const apiService = _BaseAPIService.instance;

/**
 * Appointment Service - Handles all appointment-related API calls
 */

/**
 * Get all appointments with optional pagination
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Records per page
 */
export const getAppointments = async (page = 1, pageSize = 10) => {
  try {
    const response = await apiService.get(`/customer-appointments?Page=${page}&PageSize=${pageSize}`);
    return response.data;
  } catch {
    return getResource("appointments");
  }
};

/**
 * Get single appointment by ID
 * @param {string} id - Appointment ID
 * @returns {Promise<Object>} Appointment details
 */
export const getAppointmentById = async (id) => {
  return getResourceById("appointments", id);
};

/**
 * Create new appointment
 * @param {Object} appointmentData - Appointment information
 * @returns {Promise<Object>} Created appointment with ID
 */
export const createAppointment = async (appointmentData) => {
  return createResource("appointments", appointmentData);
};

/**
 * Update existing appointment
 * @param {string} id - Appointment ID
 * @param {Object} appointmentData - Updated appointment data
 * @returns {Promise<Object>} Updated appointment
 */
export const updateAppointment = async (id, appointmentData) => {
  return updateResource("appointments", id, appointmentData);
};

/**
 * Delete appointment
 * @param {string} id - Appointment ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteAppointment = async (id) => {
  return deleteResource("appointments", id);
};
