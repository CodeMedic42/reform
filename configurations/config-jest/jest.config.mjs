import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  passWithNoTests: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  setupFilesAfterEnv: [
    path.join(__dirname, 'setup.mjs')
  ],
  moduleNameMapper: {
    '^uuid$': '<rootDir>/node_modules/uuid/wrapper.mjs'
  }
};
