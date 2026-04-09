export const passwordRules = {
    minLength: 8,
    hasLowercase: (value: string) => /[a-z]/.test(value),
    hasUppercase: (value: string) => /[A-Z]/.test(value),
    hasNumber: (value: string) => /\d/.test(value),
    hasSpecial: (value: string) => /[^A-Za-z0-9]/.test(value),
};
