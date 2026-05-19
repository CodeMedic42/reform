import { isNil } from "lodash-es";
import Property from "../data/property";
import { RuleDefinition } from "../configuration/configuration-types";


export default function buildRequiredRule(message: string, optional: Omit<RuleDefinition, 'validator'>) {
	return {
		validator: (fooValue: Property) => {
			if (isNil(fooValue.getValue())) {
				return message
			}
			
			return null;
		},
		...optional
	};
}