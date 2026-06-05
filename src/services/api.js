import apiData from "./apiData.json";

const STORAGE_KEY = "wellnessStudioData_v1";

const simulateDelay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getDefaultDatabase = () => ({
  students: [...(apiData.students || [])],
  clients: [...(apiData.clients || [])],
  staff: [...(apiData.staff || [])],
  courses: [...(apiData.courses || [])],
  appointments: [...(apiData.appointments || [])],
});

const normalizeDatabase = (source) => ({
  students: Array.isArray(source.students) ? [...source.students] : [],
  clients: Array.isArray(source.clients) ? [...source.clients] : [],
  staff: Array.isArray(source.staff) ? [...source.staff] : [],
  courses: Array.isArray(source.courses) ? [...source.courses] : [],
  appointments: Array.isArray(source.appointments)
    ? [...source.appointments]
    : [],
});

const loadDatabaseFromStorage = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return normalizeDatabase(JSON.parse(raw));
  } catch (error) {
    console.warn(
      "Failed to load wellness studio database from localStorage:",
      error,
    );
    return null;
  }
};

const saveDatabaseToStorage = (database) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
  } catch (error) {
    console.warn(
      "Failed to persist wellness studio database to localStorage:",
      error,
    );
  }
};

const initializeDatabase = () => {
  const stored = loadDatabaseFromStorage();
  const initialDb = stored || getDefaultDatabase();
  if (!stored) {
    saveDatabaseToStorage(initialDb);
  }
  return initialDb;
};

const db = initializeDatabase();

const persistDatabase = () => saveDatabaseToStorage(db);

const getResourceArray = (resource) => {
  if (!db[resource]) {
    throw new Error(`Unknown resource: ${resource}`);
  }
  return db[resource];
};

const cloneItem = (item) => (item ? JSON.parse(JSON.stringify(item)) : null);

export const apiCall = async (endpoint, method = "GET", data = null) => {
  try {
    await simulateDelay();
    return { success: true, data };
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getResource = async (resource) => {
  await simulateDelay();
  return getResourceArray(resource).map(cloneItem);
};

export const getResourceById = async (resource, id) => {
  await simulateDelay();
  const item = getResourceArray(resource).find(
    (entry) => String(entry.id) === String(id),
  );
  return cloneItem(item);
};

export const createResource = async (resource, payload) => {
  await simulateDelay();
  const collection = getResourceArray(resource);
  const newItem = {
    id: String(Date.now()),
    ...payload,
  };
  collection.push(newItem);
  persistDatabase();
  return cloneItem(newItem);
};

export const updateResource = async (resource, id, payload) => {
  await simulateDelay();
  const collection = getResourceArray(resource);
  const index = collection.findIndex(
    (entry) => String(entry.id) === String(id),
  );
  if (index === -1) {
    return null;
  }
  collection[index] = { ...collection[index], ...payload };
  persistDatabase();
  return cloneItem(collection[index]);
};

export const deleteResource = async (resource, id) => {
  await simulateDelay();
  const collection = getResourceArray(resource);
  const index = collection.findIndex(
    (entry) => String(entry.id) === String(id),
  );
  if (index === -1) {
    return false;
  }
  collection.splice(index, 1);
  persistDatabase();
  return true;
};

export const resetDatabase = async () => {
  await simulateDelay();
  const defaultDb = getDefaultDatabase();
  Object.keys(db).forEach((resource) => {
    db[resource] = defaultDb[resource];
  });
  persistDatabase();
  return true;
};

export const api = {
  get: (endpoint) => apiCall(endpoint, "GET"),
  post: (endpoint, data) => apiCall(endpoint, "POST", data),
  put: (endpoint, data) => apiCall(endpoint, "PUT", data),
  delete: (endpoint) => apiCall(endpoint, "DELETE"),
  patch: (endpoint, data) => apiCall(endpoint, "PATCH", data),
  resetDatabase,
};
