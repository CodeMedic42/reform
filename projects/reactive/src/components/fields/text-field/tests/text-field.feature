Feature: TextField Component

# Base class
Scenario: Verify default classes
    Given the component is rendered with defaults
    Then the root element has attribute "className" which contains "ra-field"

# id Prop
Scenario: Verify "id" prop
    Given the "id" property is set to "foo"
    Then the root element has attribute "id" which is "foo"
    Then the ".ra-field-label" element has attribute "id" which is "foo-label"
    Then the ".ra-field-input" element has attribute "id" which is "foo-input"

Scenario: Verify auto-generated id when not provided
    Given the component is rendered with defaults
    Then the root element has attribute "id" which has a value

# className Prop
Scenario: Verify "className" prop
    Given the "className" property is set to "custom-class"
    Then the root element has attribute "className" which contains "ra-field"
    Then the root element has attribute "className" which contains "custom-class"

Scenario: Verify "className" prop when null
    Given the "className" property is set to null
    Then the root element has attribute "className" which contains "ra-field"
    Then the root element has attribute "className" which does not contain "null"

# label Prop
Scenario: Verify "label" prop renders label text
    Given the "label" property is set to "Username"
    Then the ".ra-field-label-text" element has text "Username"

# variant Prop
Scenario: Verify "variant" prop applies variant class
    Given the "variant" property is set to "primary"
    Then the root element has attribute "className" which contains "ra-field-variant-primary"

# hidden Prop
Scenario: Verify "hidden" prop adds hidden class
    Given the "hidden" property is set to true
    Then the root element has attribute "className" which contains "hidden"

Scenario: Verify hidden class not present by default
    Given the component is rendered with defaults
    Then the root element has attribute "className" which does not contain "hidden"

# failure Prop
Scenario: Verify "failure" prop adds failure class
    Given the "failure" property is set to true
    Then the root element has attribute "className" which contains "failure"

Scenario: Verify failure class not present by default
    Given the component is rendered with defaults
    Then the root element has attribute "className" which does not contain "failure"

# disabled Prop
Scenario: Verify "disabled" prop disables the input
    Given the "disabled" property is set to true
    Then the ".ra-field-input" element has attribute "disabled" which has a value

# value Prop
Scenario: Verify "value" prop sets input value
    Given the "value" property is set to "hello"
    Then the ".ra-field-input" element has attribute "value" which is "hello"

Scenario: Verify has-value class when value is set
    Given the "value" property is set to "hello"
    Then the ".ra-field-input" element has attribute "className" which contains "has-value"

Scenario: Verify no has-value class when value is null
    Given the "value" property is set to null
    Then the ".ra-field-input" element has attribute "className" which does not contain "has-value"

# DOM Structure
Scenario: Verify input element exists
    Given the component is rendered with defaults
    Then the ".ra-field-input" element should exist
    Then the ".ra-field-label" element should exist
    Then the ".ra-field-container" element should exist

# Accessibility
Scenario: Verify label-input relationship
    Given the "id" property is set to "test"
    And the "label" property is set to "Test Label"
    Then the ".ra-field-label" element has attribute "htmlFor" which is "test-input"
    Then the ".ra-field-input" element has attribute "id" which is "test-input"
