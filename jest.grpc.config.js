module.exports = {
  ...require('./jest.config.js'),
  cacheDirectory: './jest-cache',
  testMatch: ['**/src/tests/api-grpc/**/*.e2e.test.js'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.grpc.setup.js'],
}; 