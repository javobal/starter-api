module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
        'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }], // Tem fix for node/no-unsupported-festures/es-syntax
    },
}
