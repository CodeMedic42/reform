/* eslint-disable jsx-a11y/anchor-has-content */
import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import { ApplyConsumer } from './drop-down-context';
import buildId from '../../../common/build-id';
import ListItemContent from './list-item-content';

class ListItemLink extends PureComponent {
    static propTypes = {
        id: PropTypes.string,
        className: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node),
        ]),
        onClick: PropTypes.func,
        'aria-label': PropTypes.string,
        tabIndex: PropTypes.string,
        disabled: PropTypes.bool,
        dropDownContext: PropTypes.shape({
            open: PropTypes.bool.isRequired,
        }).isRequired,
        href: PropTypes.string,
    };

    static defaultProps = {
        id: null,
        className: null,
        children: null,
        onClick: null,
        'aria-label': null,
        tabIndex: null,
        disabled: false,
        href: null,
    };

    constructor(props) {
        super(props);

        this.ref = createRef();

        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleClick(event) {
        const { onClick } = this.props;

        if (isNil(onClick)) {
            return;
        }

        onClick(event);
    }

    handleKeyDown(event) {
        // Treat enter key presses as clicks
        if (event.which === 13) {
            this.handleClick(event);
        }
    }

    getRootNode() {
        return this.ref.current;
    }

    render() {
        const {
            id,
            className,
            'aria-label': ariaLabel,
            tabIndex,
            children,
            disabled,
            dropDownContext: { open },
            href,
        } = this.props;

        const textId = buildId(id, 'text');

        return (
            <>
                <a
                    id={!isNil(id) ? `${id}-button` : null}
                    className={classnames(
                        'ra-dd-list-item-control',
                        'ra-dd-list-item-link',
                        className,
                    )}
                    ref={this.ref}
                    onClick={this.handleClick}
                    onKeyDown={this.handleKeyDown}
                    aria-label={ariaLabel}
                    tabIndex={open ? tabIndex : -1}
                    disabled={disabled}
                    href={href}
                    aria-labelledby={textId}
                >
                    {ariaLabel}
                </a>
                <ListItemContent id={textId}>{children}</ListItemContent>
            </>
        );
    }
}

export default ApplyConsumer(ListItemLink);
