import path from 'path';
import fs from 'fs';

function assetResolver({ include }) {
	const isMatchSingle = function (matcher, module) {
		return new RegExp(matcher, "g").test(module);
	};

	const isMatch = function (module) {
		if (include === undefined) {
			return false;
		}

		return Array.isArray(include)
			? include.some((i) => isMatchSingle(i, module))
			: isMatchSingle(include, module);
	};

	return {
		name: 'asset-resolver',
		resolveId(source, importer) {
			if (!isMatch(source)) {
				return undefined;
			}

			return path.resolve(path.dirname(importer), source);
		},
		load(id) {
			if (!isMatch(id)) {
				return undefined;
			}

			const referenceId = this.emitFile({
				type: 'asset',
				name: path.basename(id),
				source: fs.readFileSync(id)
			});
			
			return `export default import.meta.ROLLUP_FILE_URL_${referenceId};`;
		}
	};
}

export default assetResolver;