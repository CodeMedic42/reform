export default function buildLabeledControlProps({ id, label, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, messages, }: {
    id: any;
    label: any;
    "aria-label": any;
    "aria-labelledby": any;
    "aria-describedby": any;
    messages: any;
}): {
    inputId: string;
    labelId: string | null;
    descriptionId: string;
    labelledBy: string;
    describedBy: string | null;
    ariaLabel: any;
} | null;
//# sourceMappingURL=build-labeled-control-props.d.ts.map