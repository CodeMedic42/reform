import React, { PureComponent, createRef } from 'react';
import classnames from 'classnames';
import { isNil, isString, map, isArray, join } from 'lodash-es';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';
import ListItemButton from '../drop-down/list-item-button.js';
import Tray from '../../arrangement/tray/index.js';
import MenuList from './menu-list.js';
import Icon from '../../display/icon/index.js';
import Provider, { ApplyConsumer } from '../drop-down/drop-down-context.js';
import MenuItem from './menu-item.js';
import CheckInput from '../../fields/check-input-field/index.js';
import buildId from '../../../common/build-id.js';

interface CheckboxConfig {
    onChange: (value: boolean) => void;
    value?: boolean;
    disabled?: boolean;
    variant?: 'check' | 'indeterminate';
}

interface SubMenuProps {
    id?: string | null;
    className?: string | null;
    icon?: IconProp | null;
    content?: React.ReactNode;
    children?: React.ReactNode;
    onClick?: ((payload: { event: React.MouseEvent; meta: unknown }) => void) | null;
    'aria-label'?: string | null;
    onClickMeta?: unknown | null;
    selected?: boolean;
    targeted?: boolean;
    disabled?: boolean;
    dropDownContext?: {
        open: boolean;
        size: string;
        dark: boolean;
    };
    borderBottom?: boolean;
    borderTop?: boolean;
    checkbox?: CheckboxConfig | null;
}

interface SubMenuState {
    open: boolean;
}

function preventDefault({ event }: { event: React.MouseEvent }): void {
    event.preventDefault();
}

function getString(content: unknown): string {
    if (isString(content)) {
        return content;
    }

    const { children } = (content as React.ReactElement).props;

    if (!isArray(children)) {
        return getString(children);
    }

    const text = map(children, getString);

    return join(text, ' ');
}

class SubMenu extends PureComponent<SubMenuProps, SubMenuState> {
    private itemRef: React.RefObject<unknown>;

    constructor(props: SubMenuProps) {
        super(props);

        this.itemRef = createRef();

        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleClick = this.handleClick.bind(this);

        this.state = {
            open: false,
        };
    }

    // This will close the menu if it's parent is closed
    static getDerivedStateFromProps(nextProps: SubMenuProps): Partial<SubMenuState> | null {
        const {
            dropDownContext = { open: false, size: 'md', dark: false },
        } = nextProps;
        const { open } = dropDownContext;

        if (!open) {
            return {
                open: false,
            };
        }

        return null;
    }

    handleMouseEnter(): void {
        this.setOpen(true);
    }

    handleMouseLeave(): void {
        this.setOpen(false);
    }

    handleClick({ event }: { event: React.MouseEvent }): void {
        const { children, onClick, onClickMeta } = this.props;

        const { open } = this.state;

        if (event.defaultPrevented) {
            return;
        }

        if (!isNil(children) && isNil(onClick)) {
            event.preventDefault();

            this.setOpen(!open);
        }

        if (!isNil(onClick)) {
            onClick({
                event,
                meta: onClickMeta,
            });
        }
    }

    setOpen(to: boolean): void {
        const { children } = this.props;

        const { open } = this.state;

        if (open === to || isNil(children)) {
            return;
        }

        this.setState({
            open: to,
        });
    }

    isOpen(): boolean {
        const { open } = this.state;

        return open;
    }

    renderCheckBox(): React.ReactNode {
        const {
            id = null, checkbox = null, 'aria-label': ariaLabel = null, content = null,
        } = this.props;

        if (isNil(checkbox)) {
            return null;
        }

        return (
            <CheckInput
                key="check"
                id={buildId(id, 'check')}
                className="menu-checkbox-control"
                color="secondary"
                size="sm"
                value={checkbox.value}
                onChange={checkbox.onChange}
                disabled={checkbox.disabled}
                onClick={preventDefault}
                variant={checkbox.variant}
                aria-label={`${
                    !isNil(ariaLabel) ? ariaLabel : content
                } Checkbox`}
            />
        );
    }

    render(): React.ReactNode {
        const {
            id = null,
            className = null,
            children = null,
            selected = false,
            targeted = false,
            disabled = false,
            dropDownContext = { open: false, size: 'md' as string, dark: false },
            borderBottom = false,
            borderTop = false,
            checkbox = null,
            content = null,
            icon = null,
            'aria-label': ariaLabel = null,
        } = this.props;

        const { size, dark } = dropDownContext;
        const { open } = this.state;

        return (
            <MenuItem
                id={id}
                className={classnames('sub-menu', 'menu-button', className, {
                    'menu-checkbox': !isNil(checkbox),
                })}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                selected={selected}
                targeted={targeted}
                borderBottom={borderBottom}
                borderTop={borderTop}
            >
                <ListItemButton
                    disabled={disabled}
                    ref={this.itemRef}
                    onClick={this.handleClick}
                    aria-label={
                        !isNil(ariaLabel) ? ariaLabel : getString(content)
                    }
                >
                    {this.renderCheckBox()}
                    {!isNil(icon) ? (
                        <Icon className="menu-icon" icon={icon} />
                    ) : null}
                    {content}
                    <Icon className="menu-arrow" icon={faCaretRight} />
                </ListItemButton>
                <Provider value={{ open, size, dark }}>
                    <Tray
                        id={!isNil(id) && id.length > 0 ? `${id}-drawer` : undefined}
                        open={open}
                        getAnchor={() => (this.itemRef.current as { getRootNode: () => HTMLElement }).getRootNode()}
                        dropPositions={['right', 'left', 'bottom', 'top']}
                        offset={{
                            top: -8,
                            bottom: -8,
                        }}
                        maxWidth={320}
                    >
                        <MenuList size={size} dark={dark}>
                            {children}
                        </MenuList>
                    </Tray>
                </Provider>
            </MenuItem>
        );
    }
}

export default ApplyConsumer(SubMenu);
