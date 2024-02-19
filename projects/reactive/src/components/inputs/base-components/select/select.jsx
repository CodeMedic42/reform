/* eslint-disable max-len */
import React, {
    useRef,
    useCallback,
    useMemo,
    useState,
    useImperativeHandle,
    forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import get from 'lodash/get';
import toLower from 'lodash/toLower';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import reduce from 'lodash/reduce';
import map from 'lodash/map';
import findIndex from 'lodash/findIndex';
import trim from 'lodash/trim';
import forEach from 'lodash/forEach';
import useCollectionContext from '../../../../hooks/use-collection-context/index';
import DropDown from '../../../controls/drop-down/index';
import DropDownList from '../../../controls/drop-down/drop-down-list';
import Spinner from '../../../display/spinner/index';
import buildId from '../../../../common/build-id';
import InputLabel from '../../new-base/input-label';
import preventDefault from '../../../../common/prevent-default';
import SelectOption from './select-option';
import SelectText from './select-text';

function getId(option, optionValuePath) {
    if (isNil(option)) {
        return null;
    }

    if (isString(option) || isNumber(option)) {
        return option;
    }

    if (isNil(optionValuePath)) {
        throw new Error(
            'optionValuePath is required when not using strings for values.',
        );
    }

    let key = null;

    if (isString(optionValuePath)) {
        if (optionValuePath.length <= 0) {
            throw new Error('optionValuePath cannot be empty.');
        }

        key = get(option, optionValuePath);
    } else {
        key = optionValuePath(option);
    }

    if (isString(key) || isNumber(key)) {
        return key;
    }

    throw new Error('Value must be a string or number');
}

function getOptionText(option, optionLabelPath) {
    let text = option;

    if (!isString(option) && !isNumber(option)) {
        if (isNil(optionLabelPath)) {
            throw new Error(
                'optionLabelPath is required when not using strings for options.',
            );
        }

        if (isString(optionLabelPath)) {
            if (optionLabelPath.length <= 0) {
                throw new Error('optionLabelPath cannot be empty.');
            }

            text = get(option, optionLabelPath);
        }
    }

    if (isFunction(optionLabelPath)) {
        text = optionLabelPath(option);
    }

    if ((isString(text) && text.length > 0) || isNumber(text)) {
        return text;
    }

    throw new Error('Option label must be an non empty string or number');
}

function beforeInsertOption(option, optionLabelPath) {
    return {
        value: option,
        label: getOptionText(option, optionLabelPath),
    };
}

function buildFinalOptions(
    items,
    filterValue,
    customValueSetting,
    filterMatchesValue,
) {
    let filterMatched = false;

    let checkValue = filterValue;
    // TODO: This could be resolved with the same one with buildValueMeta
    let filterCheck = () => false;

    if (customValueSetting === 'sensitive') {
        filterCheck = (item) => item.getValue('label') === checkValue;
    } else if (customValueSetting === 'insensitive') {
        checkValue = toLower(filterValue);

        filterCheck = (item) => toLower(item.getValue('label')) === checkValue;
    }

    const filteredOptions = reduce(items, (acc, item) => {
        const priority = item.getFilterPriority();

        filterMatched = filterMatched || filterCheck(item);

        // TODO this can be moved to the filtering
        if (priority > 0) {
            acc.push(item);
        }

        return acc;
    }, []);

    let customOption = null;

    if (
        !isNil(customValueSetting)
        && !filterMatched
        && !isNil(filterValue)
        && filterValue.length > 0
        && !filterMatchesValue
    ) {
        customOption = filterValue;
    }

    return {
        customOption,
        filteredOptions,
    };
}

function buildMultiValueByKey(existingValue, selectedId) {
    let newValue = [];
    let didRemove = false;

    forEach(existingValue, (item) => {
        if (item !== selectedId) {
            newValue.push(item);
        } else {
            didRemove = true;
        }
    });

    if (!didRemove) {
        newValue.push(selectedId);
    }

    if (newValue.length <= 0) {
        newValue = null;
    }

    return newValue;
}

function buildAnchorProps({
    anchorProps,
    id,
    color,
    value,
    title,
    describedBy,
    labelledBy,
    disabled,
    size,
    placeholder,
    ariaLabel,
    listBoxId,
}) {
    const props = {
        ...anchorProps,
        id,
        value,
        title,
        'aria-describedby': describedBy,
        'aria-labelledby': labelledBy,
        disabled,
        size,
        placeholder,
        'aria-label': ariaLabel,
        listBoxId,
    };

    if (!isNil(color)) {
        props.color = color;
    }

    return props;
}

/**
 * Returns the text to display in the dropdown anchor for the given value.
 * NOTE: This function has a side effect of adding a 'selected' tag to the
 * selected option.
 */
function getSelectedText(nextValue, selectedLabelPath, getOptionById) {
    let selectedText = '';

    // Get the option for this item
    const option = getOptionById(nextValue);

    if (!isNil(option)) {
        if (isNil(selectedLabelPath)) {
            selectedText = option.getValue('label');
        } else if (isString(selectedLabelPath) && selectedLabelPath.length > 0) {
            selectedText = get(option.getValue('value'), selectedLabelPath);
        }
    }

    if (selectedText.length <= 0) {
        if (isFunction(selectedLabelPath)) {
            selectedText = selectedLabelPath(nextValue);

            if (!isString(selectedText) || selectedText.length <= 0) {
                throw new Error('selectedText must return a string.');
            }
        } else {
            selectedText = `${nextValue}`;
        }
    }

    const { color: selectedColor } = option ? option.getValue('value') : {};

    return {
        selectedText,
        selectedColor,
    };
}

function getCustomValueSetting(enableCustomValues) {
    if (!isNil(enableCustomValues)) {
        if (enableCustomValues === true) {
            return 'sensitive';
        }

        if (enableCustomValues !== false) {
            return enableCustomValues;
        }
    }

    return null;
}

/*
* Returns a function which will compare the selected value to the filter.
*/
function getValueFilterCheck(customValueSetting, filterTarget) {
    if (customValueSetting === 'sensitive') {
        return (value) => value === filterTarget;
    }

    if (customValueSetting === 'insensitive') {
        const lowerFilter = toLower(filterTarget);

        return (value) => toLower(value) === lowerFilter;
    }

    return () => false;
}

function buildValueMeta(value, filterTarget, selectedLabelPath, getOptionById, enableMultiSelect, customValueSetting) {
    const filterCheck = getValueFilterCheck(customValueSetting, filterTarget);

    let filterMatchesValue = false;
    let selectedText = null;
    let selectedColor = null;
    const selectedLookup = {};

    if (!isNil(value)) {
        if (enableMultiSelect) {
            // If multiselect loop over values
            selectedText = map(value, (selectedValue) => {
                // Check to see if the typed filter value matches the value. If it does then
                // The filter value will not be allowed to be a custom value if that is enabled.
                filterMatchesValue = filterMatchesValue || filterCheck(selectedValue);

                const { selectedText: selectedTextItem } = getSelectedText(
                    selectedValue,
                    selectedLabelPath,
                    getOptionById,
                );

                selectedLookup[selectedValue] = true;

                return selectedTextItem;
            });
        } else {
            // Check to see if the typed filter value matches the value. If it does then
            // The filter value will not be allowed to be a custom value if that is enabled.
            filterMatchesValue = filterCheck(value);

            ({ selectedText, selectedColor } = getSelectedText(
                value,
                selectedLabelPath,
                getOptionById,
            ));

            selectedLookup[value] = true;
        }
    }

    return {
        filterMatchesValue,
        selectedText,
        selectedColor,
        selectedLookup,
    };
}

function determineProperTargetIndex(currentTargetIndex, filteredOptions, customOption) {
    if (filteredOptions.length <= 0) {
        if (!isNil(customOption)) {
            return 0;
        }

        return null;
    }

    if (isNil(currentTargetIndex)) {
        return 0;
    }

    if (!isNil(customOption)) {
        if (currentTargetIndex >= filteredOptions.length + 1) {
            // TODO: Something does not seem right here. Why the - 1?
            return filteredOptions.length - 1;
        }
    } else if (currentTargetIndex >= filteredOptions.length) {
        return filteredOptions.length - 1;
    }

    return currentTargetIndex;
}

function navHandler(
    event,
    dropDownRef,
    targetIndex,
    customOption,
    selectValue,
    items,
    enableMultiSelect,
    dropDownListRef,
    setTargetIndex,
) {
    if (event.which === 27) {
        // Escape
        // Close the tray.
        dropDownRef.current.setOpen(false);

        return true;
    }

    if (event.which === 13) {
        // Enter
        // Select the current target item
        if (!isNil(targetIndex)) {
            let finalTargetIndex = targetIndex;

            if (!isNil(customOption)) {
                if (targetIndex === 0) {
                    selectValue(null);

                    return true;
                }

                finalTargetIndex = targetIndex - 1;
            }

            const item = items[finalTargetIndex];
            selectValue(item.getId());
        }

        if (isNil(targetIndex) || enableMultiSelect) {
            // This will prevent the dropdowns natural tendency to close the tray on enter/return.
            event.preventDefault();
        }

        return true;
    }

    if (
        event.which === 40 // down arrow
        || event.which === 38 // up arrow
    ) {
        // Move the targetIndex
        const maxIndex = isNil(customOption)
            ? items.length - 1
            : items.length;

        if (maxIndex <= 0) {
            return false;
        }

        let newIndex = targetIndex;

        if (event.which === 40) {
            // Down Arrow
            // If at the end of the list then move to the top
            if (isNil(newIndex) || newIndex >= maxIndex) {
                newIndex = 0;
            } else {
                newIndex += 1;
            }
        } else if (event.which === 38) {
            // Up Arrow
            // If at the beginning of the list then move to the bottom
            if (isNil(newIndex) || newIndex <= 0) {
                newIndex = maxIndex;
            } else {
                newIndex -= 1;
            }
        }

        dropDownListRef.current.scrollToIndex(newIndex);

        setTargetIndex(newIndex);

        // This "should" prevent the arrow keys from scrolling the page.
        event.preventDefault();

        return true;
    }

    return false;
}

function renderFiltering(isFilteringMessage) {
    return (
        <SelectText>
            <Spinner size="xs" />
            {isFilteringMessage}
        </SelectText>
    );
}

function renderOptions(
    finalId,
    listBoxId,
    labelledBy,
    customOption,
    items,
    filterTarget,
    noOptionsMessage,
    emptyFilterMessage,
    targetIndex,
    optionSeparator,
    size,
    enableMultiSelect,
    handleSelect,
    dropDownListRef,
    selectedLookup,
    isFiltering,
    isFilteringMessage,
) {
    let listItems = null;

    let targetedElementId = null;

    if (isFiltering) {
        listItems = renderFiltering(isFilteringMessage);
    } else if (isNil(customOption) && items.length <= 0) {
        const message = !isNil(filterTarget) && filterTarget.length > 0
            ? noOptionsMessage // 'No results found'
            : emptyFilterMessage; // 'Type a value';

        listItems = <SelectText>{message}</SelectText>;
    } else {
        let customValueElement = null;

        if (!isNil(customOption)) {
            const customId = buildId(finalId, '$__custom__$');
            const customIsTarget = targetIndex === 0;

            if (customIsTarget) {
                targetedElementId = customId;
            }

            customValueElement = (
                <SelectOption
                    id={customId}
                    targeted={customIsTarget}
                    borderBottom={optionSeparator && items.length > 0}
                    onClick={handleSelect}
                    optionValue={null}
                >
                    {customOption}
                </SelectOption>
            );
        }

        listItems = (
            <>
                {customValueElement}
                {map(items, (item, idx) => {
                    const data = item.getValue();
                    const {
                        value: { color },
                    } = data;
                    const itemId = item.getId();
                    const selected = selectedLookup[item.getId()] === true;

                    const shiftIndex = !isNil(customValueElement)
                        ? idx + 1
                        : idx;

                    const optionId = buildId(finalId, itemId);
                    const optionIsTarget = shiftIndex === targetIndex;

                    if (optionIsTarget) {
                        targetedElementId = optionId;
                    }

                    return (
                        <SelectOption
                            key={itemId}
                            color={color}
                            id={optionId}
                            aria-label={data['aria-label']}
                            selected={selected}
                            targeted={optionIsTarget}
                            borderBottom={
                                optionSeparator && idx + 1 < items.length
                            }
                            onClick={handleSelect}
                            optionValue={itemId}
                        >
                            {data.label}
                        </SelectOption>
                    );
                })}
            </>
        );
    }

    return {
        options: (
            <DropDownList
                ref={dropDownListRef}
                id={listBoxId}
                size={size}
                aria-labelledby={labelledBy}
                aria-multiselectable={enableMultiSelect}
            >
                {listItems}
            </DropDownList>
        ),
        targetedElementId,
    };
}

function buildContextOptions(enableFiltering, enableSorting, excludeValues, filterTarget, optionValuePath, optionLabelPath) {
    const sortSettings = {
        rules: [],
    };
    const filterSettings = {
        rules: {},
        values: {},
    };

    if (!isNil(excludeValues)) {
        filterSettings.rules.valueFilter = 'value';

        filterSettings.values.valueFilter = excludeValues;
    }

    if (enableFiltering) {
        sortSettings.rules.push({ type: 'filter', order: 'desc' });

        filterSettings.rules.labelFilter = 'label';

        filterSettings.values.labelFilter = filterTarget;
    }

    if (enableSorting) {
        sortSettings.rules.push('label');
    }

    return {
        sortSettings,
        filterSettings,
        getId: (item) => getId(item, optionValuePath),
        beforeInsert: (option) => beforeInsertOption(option, optionLabelPath),
    };
}

function useMemoDeps(cb, deps) {
    return useMemo(() => cb(...deps), deps);
}

const Select = forwardRef((props, ref) => {
    const {
        className,
        label,
        'aria-label': ariaLabel,
        messages,
        failure,
        hidden,
        title,
        disabled,
        dockRight,
        minDrawerWidth,
        placeholder,
        Anchor,
        enableMultiSelect,
        anchorProps,
        onFocus,
        onBlur,
        id,
        'aria-labelledby': ariaLabelledby,
        'aria-describedby': ariaDescribedby,
        size,
        enableFiltering,
        value,
        onSelect,
        enableCustomValues,
        selectedLabelPath,
        options,
        onFilter,
        minFilterChar,
        onOpen,
        onClose,
        noOptionsMessage,
        optionSeparator,
        emptyFilterMessage,
        enableSorting,
        excludeValues,
        optionValuePath,
        optionLabelPath,
        isFiltering,
        isFilteringMessage,
    } = props;

    const dropDownRef = useRef();
    const dropDownListRef = useRef();
    const filterInputRef = useRef();

    const [filterValue, setFilterValue] = useState('');
    const [filterTarget, setFilterTarget] = useState('');
    const [targetIndexState, setTargetIndex] = useState(null);

    const contextOptions = useMemoDeps(
        buildContextOptions,
        [enableFiltering, enableSorting, excludeValues, filterTarget, optionValuePath, optionLabelPath],
    );

    const [items, optionsControls] = useCollectionContext(options, contextOptions);

    const { getById: getOptionById } = optionsControls;

    const customValueSetting = getCustomValueSetting(enableCustomValues);

    // Build Meta data about the selectedValue(s)
    const {
        filterMatchesValue, selectedText, selectedColor, selectedLookup,
    } = useMemoDeps(
        buildValueMeta,
        [value, filterTarget, selectedLabelPath, getOptionById, enableMultiSelect, customValueSetting],
    );

    // build meta data about the options
    const { filteredOptions, customOption } = useMemoDeps(
        buildFinalOptions,
        [items, filterTarget, customValueSetting, filterMatchesValue],
    );

    const targetIndex = useMemoDeps(determineProperTargetIndex, [targetIndexState, filteredOptions, customOption]);

    const selectValue = useCallback((idToSelect) => {
        if (isNil(onSelect)) {
            return;
        }

        let selectedId = idToSelect;

        // TODO: I think this can be improved by moving the following code into navHandler as it appears to be the only one needing this logic.
        if (isNil(idToSelect)) {
            if (isNil(customOption)) {
                return;
            }

            selectedId = customOption;
        }

        const newValue = enableMultiSelect
            ? buildMultiValueByKey(value, selectedId)
            : selectedId;

        if (
            enableMultiSelect
            && enableFiltering
            && filterInputRef
            && filterInputRef.current
        ) {
            // Focus the filter after a multi select selection to allow the
            // up and down arrow keys to continue to work.
            filterInputRef.current.focus();
        }

        onSelect(newValue);
    }, [value, onSelect, customOption, enableFiltering, enableMultiSelect]);

    // Handle keyboard navigation and selection inside a dropdown list.
    // Return true if the keyboard event was handled.
    const dropdownNavHandler = useCallback(
        (event) => navHandler(
            event,
            dropDownRef,
            targetIndex,
            customOption,
            selectValue,
            filteredOptions,
            enableMultiSelect,
            dropDownListRef,
            setTargetIndex,
        ),
        [targetIndex, customOption, selectValue, filteredOptions, enableMultiSelect],
    );

    const handleDropDownKeyDown = useCallback((event) => {
        const isOpen = dropDownRef.current.isOpen();

        // If not using the filter handle item selection and up/down
        // events when focused on an open dropdown. Otherwise handle
        // them when focused on the filter.
        if (!enableFiltering && isOpen) {
            dropdownNavHandler(event);
        }

        if (isOpen) {
            // If the tray is open then ignore this event.
            // When the tray is open the control exists with the filter input.
            return;
        }

        if (
            event.which === 40 // down arrow
            || event.which === 38 // up arrow
        ) {
            // Here the DropDown will open the tray.
            return;
        }

        if (
            event.which === 9 // Tab
            || event.which === 16 // Shift
            || event.which === 27 // escape
            || event.which === 20 // caps-lock
            || event.which === 17 // ctrl
            || event.which === 18 // option
            || event.metaKey // Things like the command key on Mac
            || event.which === 13 // enter
        ) {
            // Just ignore tab or shift because this is
            // moving the user around the page with the keyboard.

            // Escape should not do anything

            // Enter should be handled by the dropdown while it is closed.
            return;
        }

        if (
            event.which === 8 // backspace
            || event.which === 46 // delete
        ) {
            // In most cases this control is managed by the anchor.
            // Here the tray is closed and the dropdown button should have focus.
            // This means we want to clear the value.

            return;
        }

        // and then focus the filter input.
        if (enableFiltering && filterInputRef && filterInputRef.current) {
            dropDownRef.current.setOpen(true);

            filterInputRef.current.focus();
        }
    }, [
        enableFiltering,
        dropdownNavHandler
    ]);

    const changeFilter = useCallback((newFilterValue) => {
        const nextFilterValue = !isNil(newFilterValue) ? trim(newFilterValue) : '';

        setFilterValue(nextFilterValue);

        const filterChar = minFilterChar > 0 ? minFilterChar : 1;

        const nextFilterTarget = nextFilterValue.length >= filterChar ? nextFilterValue : '';

        if (nextFilterTarget !== filterTarget) {
            setFilterTarget(nextFilterTarget);
            setTargetIndex(0);

            if (!isNil(onFilter)) {
                onFilter(nextFilterTarget);
            }
        }
    }, [minFilterChar, onFilter, filterTarget]);

    const handleFilterChange = useCallback((event) => {
        changeFilter(event.target.value);
    }, [changeFilter]);

    const handleOpen = useCallback(() => {
        if (!isNil(onOpen)) {
            onOpen();
        }

        const newTargetIndex = findIndex(
            filteredOptions,
            (item) => selectedLookup[item.getId()],
        );

        setTargetIndex(newTargetIndex >= 0 ? newTargetIndex : 0);

        // This timeout is here because if you focus too quickly it
        // does not give the tray enough time to render and move.
        // If we do not wait then the browser will quickly scroll
        // to the drawer away from the select.
        setTimeout(() => {
            if (
                enableFiltering
                && filterInputRef
                && filterInputRef.current
            ) {
                filterInputRef.current.focus();
            }

            dropDownListRef.current.scrollToIndex(newTargetIndex);
        }, 1);
    }, [onOpen, enableFiltering, selectedLookup, filteredOptions]);

    const handleClose = useCallback(() => {
        if (enableFiltering) {
            changeFilter('');
        }

        if (!isNil(onClose)) {
            onClose();
        }
    }, [enableFiltering, onClose, changeFilter]);

    useImperativeHandle(ref, () => ({
        focus: () => dropDownRef.current.focus(),
    }));

    return (
        <InputLabel
            className={classnames('ra-drop-down-input', className)}
            id={id}
            label={label}
            messages={messages}
            failure={failure}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            hidden={hidden}
            disabled={disabled}
            size={size}
        >
            {({
                describedBy, labelledBy, inputId, finalId,
            }) => {
                const listBoxId = buildId(finalId, 'options-list');

                const { options: renderedOptions, targetedElementId } = renderOptions(
                    finalId,
                    listBoxId,
                    labelledBy,
                    customOption,
                    filteredOptions,
                    filterTarget,
                    noOptionsMessage,
                    emptyFilterMessage,
                    targetIndex,
                    optionSeparator,
                    size,
                    enableMultiSelect,
                    selectValue,
                    dropDownListRef,
                    selectedLookup,
                    isFiltering,
                    isFilteringMessage,
                );

                return (
                    <DropDown
                        ref={dropDownRef}
                        id={`${finalId}-drop-down`}
                        className={classnames('ra-select')}
                        trayClassName={classnames(
                            'ra-select-tray',
                            `size-${size}`,
                        )}
                        disabled={disabled}
                        minDrawerWidth={minDrawerWidth}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        maxTrayHeight={216}
                        onKeyDown={handleDropDownKeyDown}
                        onOpen={handleOpen}
                        onClose={handleClose}
                        closeTrayOnClick={!enableMultiSelect}
                        Anchor={Anchor}
                        anchorProps={buildAnchorProps({
                            id: inputId,
                            color: selectedColor,
                            value: selectedText,
                            title,
                            describedBy,
                            labelledBy,
                            disabled,
                            size,
                            placeholder,
                            ariaLabel,
                            anchorProps,
                            listBoxId,
                        })}
                        dockRight={dockRight}
                    >
                        {enableFiltering ? (
                            <input
                                ref={filterInputRef}
                                tabIndex="-1"
                                className="ra-dd-list-filter"
                                value={filterValue}
                                onChange={handleFilterChange}
                                onKeyDown={dropdownNavHandler}
                                onClick={preventDefault}
                                size="1"
                                aria-label="List Filter"
                                aria-activedescendant={targetedElementId}
                            />
                        ) : null}
                        {renderedOptions}
                    </DropDown>
                );
            }}
        </InputLabel>
    );
});

const valueType = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ),
]);

Select.propTypes = {
    value: valueType,
    Anchor: PropTypes.elementType.isRequired,
    enableFiltering: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['internal', 'external'])]),
    enableMultiSelect: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    anchorProps: PropTypes.objectOf(PropTypes.any),
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    // eslint-disable-next-line react/forbid-prop-types
    options: PropTypes.arrayOf(PropTypes.any),
    placeholder: PropTypes.string,
    title: PropTypes.string,
    'aria-label': PropTypes.string,
    minFilterChar: PropTypes.number,
    disabled: PropTypes.bool,
    optionSeparator: PropTypes.bool,
    dockRight: PropTypes.bool,
    minDrawerWidth: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.oneOf(['anchor']),
    ]),
    enableCustomValues: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.oneOf(['sensitive', 'insensitive']),
    ]),
    noOptionsMessage: PropTypes.string,
    emptyFilterMessage: PropTypes.string,
    enableSorting: PropTypes.bool,
    selectedLabelPath: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    // eslint-disable-next-line react/no-unused-prop-types
    optionValuePath: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    // eslint-disable-next-line react/no-unused-prop-types
    optionLabelPath: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    onSelect: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onFilter: PropTypes.func,
    isFiltering: PropTypes.bool,
    isFilteringMessage: PropTypes.string,
};

Select.defaultProps = {
    value: null, //
    enableFiltering: false, //
    enableMultiSelect: false, //
    anchorProps: {},
    onOpen: null, //
    onClose: null, //
    placeholder: null, //
    title: null,
    'aria-label': null,
    minFilterChar: 1, //
    disabled: false, //
    optionSeparator: false, //
    dockRight: false,
    minDrawerWidth: 'anchor',
    enableCustomValues: false, //
    options: null, //
    noOptionsMessage: 'No results found', //
    emptyFilterMessage: 'Type a value', //
    enableSorting: false, //
    selectedLabelPath: null, //
    optionLabelPath: 'label', //
    optionValuePath: 'value', //
    onSelect: null, //
    onFocus: null, //
    onBlur: null, //
    onFilter: null, //
    isFiltering: false,
    isFilteringMessage: 'Filtering...',
};

export default Select;

const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Anchor,
    ...exportPropTypes
    // eslint-disable-next-line react/forbid-foreign-prop-types
} = Select.propTypes;

const exportDefaultProps = Select.defaultProps;

export { exportPropTypes as propTypes, exportDefaultProps as defaultProps };
