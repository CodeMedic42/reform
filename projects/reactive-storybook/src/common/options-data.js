import map from 'lodash/map';
import reduce from 'lodash/reduce';

const abbreviated = [
    {
        label: 'Bear Claw',
        value: 'bearClaw',
        selectedText: 'BC',
    },
    {
        label: 'Apple-Crumb',
        value: 'appleCrumb',
        selectedText: 'AC',
    },
    {
        label: 'Jelly',
        value: 'jelly',
        selectedText: 'JL',
    },
    {
        label: 'Powdered',
        value: 'powdered',
        selectedText: 'PD',
    },
    {
        label: 'Glazed',
        value: 'glazed',
        selectedText: 'GL',
    },
    {
        label: 'Cinnamon-Sugar',
        value: 'cinnamonSugar',
        selectedText: 'CS',
    },
    {
        label: 'Blueberry',
        value: 'blueberry',
        selectedText: 'BB',
    },
    {
        label: 'Chocolate Kreme',
        value: 'chocolateKreme',
        selectedText: 'CK',
    },
    {
        label: 'Bavarian Kreme',
        value: 'bavarianKreme',
        selectedText: 'BV',
    },
    {
        label: 'Boston Kreme',
        value: 'bostonKreme',
        selectedText: 'BK',
    },
    {
        label: 'Old-Fashioned',
        value: 'oldFashioned',
        selectedText: 'OF',
    },
    {
        label: 'Sour Cream',
        value: 'sourCream',
        selectedText: 'SC',
    },
    {
        label: 'Cruller',
        value: 'cruller',
        selectedText: 'CR',
    },
    {
        label: 'Chocolate Glazed',
        value: 'chocolateGlazed',
        selectedText: 'CG',
    },
    {
        label: 'Strawberry.Frosted.Creme.Filled.with.Extra.Sprinkles',
        value: 'strawberryFrosted',
        selectedText: 'CG',
    },
];

const options = map(abbreviated, (option) => {
    const { selectedText, ...rest } = option;

    return rest;
});

const labelOnly = map(abbreviated, (option) => {
    const { label } = option;

    return label;
});

const lookUp = reduce(
    abbreviated,
    (acc, option) => {
        acc[option.value] = option;

        return acc;
    },
    {},
);

export {
    options, abbreviated, labelOnly, lookUp,
};
