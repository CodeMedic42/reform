/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import classnames from 'classnames';
import InputAnnotation from './input-annotation';
import PropTypes from '../../../common/prop-types';

function InputContainer(props) {
    const {
        className,
        children,
        leftAnnotation,
        rightAnnotation,
    } = props;

    return (
        <div
            className={classnames('ra-input-container', className)}
        >
            <InputAnnotation annotation={leftAnnotation} />
            <div className="ra-input-content">
                {children}
            </div>
            <InputAnnotation annotation={rightAnnotation} />
        </div>
    );
}

InputContainer.propTypes = {
    className: PropTypes.string,
    leftAnnotation: PropTypes.children,
    rightAnnotation: PropTypes.children,
    children: PropTypes.children,
};

InputContainer.defaultProps = {
    className: null,
    leftAnnotation: null,
    rightAnnotation: null,
    children: null,
};

export default InputContainer;
