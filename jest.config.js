module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.tsx', '!src/**/stories/*'],
  coverageDirectory: './coverage/',
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^lodash-es$': 'lodash',
    '^uuid$': 'uuid'
  },
  roots: ['<rootDir>/src/'],
  transformIgnorePatterns: ['node_modules/(?!@patternfly|lodash-es|@openshift|@redhat-cloud-services)'],
  testEnvironment: 'jest-environment-jsdom',
  moduleDirectories: [
    'node_modules',
    './src', //the root directory
  ],
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
};
