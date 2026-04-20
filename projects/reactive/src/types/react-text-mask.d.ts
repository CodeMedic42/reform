declare module 'react-text-mask' {
    import React from 'react';

    type Mask = (string | RegExp)[] | ((value: string) => (string | RegExp)[]);

    interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
        mask: Mask;
        guide?: boolean;
        placeholderChar?: string;
        keepCharPositions?: boolean;
        pipe?: (
            conformedValue: string,
            config: Record<string, unknown>,
        ) => string | false | { value: string; indexesOfPipedChars: number[] };
        showMask?: boolean;
        render?: (ref: (inputElement: HTMLInputElement) => void, props: Record<string, unknown>) => React.ReactNode;
    }

    const MaskedInput: React.ForwardRefExoticComponent<MaskedInputProps & React.RefAttributes<unknown>>;
    export default MaskedInput;
}
