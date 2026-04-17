export default IconBox;
declare class IconBox extends React.PureComponent<any, any, any> {
    static propTypes: {
        id: any;
        className: any;
        style: any;
        'aria-label': any;
        title: any;
        icon: any;
        size: any;
        color: any;
        hidden: any;
        alignToIcon: any;
    };
    static defaultProps: {
        id: string;
        className: string;
        style: null;
        'aria-label': null;
        title: null;
        size: string;
        color: null;
        hidden: boolean;
        alignToIcon: boolean;
    };
    constructor(props: any);
    constructor(props: any, context: any);
    render(): React.JSX.Element;
}
import React from 'react';
//# sourceMappingURL=icon-box.d.ts.map