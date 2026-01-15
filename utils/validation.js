// Form validation utilities

export const validateHabit = (name, description) => {
  const errors = {};

  if (!name || name.trim().length === 0) {
    errors.name = "Habit name is required";
  } else if (name.trim().length < 2) {
    errors.name = "Habit name must be at least 2 characters";
  } else if (name.trim().length > 50) {
    errors.name = "Habit name must be less than 50 characters";
  }

  if (description && description.length > 200) {
    errors.description = "Description must be less than 200 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateChallenge = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = "Challenge name is required";
  } else if (data.name.trim().length < 3) {
    errors.name = "Challenge name must be at least 3 characters";
  } else if (data.name.trim().length > 100) {
    errors.name = "Challenge name must be less than 100 characters";
  }

  if (!data.startDate) {
    errors.startDate = "Start date is required";
  } else {
    const startDate = new Date(data.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      errors.startDate = "Start date cannot be in the past";
    }
  }

  if (!data.endDate) {
    errors.endDate = "End date is required";
  } else if (data.startDate) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (endDate <= startDate) {
      errors.endDate = "End date must be after start date";
    }
  }

  if (data.description && data.description.length > 500) {
    errors.description = "Description must be less than 500 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username) => {
  if (!username || username.trim().length === 0) {
    return { isValid: false, error: "Username is required" };
  }
  if (username.length < 3) {
    return { isValid: false, error: "Username must be at least 3 characters" };
  }
  if (username.length > 20) {
    return { isValid: false, error: "Username must be less than 20 characters" };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, error: "Username can only contain letters, numbers, and underscores" };
  }
  return { isValid: true };
};

export const validatePassword = (password) => {
  if (!password || password.length === 0) {
    return { isValid: false, error: "Password is required" };
  }
  if (password.length < 6) {
    return { isValid: false, error: "Password must be at least 6 characters" };
  }
  return { isValid: true };
};
