export const validateNumber = (value: string): boolean => {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/.test(value);
};
