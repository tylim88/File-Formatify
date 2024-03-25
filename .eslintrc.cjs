/* eslint-env node */

module.exports = {
	root: true,
	plugins: ['unused-imports', '@typescript-eslint', 'react-refresh'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		tsconfigRootDir: __dirname,
		allowImportExportEverywhere: true,
		project: ['tsconfig.json', 'tsconfig.node.json'],
	},
	env: { browser: true, es2020: true },
	settings: {
		react: {
			version: 'detect',
		},
	},
	overrides: [
		{
			files: ['*.js', '*.json', '*.cjs'],
			extends: ['plugin:@typescript-eslint/disable-type-checked'],
		},
	],
	extends: [
		'eslint:recommended',
		'plugin:json/recommended',
		'plugin:markdown/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:yml/prettier',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:prettier/recommended',
		'prettier',
	],
	ignorePatterns: [
		'**/dist',
		'**/package-lock.json',
		'**/node_modules',
		'**/lib',
	],
	rules: {
		'react/display-name': 'off',
		'react/prop-types': 'off',
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
		'no-console': [
			process.env.CI ? 'error' : 'warn',
			{ allow: ['warn', 'error', 'info'] },
		],
		'react/react-in-jsx-scope': 'off',
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'unused-imports/no-unused-imports': 'warn',
		'unused-imports/no-unused-vars': [
			'warn',
			{
				vars: 'all',
				varsIgnorePattern: '^_',
				args: 'after-used',
				argsIgnorePattern: '^_',
			},
		],
		'json/*': ['off', { allowComments: true, trailingComma: true }],
		'@typescript-eslint/no-misused-promises': [
			'error',
			{
				checksVoidReturn: false,
			},
		],
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-redundant-type-constituents': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
	},
}
