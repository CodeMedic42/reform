import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../../common/prop-types.mjs';
import { schemeColorPropType, getSchemeColorClasses } from '../../../common/color-list.mjs';
import PropTypes from 'prop-types';

class Icon extends PureComponent {
    render() {
        const { className, color, size, icon, ...rest } = this.props;
        if (isNil(icon)) {
            return null;
        }
        const sizeClass = !isNil(size) ? `size-${size}` : size;
        const colorClasses = getSchemeColorClasses({
            color,
        });
        return (React.createElement(FontAwesomeIcon, { className: classnames(className, 'ra-icon', sizeClass, colorClasses), icon: icon, ...rest }));
    }
}
Icon.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.icon.isRequired,
    color: schemeColorPropType,
    size: PropTypes.oneOf(['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']),
};
Icon.defaultProps = {
    className: '',
    size: null,
    color: null,
};

export { Icon as default };
