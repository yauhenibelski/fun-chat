/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'airbnb-base',
        'plugin:prettier/recommended',
    ],
    noInlineConfig: true,
    plugins: ['@typescript-eslint', 'prettier'],
    parser: '@typescript-eslint/parser',
    rules: {
        'class-methods-use-this': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        'import/prefer-default-export': 'off',
        'no-useless-constructor': 'warn',
        'lines-between-class-members': 'off',
        'import/extensions': [
            'off',
            'ignorePackages',
            {
                js: 'never',
                ts: 'never',
            },
        ],
        'import/no-unresolved': 'off',
        'no-undef': 'off',
        // --------  off rules by agreement below --------
        'no-empty-function': 'warn',
        'no-redeclare': 'warn',
        'no-unused-vars': 'off',
        '@typescript-eslint/ban-types': 'off',
        'no-useless-escape': 'off',
    },
};
