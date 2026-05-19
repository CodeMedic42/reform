import Button from '../button.js';

interface Harness {
    id: string;
    Harness: typeof Button;
}

const harness: Harness = {
    id: 'Button',
    Harness: Button,
};

export default harness;
