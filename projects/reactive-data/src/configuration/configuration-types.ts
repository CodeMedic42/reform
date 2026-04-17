import Property from "../data/property";

export type TriggersDefinition = {
	initialize?: boolean;
	change?: boolean
}

export type MetaDefinition = {
	[key: string]: any;
}

export type RuleDefinition = {
	requires?: string[];
	attribute?: any;
	enabled?: any;
	triggers?: TriggersDefinition;
	validator?(property: Property, attributeValue: any): string | null;
}

export type RulesDefinition = {
	[key: string]: RuleDefinition;
}

export type ModelDefinition = {
	type: string;
	meta?: MetaDefinition;
	keys?: {
		[key: string]: ModelDefinition;
	};
	items?: ModelDefinition;
	rules?: RulesDefinition;
	triggers?: TriggersDefinition;
}

export type ConfigurationDefinition = {
	triggers?: TriggersDefinition,
	model: ModelDefinition,
}
