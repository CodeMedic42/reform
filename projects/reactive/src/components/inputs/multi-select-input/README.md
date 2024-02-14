# MultiSelectInput

This component provides an input which allows the user to select multiple items from a list.

This component utilizes the [Select](../select/README.md) component and just provides the appropriate anchor. The MultipleSelectInput component expands on the same props from the Select component.

## How to use

```jsx
<MultiSelectInput />
```

## Props

| Property   | Type                 | Required | Default | Description                                                                                                                                                                                                                               |
| ---------- | -------------------- | -------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| value      | [String \|\| Number] | No       | null    | The selected value(s).                                                                                                                                                                                                                    |
| expandable | Bool                 | No       | null    | Normally the component grows to accommodate all the selected items. Setting the component to expandable will shrink the component to the size of a normal input. Then if the hover or focus events happen it will grow to show all items. |
