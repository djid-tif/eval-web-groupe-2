module.exports = {
    projects: [
        {
            displayName: 'gRPC Tests',
            testMatch: ['**/src/tests/api-grpc/**/*.test.js', '**/src/tests/api-grpc/**/*.e2e.test.js'],
            testEnvironment: 'node',
            setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
            setupFiles: ['<rootDir>/jest.grpc.setup.js'],
            cacheDirectory: './jest-cache',
            moduleFileExtensions: ['js', 'json'],
            transform: {},
        },
        {
            displayName: 'Other Tests',
            testEnvironment: 'node',
            setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
            testMatch: [
                '**/src/tests/**/*.test.js',
                '**/src/tests/**/*.e2e.test.js'
            ],
            testPathIgnorePatterns: [
                "/node_modules/", 
                "/dist/",
                "/booking-platform/",
                "/src/tests/api-grpc/"
            ],
            coverageDirectory: 'coverage',
            collectCoverageFrom: [
                '**/src/tests/**/*.js',
                '!**/src/tests/api-grpc/**'
            ],
            moduleFileExtensions: ['js', 'json'],
            transform: {}
        }
    ]
};

