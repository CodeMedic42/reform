import { useCallback, useMemo } from 'react';
import isNil from 'lodash/isNil';
import toPath from 'lodash/toPath';
import reduce from 'lodash/reduce';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import startsWith from 'lodash/startsWith';
import endsWith from 'lodash/endsWith';
import isArray from 'lodash/isArray';
import isFinite from 'lodash/isFinite';
import isBoolean from 'lodash/isBoolean';
import forEach from 'lodash/forEach';
import toLower from 'lodash/toLower';
import keys from 'lodash/keys';

let doesMatch = null;

function arrayDoesMatch(targets, value, targetPath, matchMethod) {
    let match = false;

    forEach(targets, (target) => {
        match = doesMatch(target, value, targetPath, matchMethod);

        return !match;
    });

    return match;
}

doesMatch = function doesMatchMethod(item, values, targetPath, matchMethod) {
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

function processStringValue(rawValues) {
    return reduce(
        rawValues,
        (acc, rawValue) => {
            if (!isNil(rawValue) && rawValue.length >= 1) {
                acc.push(rawValue.toLowerCase());
            }

            return acc;
        },
        [],
    );
}

function processRawValue(rawValue, rule) {
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

function processRawValues(rules, values) {
    const remaining = {};

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
            (value, key) => {
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

function exactMatch(values, target) {
    let found = false;

    forEach(values, (value) => {
        if (value === target) {
            found = true;
        }

        return !found;
    });

    return found ? 1 : 0;
}

function startsWithMatch(values, target) {
    let found = false;

    forEach(values, (value) => {
        if (startsWith(target, value)) {
            found = true;
        }

        return !found;
    });

    return found ? 1 : 0;
}

function endsWithMatch(values, target) {
    let found = false;

    forEach(values, (value) => {
        if (endsWith(target, value)) {
            found = true;
        }

        return !found;
    });

    return found ? 1 : 0;
}

function containsMatch(values, target) {
    if (isNil(target) || target.length <= 0) {
        return 0;
    }

    const lowerTarget = toLower(target);
    const targetLength = lowerTarget.length;

    const finalIndex = reduce(
        values,
        (acc, valueItem) => {
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

function processRule(rawRule) {
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
        (acc, targetPath) => {
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
    let matchMethod = null;

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

function processRules(rules) {
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
        (acc, rule, key) => {
            const processedRule = processRule(rule);

            if (!isNil(processedRule)) {
                acc[key] = processedRule;
            }

            return acc;
        },
        {},
    );
}

function useFilterSettings(settings) {
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

    const processValue = useCallback((item) => {
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
                (acc, path) => {
                    let ret = doesMatch(
                        item,
                        processedValue,
                        path,
                        rule.matchMethod,
                    );

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
