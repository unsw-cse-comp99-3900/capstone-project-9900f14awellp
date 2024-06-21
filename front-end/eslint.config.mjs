import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import prettierConfig from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';

export default [
	{
		files: ['**/*.{js,mjs,cjs,jsx}'],
	},
	{
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				jest: 'writable',
				describe: 'writable',
				it: 'writable',
				expect: 'writable',
				beforeEach: 'writable',
				afterEach: 'writable',
				test: 'writable',
			},
		},
	},
	pluginJs.configs.recommended,
	pluginReactConfig,
	{
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	// 添加 Prettier 配置
	prettierConfig,
	{
		plugins: {
			prettier: pluginPrettier,
		},
		rules: {
			'prettier/prettier': 'error',
		},
	},
];
