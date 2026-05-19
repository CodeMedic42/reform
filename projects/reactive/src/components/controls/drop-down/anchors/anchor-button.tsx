import React, { PureComponent } from 'react';
import classnames from 'classnames';
import Button from '../../button/index.js';
import applyAnchorBinding from '../anchor-binding.js';

interface AnchorButtonProps {
    className?: string | null;
    open: boolean;
    children?: React.ReactNode;
}

class AnchorButton extends PureComponent<AnchorButtonProps> {
    render(): React.ReactNode {
        const {
            className = null, open, children = null, ...rest
        } = this.props;

        return (
            <Button
                {...rest}
                className={classnames(className, {
                    focus: open,
                })}
                type="button"
            >
                {children}
            </Button>
        );
    }
}

export default applyAnchorBinding(AnchorButton);
