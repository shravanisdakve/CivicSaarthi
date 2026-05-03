// jest.config.js
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/fileMock.js',
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
