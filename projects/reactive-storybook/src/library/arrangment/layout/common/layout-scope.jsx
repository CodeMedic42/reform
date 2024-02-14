/* eslint-disable react/prop-types */
import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
// import Scope from '../../../components/scope/index';
import './layout-stories.styles.scss';

function renderColumn(key) {
    return <Column key={key} width="1" className="background-column" />;
}

function renderColumns() {
    const columns = [];

    for (let counter = 0; counter < 12; counter += 1) {
        columns.push(renderColumn(counter));
    }

    return columns;
}

function ColumnBackground() {
    return (
        <div className="background-div">
            <Row className="background-row" gutter="16">
                {renderColumns()}
            </Row>
        </div>
    );
}

function LayoutScope(props) {
    const { children, disableBackground } = props;

    return (
        <div className="layout-story">
            {!disableBackground ? <ColumnBackground /> : null}
            {children}
        </div>
    );
}

export { ColumnBackground };

export default LayoutScope;
