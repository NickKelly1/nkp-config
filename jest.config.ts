import { Config } from '@jest/types';

// eslint-disable-next-line no-undef
export default async (): Promise<Config.InitialOptions> => ({
  // verbose: true,

  preset: 'ts-jest',
  testEnvironment: 'node',
  // testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  // moduleFileExtensions: ['ts', 'js', 'jsx', 'tsx'],

  // https://stackoverflow.com/questions/50411719/shared-utils-functions-for-testing-with-jest/52910794
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json',
    },
  },

  modulePathIgnorePatterns: [
    '/node_modules/',
  ],
});
