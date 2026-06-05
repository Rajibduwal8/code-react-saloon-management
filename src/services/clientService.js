import {
  getResource,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} from "./api";

/**
 * Client/Customer Service
 * Handles all client-related API calls and data management
 *
 * API Endpoints to implement:
 * - GET /clients - List all clients
 * - GET /clients/:id - Get single client details
 * - POST /clients - Create new client
 * - PUT /clients/:id - Update client
 * - DELETE /clients/:id - Delete client
 */

/**
 * Get all clients
 * @returns {Promise<Array>} List of clients
 */
export const getClients = async () => {
  return getResource("clients");
};

/**
 * Get single client by ID
 * @param {string} id - Client ID
 * @returns {Promise<Object>} Client details
 */
export const getClientById = async (id) => {
  return getResourceById("clients", id);
};

/**
 * Create new client
 * @param {Object} clientData - Client information
 * @returns {Promise<Object>} Created client with ID
 */
export const createClient = async (clientData) => {
  const client = {
    ...clientData,
    registeredDate: new Date().toISOString().split("T")[0],
  };
  return createResource("clients", client);
};

/**
 * Update existing client
 * @param {string} id - Client ID
 * @param {Object} clientData - Updated client data
 * @returns {Promise<Object>} Updated client
 */
export const updateClient = async (id, clientData) => {
  return updateResource("clients", id, clientData);
};

/**
 * Delete client
 * @param {string} id - Client ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteClient = async (id) => {
  return deleteResource("clients", id);
};
