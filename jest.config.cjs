module.exports = {
  // Specify the environment for testing
  testEnvironment: "jest-environment-jsdom",

  // Automatically setup testing library after each test environment is set up
  // setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],

  // Enable code coverage collection
  collectCoverage: true,

  // Specify directories and files to ignore for coverage
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts", // Ignore TypeScript declaration files
    "!src/index.tsx", // Ignore main entry file
    "!src/serviceWorker.ts", // Ignore service worker setup
    "!src/setupTests.js", // Ignore setupTests file
  ],

  // Output directory for coverage reports
  coverageDirectory: "coverage",

  // Coverage thresholds (optional but recommended for Codecov)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Module file extensions for importing
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],

  // Module name mapper for CSS modules and static assets
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/src/__mocks__/fileMock.js",
  },

  // Paths to transform with Babel or ts-jest for TypeScript
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
};
