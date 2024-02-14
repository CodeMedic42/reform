// import isNil from 'lodash/isNil';
// import get from 'lodash/get';
// import toLower from 'lodash/toLower';
// import isString from 'lodash/isString';
// import isFunction from 'lodash/isFunction';
// import isNumber from 'lodash/isNumber';
// import reduce from 'lodash/reduce';

// export function getId(option, optionValuePath) {
//     if (isNil(option)) {
//         return null;
//     }

//     if (isString(option) || isNumber(option)) {
//         return option;
//     }

//     if (isNil(optionValuePath)) {
//         throw new Error(
//             'optionValuePath is required when not using strings for values.',
//         );
//     }

//     let key = null;

//     if (isString(optionValuePath)) {
//         if (optionValuePath.length <= 0) {
//             throw new Error('optionValuePath cannot be empty.');
//         }

//         key = get(option, optionValuePath);
//     } else {
//         key = optionValuePath(option);
//     }

//     if (isString(key) || isNumber(key)) {
//         return key;
//     }

//     throw new Error('Value must be a string or number');
// }

// export function getOptionText(option, optionLabelPath) {
//     let text = option;

//     if (!isString(option) && !isNumber(option)) {
//         if (isNil(optionLabelPath)) {
//             throw new Error(
//                 'optionLabelPath is required when not using strings for options.',
//             );
//         }

//         if (isString(optionLabelPath)) {
//             if (optionLabelPath.length <= 0) {
//                 throw new Error('optionLabelPath cannot be empty.');
//             }

//             text = get(option, optionLabelPath);
//         }
//     }

//     if (isFunction(optionLabelPath)) {
//         text = optionLabelPath(option);
//     }

//     if ((isString(text) && text.length > 0) || isNumber(text)) {
//         return text;
//     }

//     throw new Error('Option label must be an non empty string or number');
// }

// export function beforeInsertOption(option, optionLabelPath) {
//     return {
//         value: option,
//         label: getOptionText(option, optionLabelPath),
//     };
// }

// export function buildFinalOptions(
//     items,
//     filterValue,
//     customValueSetting,
//     filterMatchesValue,
// ) {
//     let filterMatched = false;

//     let checkValue = filterValue;
//     // TODO: This could be resolved with the same one with buildValueMeta
//     let filterCheck = () => false;

//     if (customValueSetting === 'sensitive') {
//         filterCheck = (item) => item.getValue('label') === checkValue;
//     } else if (customValueSetting === 'insensitive') {
//         checkValue = toLower(filterValue);

//         filterCheck = (item) => toLower(item.getValue('label')) === checkValue;
//     }

//     const filteredOptions = reduce(items, (acc, item) => {
//         const priority = item.getFilterPriority();

//         filterMatched = filterMatched || filterCheck(item);

//         // TODO this can be moved to the filtering
//         if (priority > 0) {
//             acc.push(item);
//         }

//         return acc;
//     }, []);

//     let customOption = null;

//     if (
//         !isNil(customValueSetting)
//         && !filterMatched
//         && !isNil(filterValue)
//         && filterValue.length > 0
//         && !filterMatchesValue
//     ) {
//         customOption = filterValue;
//     }

//     return {
//         customOption,
//         filteredOptions,
//     };
// }
