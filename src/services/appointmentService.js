import {
  getResource,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} from "./api";

/**
 * Appointment/Booking Service
 * Handles all appointment-related API calls and data management
 *
 * API Endpoints to implement:
 * - GET /appointments - List all appointments
 * - GET /appointments/:id - Get single appointment details
 * - POST /appointments - Create new appointment
 * - PUT /appointments/:id - Update appointment
 * - DELETE /appointments/:id - Delete appointment
 */

/**
 * Get all appointments
 * @returns {Promise<Array>} List of appointments
 */
export const getAppointments = async () => {
  return getResource("appointments");
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
