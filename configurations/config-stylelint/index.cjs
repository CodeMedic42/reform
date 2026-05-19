module.exports = {
	extends: [
		'stylelint-config-standard',
		'stylelint-config-prettier',
	],
	plugins: [
		'stylelint-scss'
	],
	'customSyntax': 'postcss-scss',
	rules: {
		'at-rule-no-unknown': null,
		'scss/at-rule-no-unknown': true,
		'import-notation': 'string',
		'declaration-block-no-redundant-longhand-properties': [true, {
			ignoreShorthands: ['/flex/'],
		}],
		'function-no-unknown': [true, {
			ignoreFunctions: ['getSchemeColor', 'math.div', 'columnPercentage'],
		}],
		'no-invalid-position-at-import-rule': [true, {
			ignoreAtRules: ['use']
		}],
		'function-name-case': null,
	},
	reportNeedlessDisables: true,
};