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
    plugins: ['@typescript-eslint', 'prettier'],
    parser: '@typescript-eslint/parser',
    rules: {
        'class-methods-use-this': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/ban-types': 'off',
        'import/prefer-default-export': 'off',
        'no-useless-constructor': 'warn',
        'lines-between-class-members': 'off',
        'no-shadow': 'warn',
        'no-return-assign': 'off',
        'no-param-reassign': 'warn',
        'no-unused-vars': 'off',
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
    },
};
