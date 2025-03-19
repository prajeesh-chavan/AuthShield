const roles = {
  user: ["read"],
  admin: ["read", "write", "delete"],
};

// Function to check if role has a specific permission
const checkPermission = (role, permission) => {
  return roles[role] && roles[role].includes(permission);
};

module.exports = { checkPermission };
