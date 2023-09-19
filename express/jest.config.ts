import type { Config } from 'jest';

const config: Config = {
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
	globals: {
		__POSTGRES_ID__: '',
	},
	globalSetup: './src/jest/setup.ts',
	globalTeardown: './src/jest/teardown.ts',
	testEnvironment: 'node',
	testPathIgnorePatterns: [
		'/node_modules/',
		'/dist/',
	],
};

export default config;