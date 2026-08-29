/**
 * Safely extracts an array from any API response or variable.
 * Handles shapes like:
 * - res.data.data.rows
 * - res.data.data
 * - res.data.rows
 * - res.data
 * - raw Array
 * Returns [] if invalid.
 */
export function safeArray(val) {
    if (Array.isArray(val)) return val;
    if (!val) return [];
    if (Array.isArray(val.data?.data?.rows)) return val.data.data.rows;
    if (Array.isArray(val.data?.data)) return val.data.data;
    if (Array.isArray(val.data?.rows)) return val.data.rows;
    if (Array.isArray(val.data)) return val.data;
    if (Array.isArray(val.rows)) return val.rows;
    return [];
}

/**
 * Safely extracts an object from an API response.
 * Handles shapes like:
 * - res.data.data
 * - res.data
 * - raw object
 * Returns defaultObj if invalid.
 */
export function safeObject(val, defaultObj = {}) {
    if (!val) return defaultObj;
    if (val.data?.data && typeof val.data.data === 'object' && !Array.isArray(val.data.data)) {
        return val.data.data;
    }
    if (val.data && typeof val.data === 'object' && !Array.isArray(val.data)) {
        return val.data;
    }
    if (typeof val === 'object' && !Array.isArray(val)) {
        return val;
    }
    return defaultObj;
}
