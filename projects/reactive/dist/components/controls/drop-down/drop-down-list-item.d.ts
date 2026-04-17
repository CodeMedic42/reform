export default DropDownListItem;
/**
 * This component is used the base definition of an item being rendered inside the DropDownList component.
 * @param {*} props
 * @returns
 */
declare function DropDownListItem(props: any): React.JSX.Element;
declare namespace DropDownListItem {
    let propTypes: {
        id: any;
        color: any;
        className: any;
        selected: any;
        targeted: any;
        children: any;
        'aria-label': any;
        borderBottom: any;
        borderTop: any;
        onClick: any;
        preventCloseOnClick: any;
    };
    let defaultProps: {
        id: null;
        className: null;
        color: null;
        children: null;
        'aria-label': null;
        selected: boolean;
        targeted: boolean;
        borderBottom: boolean;
        borderTop: boolean;
        onClick: null;
        preventCloseOnClick: boolean;
    };
}
import React from 'react';
//# sourceMappingURL=drop-down-list-item.d.ts.map