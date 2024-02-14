import PropTypes from 'prop-types';

PropTypes.icon = PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    icon: PropTypes.arrayOf(PropTypes.any).isRequired,
    prefix: PropTypes.string.isRequired,
    iconName: PropTypes.string.isRequired,
});

export default PropTypes;
