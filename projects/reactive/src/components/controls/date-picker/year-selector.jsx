import React, { useMemo } from 'react';
import SelectInput from '../../inputs/select-input';
import PropTypes from '../../../common/prop-types';
import buildId from '../../../common/build-id';

function YearSelector(props) {
    const {
        id,
        year,
        onChange,
        startingYear,
        endingYear,
    } = props;

    const options = useMemo(() => {
        const memoOptions = [];

        for (let yearCounter = endingYear; yearCounter >= startingYear; yearCounter -= 1) {
            memoOptions.push({
                label: `${yearCounter}`,
                value: yearCounter
            });
        }

        return memoOptions;
    }, [startingYear, endingYear]);

    return (
        <SelectInput
            id={buildId(id)}
            className="ra-year-selector"
            value={year}
            onChange={onChange}
            options={options}
            size='sm'
        />
    );
}

YearSelector.propTypes = {
    id: PropTypes.string,
    year: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    startingYear: PropTypes.number,
    endingYear: PropTypes.number,
};

YearSelector.defaultProps = {
    id: null,
    startingYear: 1970,
    endingYear: 2100,
};

export default YearSelector;