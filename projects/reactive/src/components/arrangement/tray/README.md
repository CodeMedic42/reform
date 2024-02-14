# Tray

This component is used to create any kind of flyout menu. It can be anchored to any element. It can be positioned to the left, right, top or bottom and the order in which these are chosen can be controlled.

## Use

```jsx
<Tray>
    ... Your tray contents here
<Tray>
```

## Props

| Property           | Type                                                                       | Required | Default                            | Description                                                                                            |
| ------------------ | -------------------------------------------------------------------------- | -------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| id                 | String                                                                     | No       | null                               | The id to apply to the root element                                                                    |
| className          | String                                                                     | No       | null                               | Any additional class names provide here will be added to the button                                    |
| open               | Bool                                                                       | No       | false                              | Will show the tray.                                                                                    |
| dropPositions      | Array of ['top', 'bottom', 'left', 'right']                                | No       | ['bottom', 'top', 'right', 'left'] | Sets the order the tray attempts to open to.                                                           |
| getAnchorElement   | Func                                                                       | Yes      | --                                 | A function used to request the element which the tray should be anchored to.                           |
| onClick            | Func                                                                       | No       | null                               | A function called when a click event happens anywhere in the tray.                                     |
| parentPadding      | Number                                                                     | No       | 0                                  | The padding between the parent and the tray.                                                           |
| onContainedFocus   | Func                                                                       | No       | null                               | A function called when any element inside the tray gains focus                                         |
| onContainedBlur    | Func                                                                       | No       | null                               | A function called when any element inside the tray loses focus.                                        |
| minWidth           | 'anchor' \|\| Number                                                       | No       | null                               | The min width px the tray should adhere to. If 'anchor' is used then the width of the anchor is used.  |
| maxWidth           | 'anchor' \|\| Number                                                       | No       | null                               | The max width px the tray should adhere to. If 'anchor' is used then the width of the anchor is used.  |
| maxHeight          | Number                                                                     | No       | null                               | The max height px the tray should adhere to. If 'anchor' is used then the width of the anchor is used. |
| offset             | { <br>left: Number,<br>right: Number,<br>top: Number,<br>bottom: Number, } | No       | null                               | An offset used when positioning the tray.                                                              |
| horizontallyCenter | Bool                                                                       | No       | false                              | Will position the tray horizontally to the anchor.                                                     |
| dockRight          | Bool                                                                       | No       | false                              | If when positioning on the top or bottom will position the tray starting from the right of the anchor  |
| enableTail         | Bool                                                                       | No       | false                              | Renders a tail onto the tray which points towards the anchor.                                          |
