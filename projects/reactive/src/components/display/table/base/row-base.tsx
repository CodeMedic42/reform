import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';

export interface RowClickEvent {
    event: React.MouseEvent<HTMLTableRowElement>;
    meta: unknown;
}

interface RowBaseProps {
    className?: string | null;
    active?: boolean;
    onClick?: ((event: RowClickEvent) => void) | null;
    onClickMeta?: unknown;
    children?: React.ReactNode;
}

class RowBase extends PureComponent<RowBaseProps> {
    constructor(props: RowBaseProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event: React.MouseEvent<HTMLTableRowElement>) {
        const { onClick, onClickMeta } = this.props;

        if (isNil(onClick)) {
            return;
        }

        onClick({
            event,
            meta: onClickMeta,
        });
    }

    render() {
        const { children = null, active = false, className = null } = this.props;

        return (
            <tr
                className={classnames(className, { active })}
                onClick={this.handleClick}
            >
                {children}
            </tr>
        );
    }
}

export default RowBase;
