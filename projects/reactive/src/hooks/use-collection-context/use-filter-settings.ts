import { useCallback, useMemo } from 'react';
import { isNil, toPath, reduce, isEmpty, isString, startsWith, endsWith, isArray, isFinite, isBoolean, forEach, toLower, keys } from 'lodash-es';

type MatchMethod = (values: any[], target: any) => number;

let doesMatch: ((item: any, values: any[], targetPath: string[], matchMethod: MatchMethod) => number | boolean) | null = null;

function arrayDoesMatch(targets: any[], value: any[], targetPath: string[], matchMethod: MatchMethod): boolean {
    let match = false;

    forEach(targets, (target) => {
        match = doesMatch!(target, value, targetPath, matchMethod) as boolean;

        return !match;
    });

    return match;
}

doesMatch = function doesMatchMethod(item: any, values: any[], targetPath: string[], matchMethod: MatchMethod): number | boolean {
    let target = item;

    for (
        let counter = 0;
        counter < targetPath.length && !isNil(target);
        counter += 1
    ) {
        const targetPathPart = targetPath[counter];

        if (targetPathPart === '*') {
            return arrayDoesMatch(
                target,
                values,
                targetPath.slice(counter + 1),
                matchMethod,
            );
        }

        target = target[targetPathPart];
    }

    return matchMethod(values, target);
};

function processStringValue(rawValues: any[]): string[] {
    return reduce(
        rawValues,
        (acc: string[], rawValue) => {
            if (!isNil(rawValue) && rawValue.length >= 1) {
                acc.push(rawValue.toLowerCase());
            }

            return acc;
        },
        [],
    );
}

interface ProcessedRule {
    matchMethod: MatchMethod;
    as: string;
    paths: string[][];
}

function processRawValue(rawValue: any, rule: ProcessedRule): any[] | null {
    let values = !isArray(rawValue) ? [rawValue] : rawValue;

    if (rule.as === 'string') {
        values = processStringValue(values);
    } else if (rule.as === 'number') {
        forEach(values, (value) => {
            if (!isFinite(value)) {
                throw new Error('Value is not a number');
            }
        });
    } else if (rule.as === 'boolean') {
        forEach(values, (value) => {
            if (!isBoolean(value)) {
                throw new Error('Value is not a boolean');
            }
        });
    } else {
        throw new Error('Invalid "as"');
    }

    if (isNil(values) || values.length <= 0) {
        return null;
    }

    return values;
}

function processRawValues(rules: Record<string, ProcessedRule>, values: any): { enabled: boolean; valueItemsList: Record<string, any[]> } {
    const remaining: Record<string, any[]> = {};

    if (!isNil(values)) {
        let cleanedValues = values;

        if (isString(values)) {
            cleanedValues = {
                undefined: [values],
            };
        } else if (isArray(values)) {
            cleanedValues = {
                undefined: values,
            };
        }

        forEach(
            cleanedValues,
            (value: any, key: string) => {
                const rule = rules[key];

                if (isNil(rule)) {
                    // If no id is provided or the rule was not defined then we do nothing.
                    return;
                }

                if (isNil(value)) {
                    // If value is nil then there is nothing to compare.
                    return;
                }

                const result = processRawValue(value, rule);

                if (!isNil(result)) {
                    remaining[key] = result;
                }
            },
        );
    }

    return {
        enabled: !isEmpty(remaining),
        valueItemsList: remaining,
    };
}

function exactMatch(values: any[], target: any): number {
    let found = false;

    forEach(values, (value) => {
        if (value === target) {
            found = true;
        }

        return !found;
    });

    return found ? 1 : 0;
}

function startsWithMatch(values: any[], target: any): number {
    let found = false;

    forEach(values, (value) => {
        if (startsWith(target, value)) {
            found = true;
        }

        return !found;
    });

    return found ? 1 : 0;
}

function endsWithMatch(values: any[], target: any): number {
    let found = false;

    forEach(values, (value) => {
        if (endsWith(target, value)) {
            found = true;
        }

        return !found;
    });

    return found ? 1 : 0;
}

function containsMatch(values: any[], target: any): number {
    if (isNil(target) || target.length <= 0) {
        return 0;
    }

    const lowerTarget = toLower(target);
    const targetLength = lowerTarget.length;

    const finalIndex = reduce(
        values,
        (acc: number, valueItem: string) => {
            const index = lowerTarget.indexOf(valueItem);

            if (index >= 0 && index < acc) {
                return index;
            }

            return acc;
        },
        targetLength,
    );

    return (targetLength - finalIndex) / targetLength;
}

function processRule(rawRule: any): ProcessedRule | null {
    let rule = rawRule;

    if (isString(rule)) {
        rule = {
            paths: [rule],
        };
    } else if (isArray(rule)) {
        rule = {
            paths: rule,
        };
    }

    const paths = reduce(
        rule.paths,
        (acc: string[][], targetPath: string) => {
            acc.push(toPath(targetPath));

            return acc;
        },
        [],
    );

    if (paths.length <= 0) {
        return null;
    }

    const { match } = rule;
    let { as: asValue } = rule;
    let matchMethod: MatchMethod;

    if (asValue === 'number' || asValue === 'boolean') {
        matchMethod = exactMatch;
    } else {
        asValue = 'string';

        if (match === 'exact') {
            matchMethod = exactMatch;
        } else if (match === 'startsWith') {
            matchMethod = startsWithMatch;
        } else if (match === 'endWith') {
            matchMethod = endsWithMatch;
        } else {
            matchMethod = containsMatch;
        }
    }

    return {
        matchMethod,
        as: asValue,
        paths,
    };
}

function processRules(rules: any): Record<string, ProcessedRule> {
    if (isNil(rules)) {
        return {};
    }

    let cleanedRules = rules;

    if (isString(rules) || isArray(rules)) {
        cleanedRules = {
            undefined: rules,
        };
    }

    return reduce(
        cleanedRules,
        (acc: Record<string, ProcessedRule>, rule: any, key: string) => {
            const processedRule = processRule(rule);

            if (!isNil(processedRule)) {
                acc[key] = processedRule;
            }

            return acc;
        },
        {},
    );
}

export interface FilterSettings {
    rules?: any;
    values?: any;
}

export interface FilterState {
    rules: any;
    values: any;
    processValue: (item: any) => number;
}

function useFilterSettings(settings?: FilterSettings | null): FilterState {
    const rules = settings?.rules ?? null;
    const values = settings?.values ?? null;

    const processedRules = useMemo(() => processRules(rules), [rules]);

    const { enabled, valueItemsList: processedValues } = useMemo(
        () => processRawValues(
            processedRules,
            values,
        ),
        [processedRules, values],
    );

    const processValue = useCallback((item: any) => {
        if (!enabled) {
            return 1;
        }

        let found = false;
        let finalCount = 0;

        const count = keys(processedValues).length;

        forEach(processedValues, (processedValue, key) => {
            const rule = processedRules[key];

            const pathCount = rule.paths.length;

            let resultCount = reduce(
                rule.paths,
                (acc: number, path: string[]) => {
                    let ret = doesMatch!(
                        item,
                        processedValue,
                        path,
                        rule.matchMethod,
                    ) as number;

                    ret /= pathCount;

                    return acc + ret;
                },
                0,
            );

            resultCount /= count;

            finalCount += resultCount;

            // Each value has to be found
            found = resultCount > 0;

            return found;
        });

        return found ? finalCount : 0;
    }, [processedRules, values]);

    return useMemo(() => ({
        rules,
        values,
        processValue,
    }), [rules, values, processValue]);
}

export default useFilterSettings;
