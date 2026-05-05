# Reactive Component Testing System

## Overview

Components in `@reformjs/reactive` are tested in a **real browser** using Vitest Browser Mode with Playwright. Tests are written in **BDD/Gherkin** style using `.feature` files and step definitions via `@amiceli/vitest-cucumber`.

This approach means CSS is actually rendered, computed styles work, and interactions (click, keyboard) behave exactly as they do in production — unlike jsdom-based test environments.

## Running Tests

```bash
# From projects/reactive/
pnpm test              # Run all tests once
npx vitest run         # Same thing
npx vitest             # Watch mode
npx vitest run --reporter=verbose   # See individual step results
```

Test results are also written to `./test-results.json` (JSON format) after each run.

## Tech Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Test runner | Vitest | Runs tests, reporting, config |
| Browser | `@vitest/browser` + `@vitest/browser-playwright` | Executes tests in real Chromium |
| React rendering | `vitest-browser-react/pure` | Mounts components in the browser DOM |
| BDD/Gherkin | `@amiceli/vitest-cucumber` (browser entry) | Feature file parsing, step matching |
| CSS/SCSS | Vite native pipeline | Styles are processed and rendered in the browser |

## Configuration

- **Vitest config**: `projects/reactive/vitest.config.ts`
- **Browser**: Chromium via Playwright
- **Screenshots on failure**: Saved to `./test-screenshots/`
- **Playwright traces**: Retained on failure (in `__traces__/` near test files)
- **JSON results**: Written to `./test-results.json`

## Project Structure

```
projects/reactive/
├── vitest.config.ts                    # Vitest browser mode config
├── test-results.json                   # Generated JSON report
├── test-screenshots/                   # Generated failure screenshots
└── src/
    ├── test-utils/                     # Shared test infrastructure
    │   ├── index.ts                    # Barrel export
    │   ├── harness.tsx                 # HarnessControl — render/rerender/query
    │   ├── base.steps.ts              # Shared Given/When/Then step definitions
    │   └── attribute.steps.ts         # Shared attribute assertion steps
    └── components/
        └── <category>/<component>/
            └── tests/
                ├── <component>.feature     # Gherkin scenarios
                └── <component>.test.tsx    # Step definitions + test wiring
```

## How to Write a New Component Test

### Step 1: Create the feature file

Create `tests/<component>.feature` inside the component directory:

```gherkin
Feature: MyComponent

Scenario: Verify default className
    Given the component is rendered with defaults
    Then the root element has attribute "className" which contains "ra-my-component"

Scenario: Verify "size" prop
    Given the "size" property is set to "lg"
    Then the root element has attribute "className" which contains "size-lg"

Scenario: Verify click interaction
    Given the component is rendered with defaults
    When the root element is clicked 1 times
    Then the ".indicator" element has attribute "className" which contains "active"
```

### Step 2: Create the test file

Create `tests/<component>.test.tsx`:

```tsx
import { expect } from 'vitest';
import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber/browser';
import { createHarnessControl, baseStepDefinitions, attributeStepDefinitions } from '../../../../test-utils/index.js';
import MyComponent from '../my-component.js';

const feature = await loadFeature('./my-component.feature');

describeFeature(feature, ({ Scenario, AfterEachScenario, defineSteps }) => {
    const harness = createHarnessControl();

    AfterEachScenario(async () => {
        await harness.cleanup();
    });

    // Register shared steps — handles property setters, attribute assertions,
    // text content, element existence, keyboard, mouse, CSS classes
    defineSteps((steps) => {
        baseStepDefinitions(steps, harness);
        attributeStepDefinitions(steps, harness);
    });

    // Component-specific steps that aren't covered by shared definitions.
    // Each Scenario callback only needs to define steps that are NOT
    // already handled by defineSteps above.

    Scenario('Verify default className', ({ Given }) => {
        // This Given is component-specific (renders the component)
        Given('the component is rendered with defaults', async () => {
            await harness.renderHarness(MyComponent);
        });
        // The Then step is handled automatically by shared attributeStepDefinitions
    });

    Scenario('Verify "size" prop', ({ Given }) => {
        // The first Given step renders AND sets a prop
        Given('the "size" property is set to "lg"', async () => {
            await harness.renderHarness(MyComponent, { size: 'lg' });
        });
        // Then is handled by shared steps
    });

    Scenario('Verify click interaction', ({ Given }) => {
        Given('the component is rendered with defaults', async () => {
            await harness.renderHarness(MyComponent);
        });
        // When (click) and Then (attribute check) are handled by shared steps
    });
});
```

### Step 3: Run and iterate

```bash
npx vitest run --reporter=verbose
```

## How It Works

### Execution Flow

1. Vitest starts and launches Chromium via Playwright
2. The test file is loaded in the browser
3. `loadFeature()` fetches and parses the `.feature` file
4. `describeFeature()` creates a `describe` block for the feature
5. Each `Scenario` becomes a nested `describe` block
6. Each step (Given/When/Then/And) becomes a separate `test()` call
7. Steps defined in `defineSteps()` are matched automatically to any scenario step that doesn't have an explicit definition in the `Scenario` callback
8. Between scenarios, `AfterEachScenario` runs cleanup

### HarnessControl

`createHarnessControl()` returns an object that manages the component lifecycle:

| Method | Description |
|--------|-------------|
| `renderHarness(Component, props?)` | Renders a component into the browser DOM. **Must be awaited.** |
| `setProps(props)` | Merges new props and rerenders. **Must be awaited.** |
| `getRootElement()` | Returns the root DOM Element of the rendered component |
| `selectElement(selector)` | Queries within the rendered component's root element |
| `selectElementFromBody(selector)` | Queries from `document.body` (for portals, trays, etc.) |
| `selectAllFromBody(selector)` | Returns all matching elements from `document.body` |
| `cleanup()` | Unmounts the component and resets state. **Must be awaited.** |

### Shared Step Definitions

Shared steps are registered via `defineSteps()` and use the `Step` type (generic — matches Given, When, Then, And).

**base.steps.ts** provides:

| Pattern | Type | Description |
|---------|------|-------------|
| `the "{prop}" property is set to "{value}"` | Given/And | Sets a string prop via `harness.setProps()` |
| `the "{prop}" property is set to null` | Given/And | Sets prop to null |
| `the "{prop}" property is set to undefined` | Given/And | Sets prop to undefined |
| `the "{prop}" property is set to true` | Given/And | Sets prop to boolean true |
| `the "{prop}" property is set to false` | Given/And | Sets prop to boolean false |
| `the "{prop}" property is set to a collection of:` | Given/And | Sets prop to table data (array of objects) |
| `the "{prop}" property is set to a string collection of:` | Given/And | Sets prop to array of strings from table |
| `the "{prop}" property is set to a numeric collection of:` | Given/And | Sets prop to array of numbers from table |
| `the "{prop}" property is changed to "{value}"` | When | Changes a prop value |
| `the "{prop}" property is changed to null` | When | Changes a prop to null |
| `"{key}" key is pressed {n} times` | When | Simulates keyboard input via `userEvent.keyboard()` |
| `the root element is clicked {n} times` | When | Simulates mouse clicks via `userEvent.click()` |
| `the "{selector}" element has text "{text}"` | Then | Asserts text content within rendered component |
| `the "{selector}" element from body has text "{text}"` | Then | Asserts text content anywhere in document |
| `the "{selector}" element does not have text "{text}"` | Then | Negative text assertion |
| `the "{selector}" element should exist` | Then | Element exists within component |
| `the "{selector}" element should not exist` | Then | Element does not exist |
| `the "{selector}" element from body has element "{child}"` | Then | Child element exists under body element |
| `the "{selector}" element from body has class "{class}"` | Then | CSS class check on body element |
| `the "{selector}" element from body does not have class "{class}"` | Then | Negative CSS class check |

**attribute.steps.ts** provides:

| Pattern | Scope | Description |
|---------|-------|-------------|
| `the root element has attribute "{attr}" which is "{value}"` | Root | Exact attribute match |
| `the root element has attribute "{attr}" which contains "{value}"` | Root | Substring attribute match |
| `the root element has attribute "{attr}" which has a value` | Root | Non-empty attribute check |
| `the root element has attribute "{attr}" which does not contain "{value}"` | Root | Negative substring match |
| `the root element does not have attribute "{attr}"` | Root | Attribute does not exist |
| `the "{selector}" element has attribute "{attr}" which has a value` | Sub-element | Non-empty attribute check on child |
| `the "{selector}" element has attribute "{attr}" which is "{value}"` | Sub-element | Exact match on child element |
| `the "{selector}" element has attribute "{attr}" which contains "{value}"` | Sub-element | Substring match on child |
| `the "{selector}" element has attribute "{attr}" which does not contain "{value}"` | Sub-element | Negative match on child |
| `the "{selector}" element from body has attribute "{attr}" which is "{value}"` | Body | Exact match on body-scoped element |
| `the "{selector}" element from body has attribute "{attr}" which contains "{value}"` | Body | Substring match on body-scoped element |
| `the "{selector}" element from body has attribute "{attr}" which is not "{value}"` | Body | Negative exact match |
| `the "{selector}" element from body has attribute "{attr}" which does not contain "{value}"` | Body | Negative substring match |

## Important Gotchas

### 1. `render()` is async

Unlike `@testing-library/react`, the `render()` from `vitest-browser-react` is **async** and must be awaited. If you forget to `await`, the container will be undefined.

```tsx
// WRONG
harness.renderHarness(MyComponent);

// CORRECT
await harness.renderHarness(MyComponent);
```

### 2. Use `vitest-browser-react/pure` (not the default import)

The default `vitest-browser-react` import registers a `beforeEach(cleanup)` hook that unmounts components between every step. Since each Gherkin step runs as a separate `test()`, this would destroy your rendered component between Given and Then. The `/pure` import avoids this — cleanup is handled manually via `AfterEachScenario`.

### 3. Each step is a separate test

`@amiceli/vitest-cucumber` runs each step as its own `test()` call within a `describe` block (the scenario). State is shared via closures (the `harness` object). The `AfterEachScenario` hook maps to `afterAll` within each scenario's describe block.

### 4. Step matching uses `{string}` expressions

The `{string}` expression matches quoted values in feature files (both `"double"` and `'single'` quotes) and strips the quotes before passing to the callback. Use `{string}` for any value that may contain hyphens, dots, or spaces. `{word}` only matches `\w+` (alphanumeric + underscore).

### 5. Step callbacks receive context as first argument

Step callbacks registered via `defineSteps` receive the Vitest test context as their first argument, followed by extracted parameters:

```tsx
Step('the {string} property is set to {string}', async (ctx, propId, propValue) => {
    // ctx = Vitest TestContext (usually not needed)
    // propId, propValue = extracted from feature file
});
```

### 6. `defineSteps` uses `Step` (generic type)

Steps registered with `Step` (instead of `Given`/`When`/`Then`) are generic — they match any step type. This is ideal for shared definitions since the same pattern (e.g., setting a property) can appear as Given, And, or When in different scenarios.

### 7. Avoid parentheses in step patterns

The expression parser escapes `?` but treats parentheses `(` and `)` as regex group characters. This means `time(s)` in a step pattern becomes a regex optional group and won't match literally. Use plain text like `times` instead of `time(s)`.

### 8. Feature file path is relative to the test file

`loadFeature('./my-component.feature')` resolves relative to the test file location.

## Debugging Failed Tests

When a test fails:

1. **Terminal output** shows the failing step, expected vs actual, and stack trace
2. **Screenshot** is saved to `test-screenshots/` showing the browser state at failure
3. **Playwright trace** is saved to `__traces__/` near the test file (on failure only)
4. **JSON report** in `test-results.json` has structured error data

To view a Playwright trace:
```bash
npx playwright show-trace path/to/__traces__/trace.zip
```

## Adding New Shared Steps

To add a new reusable step pattern:

1. Add it to `base.steps.ts` or `attribute.steps.ts` (or create a new file in `test-utils/`)
2. Use `Step` (generic) unless it should only match a specific type (Given/When/Then)
3. Use `{string}` for quoted parameters, `{int}` for integers, `{number}` for floats
4. Export from `test-utils/index.ts`
5. Register in test files via `defineSteps()`
