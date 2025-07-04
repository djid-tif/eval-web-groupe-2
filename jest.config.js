// jest.config.js
module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
    testMatch: [
        '**/src/tests/**/*.test.js'
    ],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        '**/src/tests/**/*.js'
    ],
    testPathIgnorePatterns: [
        "/node_modules/", 
        "/dist/",
        "/booking-platform/"
    ],
    // Ignorer les fichiers TypeScript
    moduleFileExtensions: ['js', 'json'],
    transform: {},
    testTimeout: 30000
};

