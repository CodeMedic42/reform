import { isNil } from "lodash-es";
import Property from "../data/property";
import { RuleDefinition } from "../configuration/configuration-types";


export default function buildPatternRule(
	message: string,
	attribute: string | (() => string), 
	optional: Omit<RuleDefinition, 'validator' | 'attribute'>) {
	return {
		validator: (fooValue: Property, attributeValue: string) => {
			const value = fooValue.getValue();

			if (isNil(value)) {
				// The value is null does not fail this test.
				// Use the required validator to first make sure it exists.
				return null;
			}

			const regex = new RegExp(attributeValue);

			if (!regex.test(value)) {
				return message;
			}
			
			return null;
		},
		attribute,
		...optional
	};
}