Feature: Typography Component

# className Prop
Scenario: Verify default className
    Given the component is rendered with no props
    Then the root element has attribute "className" which contains "ra-typography"

Scenario: Verify custom className is applied
    Given the "className" property is set to "custom-class"
    Then the root element has attribute "className" which contains "ra-typography"
    Then the root element has attribute "className" which contains "custom-class"

Scenario: Verify null className does not add "null" text
    Given the "className" property is set to null
    Then the root element has attribute "className" which contains "ra-typography"
    Then the root element has attribute "className" which does not contain "null"

# inline Prop
Scenario: Verify inline prop adds inline class
    Given the "inline" property is set to true
    Then the root element has attribute "className" which contains "inline"

Scenario: Verify inline prop default does not add inline class
    Given the component is rendered with no props
    Then the root element has attribute "className" which does not contain "inline"

# color Prop
Scenario: Verify color prop applies palette color class
    Given the "color" property is set to "blue"
    Then the root element has attribute "className" which contains "ra-clr-plt-blue"

# shade Prop
Scenario: Verify shade prop applies shade class
    Given the "color" property is set to "blue"
    And the "shade" property is set to "500"
    Then the root element has attribute "className" which contains "plt-500"

# children Prop
Scenario: Verify children are rendered
    Given the component is rendered with text "Hello World"
    Then the root element has text "Hello World"

# Component Prop
Scenario: Verify default element is span
    Given the component is rendered with no props
    Then the root element tag is "SPAN"

Scenario: Verify Component prop changes rendered element
    Given the "Component" property is set to "h1"
    Then the root element tag is "H1"
