import classNames from "classnames";
import React from "react";

function StaticContainer(props: { children: React.ReactNode, className?: string }) {
    const {
        children,
        className
    } = props;

    return (
        <div className={classNames('ra-static-container', className)}>
            {children}
        </div>
    );
}

export default StaticContainer;