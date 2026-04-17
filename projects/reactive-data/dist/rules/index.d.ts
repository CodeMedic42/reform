import { R as RuleDefinition, T as TriggersDefinition, P as Property } from '../index-CFGeEaJC.js';

declare function buildRequiredRule(message: string, optional: Omit<RuleDefinition, 'validator'>): {
    requires?: string[] | undefined;
    attribute?: any;
    enabled?: any;
    triggers?: TriggersDefinition | undefined;
    validator: (fooValue: Property) => string | null;
};

export { buildRequiredRule as buildRequiredRole };
