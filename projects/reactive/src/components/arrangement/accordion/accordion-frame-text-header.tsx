import React from 'react';
import classNames from 'classnames';

interface AccordionFrameTextHeaderProps extends React.HTMLAttributes<HTMLSpanElement> {
    text?: string,
    className?: string,
}

function AccordionFrameTextHeader(props: AccordionFrameTextHeaderProps) {
    const { text, className, ...rest } = props;

    return (
        <span className={classNames(className, 'ra-accordion-frame-text-header')} {...rest}>
            {text}
        </span>
    );
}

export default AccordionFrameTextHeader;    