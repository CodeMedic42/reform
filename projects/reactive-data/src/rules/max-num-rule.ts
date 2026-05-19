import { isNil } from "lodash-es";
import Property from "../data/property";
import { RuleDefinition } from "../configuration/configuration-types";


export default function buildMinNumRule(
	message: string,
	attribute: number | (() => number), 
	optional: Omit<RuleDefinition, 'validator' | 'attribute'>) {
	return {
		validator: (fooValue: Property, attributeValue: number) => {
			const value = fooValue.getValue();

			if (isNil(value)) {
				// The value is null does not fail this test.
				// Use the required validator to first make sure it exists.
				return null;
			}

			if (value > attributeValue) {
				return message;
			}
			
			return null;
		},
		attribute,
		...optional
	};
}