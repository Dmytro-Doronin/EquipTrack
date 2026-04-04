module.exports = {
    'client/**/*.{js,jsx,ts,tsx}': [
        'npm --prefix client run lint:fix',
        'prettier --write',
    ],
    'client/**/*.{json,md,html,css,scss}': ['prettier --write'],
    '*.{json,md,yml,yaml}': ['prettier --write'],
}