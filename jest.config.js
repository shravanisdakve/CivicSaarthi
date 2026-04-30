// jest.config.js
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    // Use babel-jest for .js, .jsx, .ts, .tsx files
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    // Ignore node_modules except for specific packages that need to be transformed
    '/node_modules/(?!(some-es-module|another-es-module)/)',
  ],
  testMatch: ['**/src/**/*.{test,spec}.{js,jsx}', '**/tests/**/*.spec.js'],
};
