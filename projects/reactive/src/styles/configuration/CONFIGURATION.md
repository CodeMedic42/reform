# Reactive Style Configuration Reference

All configuration variables use the `!default` flag, meaning they can be overridden by defining the variable before importing the library.

```scss
// Override a variable
$--ra-config-default-font-size: 14px;

// Then import the library
@import '@reformjs/reactive/dist/styles/scss/index.scss';
```

Import order in `index.scss`: palette, base, interactive-designs, inputs, tabs, layout, button.

---

## Palette Colors

**File:** `palette.scss`

Defines color palettes used by components like the spinner. Each palette is a map of 9 shades (100-900). Six colors ship as defaults; each can be overridden individually, and custom colors can be added.

### Default Color Variables

Each variable is a map with keys `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900` mapping to hex color values.

| Variable | Default Base Color (500) |
|----------|--------------------------|
| `$--ra-config-palette-color-blue` | `#0d6efd` |
| `$--ra-config-palette-color-purple` | `#6f42c1` |
| `$--ra-config-palette-color-green` | `#198754` |
| `$--ra-config-palette-color-yellow` | `#ffc107` |
| `$--ra-config-palette-color-orange` | `#fd7e14` |
| `$--ra-config-palette-color-red` | `#dc3545` |

### Map Structure

```scss
$--ra-config-palette-color-blue: (
    100: #cfe2ff,
    200: #9ec5fe,
    300: #6ea8fe,
    400: #3d8bfd,
    500: #0d6efd,
    600: #0a58ca,
    700: #084298,
    800: #052c65,
    900: #031633,
) !default;
```

### Overriding a Default Color

Define the variable before importing the library. Only the overridden color changes; all others keep their defaults.

```scss
$--ra-config-palette-color-red: (
    100: #fde8e8,
    200: #fbd1d1,
    300: #f9a8a8,
    400: #f47272,
    500: #e02424,
    600: #c81e1e,
    700: #9b1c1c,
    800: #771d1d,
    900: #5a1a1a,
);
```

### Adding Custom Colors

Use `$--ra-config-palette-colors-custom` to add new palette colors. These are merged with the defaults.

```scss
$--ra-config-palette-colors-custom: (
    "indigo": (
        100: #e0cffc,
        200: #c29ffa,
        300: #a370f7,
        400: #8540f5,
        500: #6610f2,
        600: #520dc2,
        700: #3d0a91,
        800: #290a61,
        900: #140530,
    ),
    "teal": (
        100: #d2f4ea,
        200: #a6e9d5,
        300: #79dfc1,
        400: #4dd4ac,
        500: #20c997,
        600: #1aa179,
        700: #13795b,
        800: #0d503c,
        900: #06281e,
    ),
);
```

### Derived Variable

`$--ra-config-palette-colors` is the final merged map of all palette colors (defaults + custom). It is not intended to be overridden directly. Components iterate over this map to generate CSS classes and styles.

### Generated Output

For each color in the map, the system generates:

- A CSS class `.ra-clr-plt-{name}` with custom properties `--clr-plt-100` through `--clr-plt-900`
- A spinner color variant via the `.color-{name}` class (using shades 700 and 100)

---

## Base Typography

**File:** `base.scss`

| Variable | Default | Purpose |
|----------|---------|---------|
| `$--ra-config-default-font-size` | `16px` | Base font size |
| `$--ra-config-default-font-weight` | `400` | Default font weight |

---

## Interactive Designs

**File:** `interactive-designs/index.scss` and individual color files.

Defines color schemes for interactive components (buttons, links, etc.). Each scheme has a base variant and a fill variant, and each variant defines colors for five states: default, hover, focus, active, disabled.

### Global Settings

| Variable | Default | Purpose |
|----------|---------|---------|
| `$--ra-config-interactive-designs` | `'fill'` | Active design variant |

### Grayscale Colors

Defined in `interactive-designs/index.scss`. All have `!default`.

| Variable | Default | Description |
|----------|---------|-------------|
| `$--clr-g-0` | `#fff` | White |
| `$--clr-g-2` | `#fafafa` | |
| `$--clr-g-4` | `#f5f5f5` | |
| `$--clr-g-5` | `#f2f2f2` | |
| `$--clr-g-10` | `#e6e6e6` | |
| `$--clr-g-11` | `#e2e2e2` | |
| `$--clr-g-12` | `#dfdfdf` | |
| `$--clr-g-13` | `#d9d9d9` | |
| `$--clr-g-20` | `#cccccc` | |
| `$--clr-g-30` | `#b3b3b3` | |
| `$--clr-g-40` | `#999999` | |
| `$--clr-g-50` | `#808080` | |
| `$--clr-g-60` | `#666666` | |
| `$--clr-g-70` | `#4d4d4d` | |
| `$--clr-g-80` | `#333333` | |
| `$--clr-g-90` | `#1a1a1a` | |
| `$--clr-g-100` | `#000` | Black |
| `$--clr-white` | `#fff` | |
| `$--clr-black` | `#000` | |
| `$--clr-transparent` | `transparent` | |

### Color Schemes

Seven schemes are defined, each in its own file: `default.scss`, `primary.scss`, `secondary.scss`, `info.scss`, `success.scss`, `warn.scss`, `danger.scss`.

Each scheme defines three variables:

| Variable Pattern | Purpose |
|------------------|---------|
| `$--ra-config-interactive-color-{name}-base` | Outlined/text style variant |
| `$--ra-config-interactive-color-{name}-fill` | Solid/filled style variant |
| `$--ra-config-interactive-color-{name}` | Combined map with `""` and `"fill"` keys |

### Scheme Map Structure

Each base or fill map contains 20 properties covering 5 states with 4 properties each:

```scss
$--ra-config-interactive-color-primary-base: (
    // Default state
    "clr": rgb(13, 110, 253),      // text color
    "bg": transparent,              // background
    "br": rgb(13, 110, 253),        // border color
    "out": transparent,             // outline color

    // Hover state
    "hover-clr": ...,
    "hover-bg": ...,
    "hover-br": ...,
    "hover-out": ...,

    // Focus state
    "focus-clr": ...,
    "focus-bg": ...,
    "focus-br": ...,
    "focus-out": ...,

    // Active state
    "active-clr": ...,
    "active-bg": ...,
    "active-br": ...,
    "active-out": ...,

    // Disabled state
    "disabled-clr": ...,
    "disabled-bg": ...,
    "disabled-br": ...,
    "disabled-out": ...,
) !default;
```

### Available Schemes

| Scheme | Base Color | File |
|--------|------------|------|
| default | `#212529` | `default.scss` |
| primary | `rgb(13, 110, 253)` | `primary.scss` |
| secondary | `#6c757d` | `secondary.scss` |
| info | `#0dcaf0` | `info.scss` |
| success | `#198754` | `success.scss` |
| warn | `#ffc107` | `warn.scss` |
| danger | `#dc3545` | `danger.scss` |

### Assembled Map

The seven default schemes plus any custom schemes are merged into `$--ra-config-interactive-colors`:

```scss
$--ra-config-interactive-colors-custom: () !default;

$--ra-config-interactive-colors: map.merge((
    "primary": $--ra-config-interactive-color-primary,
    "secondary": $--ra-config-interactive-color-secondary,
    "info": $--ra-config-interactive-color-info,
    "success": $--ra-config-interactive-color-success,
    "warn": $--ra-config-interactive-color-warn,
    "danger": $--ra-config-interactive-color-danger,
), $--ra-config-interactive-colors-custom);
```

### Overriding an Existing Scheme

Override the individual scheme variable before importing the library. Only the overridden scheme changes; all others keep their defaults.

```scss
// Override the primary color to use a custom blue
$--ra-config-interactive-color-primary-base: (
    "clr": #1a5fb4,
    "bg": transparent,
    "br": transparent,
    "out": transparent,

    "hover-clr": #164d94,
    "hover-bg": transparent,
    "hover-br": transparent,
    "hover-out": transparent,

    "focus-clr": #164d94,
    "focus-bg": transparent,
    "focus-br": transparent,
    "focus-out": transparent,

    "active-clr": #123f78,
    "active-bg": transparent,
    "active-br": transparent,
    "active-out": transparent,
);

$--ra-config-interactive-color-primary-fill: (
    "clr": #fff,
    "bg": #1a5fb4,
    "br": #1a5fb4,
    "out": transparent,

    "hover-clr": #fff,
    "hover-bg": #164d94,
    "hover-br": #164d94,
    "hover-out": transparent,

    "focus-clr": #fff,
    "focus-bg": #164d94,
    "focus-br": #164d94,
    "focus-out": rgba(26, 95, 180, 0.5),

    "active-clr": #fff,
    "active-bg": #123f78,
    "active-br": #123f78,
    "active-out": transparent,
);

$--ra-config-interactive-color-primary: (
    "": $--ra-config-interactive-color-primary-base,
    "fill": $--ra-config-interactive-color-primary-fill,
);

@import '@reformjs/reactive/dist/styles/scss/index.scss';
```

### Adding a New Scheme

Use `$--ra-config-interactive-colors-custom` to add new interactive color schemes. These are merged with the defaults.

```scss
$--ra-config-interactive-colors-custom: (
    "tertiary": (
        "": (
            "clr": #0d6b3d,
            "bg": transparent,
            "br": transparent,
            "out": transparent,

            "hover-clr": #0b5a33,
            "hover-bg": transparent,
            "hover-br": transparent,
            "hover-out": transparent,

            "focus-clr": #0b5a33,
            "focus-bg": transparent,
            "focus-br": transparent,
            "focus-out": transparent,

            "active-clr": #094a2a,
            "active-bg": transparent,
            "active-br": transparent,
            "active-out": transparent,
        ),
        "fill": (
            "clr": #fff,
            "bg": #0d6b3d,
            "br": #0d6b3d,
            "out": transparent,

            "hover-clr": #fff,
            "hover-bg": #0b5a33,
            "hover-br": #0b5a33,
            "hover-out": transparent,

            "focus-clr": #fff,
            "focus-bg": #0b5a33,
            "focus-br": #0b5a33,
            "focus-out": rgba(13, 107, 61, 0.5),

            "active-clr": #fff,
            "active-bg": #094a2a,
            "active-br": #094a2a,
            "active-out": transparent,
        ),
    ),
);

@import '@reformjs/reactive/dist/styles/scss/index.scss';
```

### Generated Output

For each color in `$--ra-config-interactive-colors`, the system generates:

- A CSS class `.ra-clr-int.ra-clr-int-{name}` with CSS custom properties for each design variant
- State-based styles (hover, focus, active, disabled) applied via `.ra-clr-int-control`
- The default scheme is applied to `:root`

---

## Inputs

**File:** `inputs/index.scss`, `inputs/input-container.scss`

### General Input Settings

| Variable | Default | Purpose |
|----------|---------|---------|
| `$--ra-config-inputs-focus-color` | `#0870f5` | Focus highlight color |
| `$--ra-config-inputs-border-radius` | `5px` | Input border radius |
| `$--ra-config-inputs-border-width` | `1px` | Default border width |
| `$--ra-config-inputs-focused-border-width` | `2px` | Border width when focused |

### Input Container Default Variant

`$--ra-config-inputs-container-default-variant` is a map:

| Key | Default | Purpose |
|-----|---------|---------|
| `height` | `40px` | Container height |
| `padding-h` | `12px` | Horizontal padding |
| `padding-v` | `0` | Vertical padding |
| `font-size` | `16px` | Font size |
| `font-weight` | `400` | Font weight |
| `line-height` | `24px` | Line height |
| `background-color` | `#fff` | Background color |
| `border-width` | `1px` | Border width |
| `focus-outline-width` | `1px` | Focus outline width |

### Input Container Variants

`$--ra-config-inputs-container-variants` is an empty map by default. Add named variants with the same key structure as the default variant.

---

## Tabs

**File:** `tabs.scss`

### Base Tab Styling

| Variable | Default | Purpose |
|----------|---------|---------|
| `$--ra-config-tab-corner-style` | `'rounded-ends'` | Corner appearance style |
| `$--ra-config-tab-inner-border` | `none` | Inner border |
| `$--ra-config-tab-outer-border` | `none` | Outer border |
| `$--ra-config-tab-border-radius` | `10px` | Border radius |
| `$--ra-config-tab-text-color` | `#333333` | Text color |
| `$--ra-config-tab-bg-color` | `#D9D9D9` | Background color |
| `$--ra-config-tab-vertical-padding` | `8px` | Vertical padding |
| `$--ra-config-tab-horizontal-padding` | `16px` | Horizontal padding |
| `$--ra-config-tab-font-size` | `12px` | Font size |
| `$--ra-config-tab-font-weight` | `500` | Font weight |
| `$--ra-config-tab-line-height` | `14px` | Line height |

### Active Tab Overrides

All default to `null` (inherits base value) unless noted.

| Variable | Default | Purpose |
|----------|---------|---------|
| `$--ra-config-tab-active-text-color` | `null` | Active text color |
| `$--ra-config-tab-active-bg-color` | `#F2F2F2` | Active background |
| `$--ra-config-tab-active-vertical-padding` | `null` | Active vertical padding |
| `$--ra-config-tab-active-horizontal-padding` | `null` | Active horizontal padding |
| `$--ra-config-tab-active-font-size` | `null` | Active font size |
| `$--ra-config-tab-active-font-weight` | `null` | Active font weight |
| `$--ra-config-tab-active-line-height` | `null` | Active line height |

### Disabled Tab Overrides

| Variable | Default | Purpose |
|----------|---------|---------|
| `$--ra-config-tab-disabled-text-color` | `#999999` | Disabled text color |
| `$--ra-config-tab-disabled-bg-color` | `#E2E2E2` | Disabled background |
| `$--ra-config-tab-disabled-vertical-padding` | `null` | Disabled vertical padding |
| `$--ra-config-tab-disabled-horizontal-padding` | `null` | Disabled horizontal padding |
| `$--ra-config-tab-disabled-font-size` | `null` | Disabled font size |
| `$--ra-config-tab-disabled-font-weight` | `null` | Disabled font weight |
| `$--ra-config-tab-disabled-line-height` | `null` | Disabled line height |

### Tab Bottom Content Area

| Variable | Default | Purpose |
|----------|---------|---------|
| `$--ra-config-tab-bottom-bg-color` | `#F2F2F2` | Content area background |
| `$--ra-config-tab-bottom-padding-top` | `40px` | Top padding |
| `$--ra-config-tab-bottom-padding-bottom` | `40px` | Bottom padding |
| `$--ra-config-tab-bottom-padding-left` | `24px` | Left padding |
| `$--ra-config-tab-bottom-padding-right` | `24px` | Right padding |
| `$--ra-config-tab-bottom-border-radius` | `10px` | Content area border radius |

---

## Layout

**File:** `layout.scss`

| Variable | Default | Purpose |
|----------|---------|---------|
| `$-ra-config-resp-breakpoints` | `600px, 992px, 1200px, 1800px` | Responsive breakpoint list (any number of breakpoints supported) |
| `$-ra-config-tablet-resp-breakpoint` | `null` | Tablet breakpoint value. Set to a breakpoint value (e.g. `992px`) to enable tablet-specific styles. |
| `$-ra-config-desktop-resp-breakpoint` | `null` | Desktop breakpoint value. Set to a breakpoint value (e.g. `1200px`) to enable desktop-specific styles. |

---

## Button

**File:** `button.scss`

### Default Variant

`$--ra-config-button-default-variant` is a map:

| Key | Default | Purpose |
|-----|---------|---------|
| `padding-v` | `6px` | Vertical padding |
| `padding-h` | `12px` | Horizontal padding |
| `border-radius` | `6px` | Border radius |
| `font-size` | `16px` | Font size |
| `font-weight` | `400` | Font weight |
| `line-height` | `24px` | Line height |

### Additional Variants

`$--ra-config-button-variants` is an empty map by default. Add named variants using the same key structure:

```scss
$--ra-config-button-variants: (
    "sm": (
        "padding-v": 3px,
        "padding-h": 10px,
        "border-radius": 5px,
        "font-size": 14px,
        "font-weight": 500,
        "line-height": 16px,
    ),
);
```

Optional additional key for variants: `min-width`.
