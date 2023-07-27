/* eslint-env node */
module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint'
    ],
    root: true,
    rules: {
        // Alphabetical order
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        'indent': [
            'error',
            4
        ],
        'no-trailing-spaces': 'error',
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ]
        // TODO: resolve
        /*'max-len': [
            'error',
            {
                code: 140
            }
        ]*/
    }
};