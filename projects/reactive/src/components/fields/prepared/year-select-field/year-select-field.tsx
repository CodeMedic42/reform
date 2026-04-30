import React, { useMemo } from 'react';
import SelectField from '../../single-select-field/index.js';
import buildId from '../../../../common/build-id.js';

interface YearSelectFieldProps {
    id?: string | null;
    value: number | null;
    onChange: (value: number | null) => void;
    startingYear?: number;
    endingYear?: number;
}

function YearSelectField(props: YearSelectFieldProps): React.ReactNode {
    const {
        id = null,
        value: year,
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
        <SelectField
            id={buildId(id, 'year')}
            className="ra-year-select-field"
            value={year}
            onChange={onChange}
            options={options}
            size='sm'
        />
    );
}

export default YearSelectField;
