Feature: Button Component

# Base classes
Scenario: Verify default classes
    Given the component is rendered with defaults
    Then the root element has attribute "className" which contains "ra-button"
    Then the root element has attribute "className" which contains "no-select"
    Then the root element has attribute "className" which contains "ra-clr-int-control"

# className Prop
Scenario: Verify "className" prop
    Given the "className" property is set to "custom-class"
    Then the root element has attribute "className" which contains "ra-button"
    Then the root element has attribute "className" which contains "custom-class"

# color Prop
Scenario: Verify "color" prop applies scheme color classes
    Given the "color" property is set to "primary"
    Then the root element has attribute "className" which contains "ra-clr-int"
    Then the root element has attribute "className" which contains "ra-clr-int-primary"

Scenario: Verify "color" prop with "danger"
    Given the "color" property is set to "danger"
    Then the root element has attribute "className" which contains "ra-clr-int-danger"

Scenario: Verify no color classes when color not set
    Given the component is rendered with defaults
    Then the root element has attribute "className" which does not contain "ra-clr-int-primary"

# variant Prop
Scenario: Verify "variant" prop applies interactive variant class
    Given the "color" property is set to "primary"
    And the "variant" property is set to "fill"
    Then the root element has attribute "className" which contains "ra-clr-int-fill"

# design Prop
Scenario: Verify "design" prop applies button design class
    Given the "design" property is set to "sm"
    Then the root element has attribute "className" which contains "ra-btn-design-sm"

Scenario: Verify no design class when design not set
    Given the component is rendered with defaults
    Then the root element has attribute "className" which does not contain "ra-btn-design"

# Component Prop
Scenario: Verify default element is button
    Given the component is rendered with defaults
    Then the root element tag is "BUTTON"

Scenario: Verify Component prop changes rendered element
    Given the component is rendered with Component "a"
    Then the root element tag is "A"

# disabled Prop
Scenario: Verify "disabled" prop
    Given the "disabled" property is set to true
    Then the root element has attribute "disabled" which has a value

# children Prop
Scenario: Verify children are rendered
    Given the component is rendered with text "Click Me"
    Then the root element contains text "Click Me"

# Click interaction
Scenario: Verify click handler is called
    Given the component is rendered with an onClick handler
    When the root element is clicked 1 times
    Then the click handler was called
