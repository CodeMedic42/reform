import React, {
    useRef,
    useCallback,
    useMemo,
    useState,
    useImperativeHandle,
    forwardRef,
} from 'react';
import classnames from 'classnames';
import { isNil, get, toLower, isString, isFunction, isNumber, reduce, map, findIndex, trim, forEach } from 'lodash-es';
import useCollectionContext from '../../../../hooks/use-collection-context/index.js';
import DropDown from '../../../arrangement/drop-down/index.js';
import DropDownList from '../../../arrangement/drop-down/drop-down-list.js';
import Spinner from '../../../display/spinner/index.js';
import buildId from '../../../../common/build-id.js';
import Field from '../field.js';
import preventDefault from '../../../../common/prevent-default.js';
import SelectOption from './select-option.js';
import SelectText from './select-text.js';
import type { FieldMessageData } from '../field-messages.js';

interface SelectProps {
    className?: string | null;
    label?: string | null;
    'aria-label'?: string | null;
    messages?: FieldMessageData | null;
    failure?: boolean;
    hidden?: boolean;
    title?: string | null;
    disabled?: boolean;
    dockRight?: boolean;
    minDrawerWidth?: number | 'anchor';
    placeholder?: string | null;
    Anchor: React.ElementType;
    enableMultiSelect?: boolean;
    anchorProps?: Record<string, unknown>;
    onFocus?: (() => void) | null;
    onBlur?: (() => void) | null;
    id?: string | null;
    'aria-labelledby'?: string | null;
    'aria-describedby'?: string | null;
    size?: string;
    enableFiltering?: boolean | 'internal' | 'external';
    value?: string | number | Array<string | number> | null;
    onSelect?: ((value: unknown) => void) | null;
    enableCustomValues?: boolean | 'sensitive' | 'insensitive';
    selectedLabelPath?: string | ((value: unknown) => string) | null;
    options?: unknown[] | null;
    onFilter?: ((value: string) => void) | null;
    minFilterChar?: number;
    onOpen?: (() => void) | null;
    onClose?: (() => void) | null;
    noOptionsMessage?: string;
    optionSeparator?: boolean;
    emptyFilterMessage?: string;
    enableSorting?: boolean;
    excludeValues?: unknown;
    optionValuePath?: string | ((option: unknown) => string | number) | null;
    optionLabelPath?: string | ((option: unknown) => string | number) | null;
    isFiltering?: boolean;
    isFilteringMessage?: string;
    useFilter?: boolean;
    isMultiSelect?: boolean;
}

function getId(option: unknown, optionValuePath: string | ((option: unknown) => string | number) | null | undefined): string | number | null {
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
        key = (optionValuePath as (option: unknown) => string | number)(option);
    }

    if (isString(key) || isNumber(key)) {
        return key;
    }

    throw new Error('Value must be a string or number');
}

function getOptionText(option: unknown, optionLabelPath: string | ((option: unknown) => string | number) | null | undefined): string | number {
    let text: unknown = option;

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

    if ((isString(text) && (text as string).length > 0) || isNumber(text)) {
        return text as string | number;
    }

    throw new Error('Option label must be an non empty string or number');
}

function beforeInsertOption(option: unknown, optionLabelPath: string | ((option: unknown) => string | number) | null | undefined) {
    return {
        value: option,
        label: getOptionText(option, optionLabelPath),
    };
}

function buildFinalOptions(
    items: any[],
    filterValue: string,
    customValueSetting: string | null,
    filterMatchesValue: boolean,
) {
    let filterMatched = false;

    let checkValue: string = filterValue;
    // TODO: This could be resolved with the same one with buildValueMeta
    // @typescript-eslint/no-unused-vars
    let filterCheck = (_item: any) => false;

    if (customValueSetting === 'sensitive') {
        filterCheck = (item: any) => item.getValue('label') === checkValue;
    } else if (customValueSetting === 'insensitive') {
        checkValue = toLower(filterValue);

        filterCheck = (item: any) => toLower(item.getValue('label')) === checkValue;
    }

    const filteredOptions = reduce(items, (acc: any[], item: any) => {
        const priority = item.getFilterPriority();

        filterMatched = filterMatched || filterCheck(item);

        // TODO this can be moved to the filtering
        if (priority > 0) {
            acc.push(item);
        }

        return acc;
    }, []);

    let customOption: string | null = null;

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

function buildMultiValueByKey(existingValue: Array<string | number> | null, selectedId: string | number) {
    const newValue: Array<string | number> = [];
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
        return null;
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
}: Record<string, unknown>) {
    const props: Record<string, unknown> = {
        ...anchorProps as Record<string, unknown>,
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
function getSelectedText(nextValue: string | number, selectedLabelPath: string | ((value: unknown) => string) | null | undefined, getOptionById: (id: string | number) => any) {
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
            selectedText = (selectedLabelPath as (value: unknown) => string)(nextValue);

            if (!isString(selectedText) || selectedText.length <= 0) {
                throw new Error('selectedText must return a string.');
            }
        } else {
            selectedText = `${nextValue}`;
        }
    }

    const { color: selectedColor } = option ? option.getValue('value') : { color: undefined };

    return {
        selectedText,
        selectedColor,
    };
}

function getCustomValueSetting(enableCustomValues: boolean | 'sensitive' | 'insensitive' | undefined): string | null {
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
function getValueFilterCheck(customValueSetting: string | null, filterTarget: string) {
    if (customValueSetting === 'sensitive') {
        return (value: unknown) => value === filterTarget;
    }

    if (customValueSetting === 'insensitive') {
        const lowerFilter = toLower(filterTarget);

        return (value: unknown) => toLower(value as string) === lowerFilter;
    }

    return () => false;
}

function buildValueMeta(
    value: string | number | Array<string | number> | null,
    filterTarget: string,
    selectedLabelPath: string | ((value: unknown) => string) | null | undefined,
    getOptionById: (id: string | number) => any,
    enableMultiSelect: boolean | undefined,
    customValueSetting: string | null,
) {
    const filterCheck = getValueFilterCheck(customValueSetting, filterTarget);

    let filterMatchesValue = false;
    let selectedText: string | string[] | null = null;
    let selectedColor: string | null = null;
    const selectedLookup: Record<string | number, boolean> = {};

    if (!isNil(value)) {
        if (enableMultiSelect) {
            // If multiselect loop over values
            selectedText = map(value as Array<string | number>, (selectedValue) => {
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
                value as string | number,
                selectedLabelPath,
                getOptionById,
            ));

            selectedLookup[value as string | number] = true;
        }
    }

    return {
        filterMatchesValue,
        selectedText,
        selectedColor,
        selectedLookup,
    };
}

function determineProperTargetIndex(currentTargetIndex: number | null, filteredOptions: any[], customOption: string | null) {
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
    event: React.KeyboardEvent,
    dropDownRef: React.RefObject<any>,
    targetIndex: number | null,
    customOption: string | null,
    selectValue: (id: string | number | null) => void,
    items: any[],
    enableMultiSelect: boolean | undefined,
    dropDownListRef: React.RefObject<any>,
    setTargetIndex: (index: number | null) => void,
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

function renderFiltering(isFilteringMessage: string): React.ReactElement {
    return (
        <SelectText>
            <Spinner size="xs" />
            {isFilteringMessage}
        </SelectText>
    );
}

function renderOptions(
    finalId: string,
    listBoxId: string,
    labelledBy: string,
    customOption: string | null,
    items: any[],
    filterTarget: string,
    noOptionsMessage: string,
    emptyFilterMessage: string,
    targetIndex: number | null,
    optionSeparator: boolean | undefined,
    size: string | undefined,
    enableMultiSelect: boolean | undefined,
    handleSelect: (id: string | number | null) => void,
    dropDownListRef: React.RefObject<any>,
    selectedLookup: Record<string | number, boolean>,
    isFiltering: boolean | undefined,
    isFilteringMessage: string,
) {
    let listItems: React.ReactNode = null;

    let targetedElementId: string | null = null;

    if (isFiltering) {
        listItems = renderFiltering(isFilteringMessage);
    } else if (isNil(customOption) && items.length <= 0) {
        const message = !isNil(filterTarget) && filterTarget.length > 0
            ? noOptionsMessage // 'No results found'
            : emptyFilterMessage; // 'Type a value';

        listItems = <SelectText>{message}</SelectText>;
    } else {
        let customValueElement: React.ReactNode = null;

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
                    optionValue={null as any}
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

function buildContextOptions(
    enableFiltering: boolean | 'internal' | 'external' | undefined,
    enableSorting: boolean | undefined,
    excludeValues: unknown,
    filterTarget: string,
    optionValuePath: string | ((option: unknown) => string | number) | null | undefined,
    optionLabelPath: string | ((option: unknown) => string | number) | null | undefined,
) {
    const sortSettings: { rules: unknown[] } = {
        rules: [],
    };
    const filterSettings: { rules: Record<string, string>; values: Record<string, unknown> } = {
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
        getId: (item: unknown) => getId(item, optionValuePath),
        beforeInsert: (option: unknown) => beforeInsertOption(option, optionLabelPath),
    };
}

function useMemoDeps<T>(cb: (...args: any[]) => T, deps: unknown[]): T {
    return useMemo(() => cb(...deps), deps);
}

const SelectField = forwardRef<unknown, SelectProps>((props, ref) => {
    const {
        className,
        label,
        'aria-label': ariaLabel,
        messages,
        failure,
        hidden,
        title,
        disabled,
        dockRight = false,
        minDrawerWidth = 'anchor',
        placeholder = null,
        Anchor,
        enableMultiSelect = false,
        anchorProps = {},
        onFocus = null,
        onBlur = null,
        id,
        'aria-labelledby': ariaLabelledby,
        'aria-describedby': ariaDescribedby,
        size,
        enableFiltering = false,
        value = null,
        onSelect = null,
        enableCustomValues = false,
        selectedLabelPath = null,
        options = null,
        onFilter = null,
        minFilterChar = 1,
        onOpen = null,
        onClose = null,
        noOptionsMessage = 'No results found',
        optionSeparator = false,
        emptyFilterMessage = 'Type a value',
        enableSorting = false,
        excludeValues,
        optionValuePath = 'value',
        optionLabelPath = 'label',
        isFiltering = false,
        isFilteringMessage = 'Filtering...',
    } = props;

    const dropDownRef = useRef<any>();
    const dropDownListRef = useRef<any>();
    const filterInputRef = useRef<HTMLInputElement>();

    const [filterValue, setFilterValue] = useState('');
    const [filterTarget, setFilterTarget] = useState('');
    const [targetIndexState, setTargetIndex] = useState<number | null>(null);

    const contextOptions = useMemoDeps(
        buildContextOptions,
        [enableFiltering, enableSorting, excludeValues, filterTarget, optionValuePath, optionLabelPath],
    );

    const [items, optionsControls] = useCollectionContext(options ?? [], contextOptions);

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

    const selectValue = useCallback((idToSelect: string | number | null) => {
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
            ? buildMultiValueByKey(value as Array<string | number> | null, selectedId!)
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
        (event: React.KeyboardEvent) => navHandler(
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

    const handleDropDownKeyDown = useCallback((event: React.KeyboardEvent) => {
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

    const changeFilter = useCallback((newFilterValue: string | null) => {
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

    const handleFilterChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        changeFilter(event.target.value);
    }, [changeFilter]);

    const handleOpen = useCallback(() => {
        if (!isNil(onOpen)) {
            onOpen();
        }

        const newTargetIndex = findIndex(
            filteredOptions,
            (item: any) => selectedLookup[item.getId()],
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
        <Field
            className={classnames('ra-select-field ra-drop-down-field', className)}
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
            }: { describedBy: string | null; labelledBy: string; inputId: string; finalId: string }) => {
                const listBoxId = buildId(finalId, 'options-list')!;

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
                        minTrayWidth={minDrawerWidth}
                        onFocus={onFocus ?? undefined}
                        onBlur={onBlur ?? undefined}
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
                                ref={filterInputRef as React.RefObject<HTMLInputElement>}
                                tabIndex={-1}
                                className="ra-dd-list-filter"
                                value={filterValue}
                                onChange={handleFilterChange}
                                onKeyDown={dropdownNavHandler}
                                onClick={preventDefault}
                                size={1}
                                aria-label="List Filter"
                                aria-activedescendant={targetedElementId ?? undefined}
                            />
                        ) : null}
                        {renderedOptions}
                    </DropDown>
                );
            }}
        </Field>
    );
});

export default SelectField;
