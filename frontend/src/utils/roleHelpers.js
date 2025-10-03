/**
 * Role Helper Utilities
 *
 * These utilities help manage user roles across the application.
 * Backend returns roles as an array: user.roles = ["buyer", "seller"]
 */

/**
 * Get the primary/display role for a user
 * Priority: admin > seller > buyer
 * @param {string[]} roles - Array of user roles
 * @returns {string} - Primary role to display
 */
export const getPrimaryRole = (roles) => {
  if (!roles || roles.length === 0) return 'buyer';

  // Prioritize roles: admin > seller > buyer
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('seller')) return 'seller';

  return roles[0] || 'buyer';
};

/**
 * Get all roles for a user
 * @param {string[]} roles - Array of user roles
 * @returns {string[]} - All roles or default ['buyer']
 */
export const getAllRoles = (roles) => {
  if (!roles || roles.length === 0) return ['buyer'];
  return roles;
};

/**
 * Check if user has a specific role
 * @param {string[]} roles - Array of user roles
 * @param {string} role - Role to check for
 * @returns {boolean} - True if user has the role
 */
export const hasRole = (roles, role) => {
  return roles && roles.includes(role);
};

/**
 * Check if user has seller role
 * @param {string[]} roles - Array of user roles
 * @returns {boolean} - True if user is a seller
 */
export const isSeller = (roles) => {
  return hasRole(roles, 'seller');
};

/**
 * Check if user has buyer role
 * @param {string[]} roles - Array of user roles
 * @returns {boolean} - True if user is a buyer
 */
export const isBuyer = (roles) => {
  return hasRole(roles, 'buyer');
};

/**
 * Check if user has admin role
 * @param {string[]} roles - Array of user roles
 * @returns {boolean} - True if user is an admin
 */
export const isAdmin = (roles) => {
  return hasRole(roles, 'admin');
};

/**
 * Format role for display (capitalize first letter)
 * @param {string} role - Role to format
 * @returns {string} - Formatted role
 */
export const formatRole = (role) => {
  if (!role) return '';
  return role.charAt(0).toUpperCase() + role.slice(1);
};

/**
 * Get role display color
 * @param {string} role - Role name
 * @returns {string} - Tailwind CSS color class
 */
export const getRoleColor = (role) => {
  switch (role) {
    case 'admin':
      return 'text-purple-500';
    case 'seller':
      return 'text-green-500';
    case 'buyer':
    default:
      return 'text-orange-500';
  }
};

/**
 * Get role badge styling
 * @param {string} role - Role name
 * @returns {object} - Style object for badge
 */
export const getRoleBadgeStyle = (role) => {
  switch (role) {
    case 'admin':
      return {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        border: 'border-purple-200'
      };
    case 'seller':
      return {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200'
      };
    case 'buyer':
    default:
      return {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-200'
      };
  }
};
