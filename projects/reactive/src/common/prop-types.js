import PropTypes from 'prop-types';

PropTypes.icon = PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    icon: PropTypes.arrayOf(PropTypes.any).isRequired,
    prefix: PropTypes.string.isRequired,
    iconName: PropTypes.string.isRequired,
});

PropTypes.children = PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
]);

PropTypes.Component = PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]);

PropTypes.inputMessages = PropTypes.shape({
    general: PropTypes.arrayOf(PropTypes.string),
    success: PropTypes.arrayOf(PropTypes.string),
    failure: PropTypes.arrayOf(PropTypes.string),
});

export default PropTypes;
