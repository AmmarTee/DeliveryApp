module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  rootDir: '.',
  testMatch: ['**/*.e2e-spec.ts'],
  transform: { '^.+\\.ts$': 'ts-jest' }
};
