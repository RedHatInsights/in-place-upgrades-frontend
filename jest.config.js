module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.(ts|tsx)', '!src/**/stories/*', '!src/**/index.ts', '!src/*.(ts|tsx)'],
  coverageDirectory: './coverage/',
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^lodash-es$': 'lodash',
    '^uuid$': 'uuid',
  },
  roots: ['<rootDir>/src/'],
  transformIgnorePatterns: ['node_modules/(?!@patternfly|lodash-es|@openshift|@redhat-cloud-services)'],
  testEnvironment: 'jest-environment-jsdom',
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
};
