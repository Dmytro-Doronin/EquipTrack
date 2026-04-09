import { passwordRules } from '@/components/forms/passwordRules';

export const getPasswordStrength = (password: string) => {
    if (!password) return 0;

    let score = 0;

    if (password.length >= passwordRules.minLength) {
        score += 1;
    }
    if (passwordRules.hasLowercase(password)) {
        score += 1;
    }
    if (passwordRules.hasUppercase(password)) {
        score += 1;
    }
    if (passwordRules.hasNumber(password)) {
        score += 1;
    }
    if (passwordRules.hasSpecial(password)) {
        score += 1;
    }

    if (score <= 1) {
        return 1;
    }
    if (score <= 2) {
        return 2;
    }
    if (score <= 4) {
        return 3;
    }
    return 4;
};

export const getStrengthColor = (strength: number, level: number) => {
    if (strength < level) {
        return 'bg-gray-main';
    }

    if (strength === 1) {
        return 'bg-danger';
    }
    if (strength === 2) {
        return 'bg-warning';
    }

    return 'bg-success';
};
