/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      lines: 90,
      branches: 90,
      functions: 90,
      statements: 90
    }
  },
  coverageReporters: ["json", "lcov", "text-summary", "clover", "cobertura"],
  transform: {
    '^.+\\.(t|j)s?$': '@swc/jest'
  },
  setupFilesAfterEnv: [
    './tests/helpers/expect-helpers.ts'
  ]
};

export default config;
