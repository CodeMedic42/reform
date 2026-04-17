import React from 'react';
import IncrementClass from "./increment-class";
import IncrementHook from "./increment-hook";

function Page(): React.ReactElement {
    return (
        <div>
            <IncrementHook />
            <IncrementClass />
        </div>
    );
}

export default Page;
