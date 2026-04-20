import React, { PureComponent } from 'react';
import classnames from 'classnames';

interface ListItemContentProps {
    id?: string | null;
    className?: string | null;
    children?: React.ReactNode;
}

class ListItemContent extends PureComponent<ListItemContentProps> {
    getRootNode(): HTMLElement | null {
        return (this as unknown as { buttonRef: React.RefObject<HTMLElement> }).buttonRef.current;
    }

    render(): React.ReactNode {
        const { id = null, className = null, children = null } = this.props;

        return (
            <span
                id={id ?? undefined}
                className={classnames('ra-dd-list-item-content', className)}
            >
                {children}
            </span>
        );
    }
}

export default ListItemContent;
