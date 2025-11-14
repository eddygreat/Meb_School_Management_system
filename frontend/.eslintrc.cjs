module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: '18.2.0',
    },
  },
  plugins: ['react', 'react-hooks', 'prettier'],
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'prettier/prettier': ['error', {
      singleQuote: true,
      semi: true,
      tabWidth: 2,
      printWidth: 100,
      trailingComma: 'es5',
      bracketSpacing: true,
      arrowParens: 'always',
      endOfLine: 'auto',
    }],
  },
};
