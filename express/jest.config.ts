import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
	coverageThreshold: {
		global: {
			branches: 60,
			functions: 60,
			lines: 60,
			statements: 60
		},
		'./src/routes/*': {
			functions: 100
		}
	},
	displayName: 'Express API',
	extensionsToTreatAsEsm: ['.ts'],
	globals: {
		POSTGRES_DOCKER_ID: '',
	},
	globalSetup: './src/jest/globalSetup.ts',
	globalTeardown: './src/jest/globalTeardown.ts',
	preset: 'ts-jest/presets/default-esm',
	testEnvironment: 'node',
	testPathIgnorePatterns: [
		'/node_modules/',
		'/dist/',
	],
};

export default config;