# InputLabel

**Note:** This component is a base component and not expected to be used directly.

This component provides reusable functionality for most standard input fields.

### Features

-   Label element standardization
-   Messages below input
-   Danger class application
-   Hidden functionality
-   Disable functionality
-   Size class application

## How to use

This component requires and expects a callback function provided as a child. This is due to the input label combining together various props to create a final set of props to be used by the input being used.

The following values will be provided.

| Property    | Type   | Description                                                                                                |
| ----------- | ------ | ---------------------------------------------------------------------------------------------------------- |
| describedBy | String | A combined value between what was passed as props and the id of the message block.                         |
| labelledBy  | String | A combined value between what was passed as props and the id of the label element.                         |
| inputId     | String | The id to be used with the input. It is a combination of the passed id prop and additional identification. |
| finalId     | String | The final id of the component. This should be used if other ids need to be derived from the root id.       |

```jsx
<InputLabel>
    {({ describedBy, labelledBy, inputId, finalId }) => {
        ... your control here
    }}
</InputLabel>
```

## Props

| Property         | Type                                                                    | Required | Default | Description                                                                 |
| ---------------- | ----------------------------------------------------------------------- | -------- | ------- | --------------------------------------------------------------------------- |
| id               | String                                                                  | No       | random  | The id to apply to the root element.                                        |
| className        | String                                                                  | No       | null    | Any additional class names provided here will be added to the root element. |
| label            | String                                                                  | No       | null    | A label applied to the control.                                             |
| hidden           | Bool                                                                    | No       | null    | Hides the entire component.                                                 |
| disabled         | Bool                                                                    | No       | null    | Standard disabled attribute.                                                |
| size             | '2xs' \|\| 'xs' \|\| 'sm' \|\| 'md' \|\| 'lg']                          | No       | null    | The size to be used for the control. Affects label size.                    |
| aria-labelledby  | String                                                                  | No       | null    | Any additional labeling needed for accessibility.                           |
| aria-describedby | String                                                                  | No       | null    | Any description needed for accessibility.                                   |
| failure          | Bool                                                                    | No       | null    | Marks the control as failure.                                               |
| messages         | {<br>general: [String],<br>success: [String],<br>failure: [String]<br>} | No       | null    | Any messages to be rendered below the control.                              |
