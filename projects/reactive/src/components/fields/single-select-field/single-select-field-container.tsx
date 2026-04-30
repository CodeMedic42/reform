import React, { useCallback } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import IconBox from '../../display/icon-box/index.js';
import { Text } from '../../display/typography/index.js';
import IconButton from '../../display/icon-button/index.js';
import applyAnchorBinding from '../../controls/drop-down/anchor-binding.js';
import changeSize from '../../../util/change-size.js';
import FieldContainer from '../_support/field-container.js';

function prevent(event: React.MouseEvent) {
    event.preventDefault();
}

interface SelectAnchorProps {
    id?: string | null;
    disabled?: boolean;
    'aria-labelledby'?: string | null;
    'aria-describedby'?: string | null;
    title?: string | null;
    open: boolean;
    value?: unknown;
    nullable?: boolean;
    size?: 'sm' | 'md' | 'lg' | null;
    placeholder?: string | null;
    'aria-label'?: string | null;
    listBoxId: string;
    onClear?: ((event?: React.MouseEvent) => void) | null;
}

function SelectAnchor(props: SelectAnchorProps): React.ReactElement {
    const {
        id = null,
        disabled = false,
        'aria-labelledby': labelledBy = null,
        'aria-describedby': describedBy = null,
        title = null,
        open,
        value = null,
        nullable = true,
        size = null,
        placeholder = null,
        'aria-label': ariaLabel = null,
        listBoxId,
        onClear = null,
    } = props;

    const handleClear = useCallback((event: React.MouseEvent) => {
        if (isNil(onClear)) {
            return;
        }

        prevent(event);

        onClear(event);
    }, [onClear]);

    let selectedText = value as string | null;

    if (isNil(selectedText) || (selectedText as string).length <= 0) {
        if (!isNil(placeholder) && placeholder.length > 0) {
            selectedText = placeholder;
        } else {
            selectedText = '';
        }
    }

    const clearButton = (isNil(nullable) || nullable) && !isNil(value) && (value as string).length > 0 ? (
        <IconButton
            className="clear"
            tabIndex="-1"
            icon={faXmark}
            onClick={handleClear}
            onMouseDown={prevent}
            size={changeSize(size ?? 'md', 1) as '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'}
            disabled={disabled}
        />
    ) : null;

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {


        if (
            event.which === 8 // backspace
            || event.which === 46 // delete
        ) {
            if (onClear) {
                onClear();
            }
        };
    }, [onClear]);

    return (
        <FieldContainer
            className={classnames(
                'ra-select-field-container',
                'ra-single-select-field-container',
                `size-${size}`, {
                    focus: open,
                }
            )}
        >
            <div
                className={classnames('ra-anchor-boundary', {
                    focus: open,
                })}
            >
                <button
                    id={id ?? undefined}
                    className={classnames(
                        'anchor-control',
                        'button-anchor',
                        {
                            nullable,
                            focus: open,
                            'has-value': !isNil(value) && (value as string).length > 0,
                        },
                    )}
                    role="combobox"
                    aria-controls={listBoxId}
                    aria-expanded={open}
                    aria-haspopup="listbox"
                    type="button"
                    aria-describedby={describedBy ?? undefined}
                    aria-labelledby={labelledBy ?? undefined}
                    title={title ?? undefined}
                    disabled={disabled}
                    aria-label={ariaLabel ?? undefined}
                    value={!isNil(value) && (value as string).length > 0 ? (value as string) : undefined}
                    onKeyDown={handleKeyDown}
                />
                <div className="anchor-content">
                    <Text
                        className="anchor-selected-item"
                        size={size === 'lg' ? 'xl' : 'lg'}
                    >
                        {selectedText}
                    </Text>
                    <IconBox
                        className="arrow"
                        icon={open ? faAngleUp : faAngleDown}
                        size={changeSize(size ?? 'md', 1) as '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'}
                    />
                    {clearButton}
                </div>
            </div>
        </FieldContainer>
    );
}

export default applyAnchorBinding(SelectAnchor, {
    focusSelector: '.button-anchor',
});
