import { RuleDefinition } from "../configuration/configuration-types";


export default function buildDisabledRule(
	enabled: boolean | ((required: any[]) => boolean),
	requires: string[],
	optional: Omit<RuleDefinition, 'enabled' | 'requires'>) {
	return {
		enabled,
		requires,
		...optional
	};
}