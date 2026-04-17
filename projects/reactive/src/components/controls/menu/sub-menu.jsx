import React, { PureComponent, createRef } from 'react';
import classnames from 'classnames';
import { isNil, isString, map, isArray, join } from 'lodash-es';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';
import ListItemButton from '../drop-down/list-item-button.js';
import Tray from '../../arrangement/tray/index.js';
import MenuList from './menu-list.js';
import Icon from '../../display/icon/index.js';
import Provider, { ApplyConsumer } from '../drop-down/drop-down-context.js';
import PropTypes from '../../../common/prop-types.js';
import MenuItem from './menu-item.js';
import CheckInput from '../../fields/check-input-field/index.js';
import buildId from '../../../common/build-id.js';

function preventDefault({ event }) {
    event.preventDefault();
}

function getString(content) {
    if (isString(content)) {
        return content;
    }

    const { children } = content.props;

    if (!isArray(children)) {
        return getString(children);
    }

    const text = map(children, getString);

    return join(text, ' ');
}

class SubMenu extends PureComponent {
    static propTypes = {
        id: PropTypes.string,
        className: PropTypes.string,
        icon: PropTypes.icon,
        content: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node),
        ]),
        children: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node),
        ]),
        onClick: PropTypes.func,
        'aria-label': PropTypes.string,
        // eslint-disable-next-line react/forbid-prop-types
        onClickMeta: PropTypes.any,
        selected: PropTypes.bool,
        targeted: PropTypes.bool,
        disabled: PropTypes.bool,
        dropDownContext: PropTypes.shape({
            open: PropTypes.bool.isRequired,
            size: PropTypes.string.isRequired,
            dark: PropTypes.bool.isRequired,
        }).isRequired,
        borderBottom: PropTypes.bool,
        borderTop: PropTypes.bool,
        checkbox: PropTypes.shape({
            onChange: PropTypes.func.isRequired,
            value: PropTypes.bool,
            disabled: PropTypes.bool,
            variant: PropTypes.oneOf(['check', 'indeterminate']),
        }),
    };

    static defaultProps = {
        id: null,
        className: null,
        children: null,
        onClick: null,
        onClickMeta: null,
        selected: false,
        targeted: false,
        disabled: false,
        icon: null,
        content: null,
        borderBottom: false,
        borderTop: false,
        checkbox: null,
        'aria-label': null,
    };

    constructor(props) {
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
    static getDerivedStateFromProps(nextProps) {
        const {
            dropDownContext: { open },
        } = nextProps;

        if (!open) {
            return {
                open: false,
            };
        }

        return null;
    }

    handleMouseEnter() {
        this.setOpen(true);
    }

    handleMouseLeave() {
        this.setOpen(false);
    }

    handleClick({ event }) {
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

    setOpen(to) {
        const { children } = this.props;

        const { open } = this.state;

        if (open === to || isNil(children)) {
            return;
        }

        this.setState({
            open: to,
        });
    }

    isOpen() {
        const { open } = this.state;

        return open;
    }

    renderCheckBox() {
        const {
            id, checkbox, 'aria-label': ariaLabel, content,
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

    render() {
        const {
            id,
            className,
            children,
            selected,
            targeted,
            disabled,
            dropDownContext: { size, dark },
            borderBottom,
            borderTop,
            checkbox,
            content,
            icon,
            'aria-label': ariaLabel,
        } = this.props;

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
                        id={!isNil(id) && id.length > 0 ? `${id}-drawer` : null}
                        open={open}
                        getAnchorElement={() => this.itemRef.current.getRootNode()}
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
