/**
 * Sanitizes a user object by removing sensitive data.
 * @param {Object} obj - Mongoose user document object.
 * @returns {Object} Sanitized user object.
 */
const sanitizeUser = (obj) => {
  return {
    _id: obj._id,
    username: obj.username,
    role: obj.role,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

export { sanitizeUser };