import React, { useMemo } from 'react';
import SelectInput from '../../fields/select-input-field/index.js';
import buildId from '../../../common/build-id.js';

interface YearSelectorProps {
    id?: string | null;
    year: number;
    onChange: (value: string | number | null) => void;
    startingYear?: number;
    endingYear?: number;
}

function YearSelector(props: YearSelectorProps): React.ReactNode {
    const {
        id = null,
        year,
        onChange,
        startingYear = 1970,
        endingYear = 2100,
    } = props;

    const options = useMemo(() => {
        const memoOptions: Array<{ label: string; value: number }> = [];

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
            id={buildId(id, 'year')}
            className="ra-year-selector"
            value={year}
            onChange={onChange}
            options={options}
            size='sm'
        />
    );
}

export default YearSelector;
