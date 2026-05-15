const AUTH_HINT_KEY = 'auth_hint';

export function setAuthHint() {
    localStorage.setItem(AUTH_HINT_KEY, '1');
}

export function clearAuthHint() {
    localStorage.removeItem(AUTH_HINT_KEY);
}

export function hasAuthHint() {
    return localStorage.getItem(AUTH_HINT_KEY) === '1';
}
