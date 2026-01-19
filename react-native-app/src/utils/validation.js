export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateForm = (formData, schema) => {
  const errors = {};
  
  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = 'Invalid email address';
  }
  
  if (!formData.password || !validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return errors;
};
