# Tasks

## New Features

## Updates

## Bugs

- Checkbox field styles are not working correctly. The component was not copied over correctly.
- Multi select field is not rendering correctly.

## Testing

- Migrate old SingleSelectField tests from web-unit/jest-cucumber to the new Vitest Browser Mode system
  - Port `select-input-props.feature` scenarios
  - Port `select-input-functionality.feature` scenarios
  - Update step definitions to use shared test-utils
- Write new component tests (components without any tests):
  - `display/spinner`
  - `display/icon`
  - `display/icon-box`
  - `display/icon-button`
  - `controls/drop-down`
  - `controls/menu`
  - `controls/tag`
  - `controls/date-picker`
  - `fields/textarea-field`
  - `fields/numeric-field`
  - `fields/check-input-field`
  - `fields/single-select-field` (expand beyond migrated old tests)
  - `fields/multi-select-input-field`
  - `fields/select-text-input-field`
  - `fields/date-single-select-field`
  - `fields/date-range-select-field`
  - `arrangement/tray`
  - `arrangement/tab-bar`
  - `arrangement/layout`
  - `arrangement/scaling-container`
  - `arrangement/infinite-list`
  - `form` components
- Remove old web-unit/jest test infrastructure once migration is complete:
  - Remove `@reformjs/web-unit` and `@reformjs/web-unit-jest` from devDependencies
  - Remove `jest`, `jest-cucumber`, `jest-puppeteer`, `ts-jest` from devDependencies
  - Remove `jest.config.cjs`
  - Delete old test harness files (e.g., `button.harness.tsx`, `select-input.harness.tsx`)
  - Delete old step definition files under `single-select-field/tests/`
  - Delete `button.testold.tsx`

## Clean Up

- Rename old "scheme" naming convention to "interactive" convention. The following remnants need to be updated:
  - `sch-br` CSS class in `src/common/color-list.ts`
  - `sch-control` CSS class in `src/components/display/icon-button/icon-button.tsx`
  - `sch-opaque` CSS class in `src/components/display/icon-button/icon-button.tsx`
  - `sch-check-{color}` CSS class in `src/components/fields/check-input-field/check-input-field.tsx`
  - `SchemeColor` type in `src/common/color-list.ts`
  - `getSchemeColorClasses` function in `src/common/color-list.ts`
  - `SchemeColorClassesOptions` interface in `src/common/color-list.ts`
  - `schemeColorOrder` constant in `src/common/color-list.ts`
  - `InteractiveScheme` type in `src/config/types.ts`
  - `schemes` property in `ConfigState.interactiveDesigns` in `src/config/types.ts`
  - `*Scheme` variable names in `src/config/defaults.ts`
  - "scheme" references in SCSS comments in `src/styles/configuration/interactive-designs/index.scss`
  - "scheme" references in `src/styles/configuration/CONFIGURATION.md`
  - Old test file references in `src/components/controls/button/button.testold.tsx`
  - All component files importing `SchemeColor`/`getSchemeColorClasses` from `color-list.ts`
