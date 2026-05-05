Feature: Chip Component

# Base class
Scenario: Verify default className
    Given the component is rendered with defaults
    Then the root element has attribute "className" which contains "ra-chip"

# id Prop
Scenario: Verify "id" prop
    Given the "id" property is set to "foo"
    Then the root element has attribute "id" which is "foo"

Scenario: Verify "id" prop when null
    Given the "id" property is set to null
    Then the root element does not have attribute "id"

# className Prop
Scenario: Verify "className" prop
    Given the "className" property is set to "custom-class"
    Then the root element has attribute "className" which contains "ra-chip"
    Then the root element has attribute "className" which contains "custom-class"

Scenario: Verify "className" prop when null
    Given the "className" property is set to null
    Then the root element has attribute "className" which contains "ra-chip"
    Then the root element has attribute "className" which does not contain "null"

# size Prop
Scenario: Verify default size
    Given the component is rendered with defaults
    Then the root element has attribute "className" which contains "size-md"

Scenario: Verify "size" prop set to "xs"
    Given the "size" property is set to "xs"
    Then the root element has attribute "className" which contains "size-xs"

Scenario: Verify "size" prop set to "sm"
    Given the "size" property is set to "sm"
    Then the root element has attribute "className" which contains "size-sm"

Scenario: Verify "size" prop set to "lg"
    Given the "size" property is set to "lg"
    Then the root element has attribute "className" which contains "size-lg"

Scenario: Verify "size" prop set to "xl"
    Given the "size" property is set to "xl"
    Then the root element has attribute "className" which contains "size-xl"

Scenario: Verify "size" prop when null defaults to md
    Given the "size" property is set to null
    Then the root element has attribute "className" which contains "size-md"

# variant Prop
Scenario: Verify default variant
    Given the component is rendered with defaults
    Then the root element has attribute "className" which contains "variant-rectangle"

Scenario: Verify "variant" prop set to "pill"
    Given the "variant" property is set to "pill"
    Then the root element has attribute "className" which contains "variant-pill"

Scenario: Verify "variant" prop when null defaults to rectangle
    Given the "variant" property is set to null
    Then the root element has attribute "className" which contains "variant-rectangle"

# color Prop
Scenario: Verify "color" prop applies palette color class
    Given the "color" property is set to "blue"
    Then the root element has attribute "className" which contains "ra-clr-plt-blue"
    Then the root element has attribute "className" which contains "plt-bg"
    Then the root element has attribute "className" which contains "plt-clr"

Scenario: Verify default shade when color is set
    Given the "color" property is set to "blue"
    Then the root element has attribute "className" which contains "plt-200"

# shade Prop
Scenario: Verify "shade" prop
    Given the "color" property is set to "blue"
    And the "shade" property is set to "500"
    Then the root element has attribute "className" which contains "plt-500"

# bordered Prop
Scenario: Verify "bordered" prop adds border class
    Given the "color" property is set to "blue"
    And the "bordered" property is set to true
    Then the root element has attribute "className" which contains "plt-br"

Scenario: Verify "bordered" prop when false
    Given the "color" property is set to "blue"
    And the "bordered" property is set to false
    Then the root element has attribute "className" which does not contain "plt-br"

# floating Prop
Scenario: Verify "floating" prop adds shadow class
    Given the "floating" property is set to true
    Then the root element has attribute "className" which contains "box-shadow-16dp"

Scenario: Verify "floating" prop when false
    Given the "floating" property is set to false
    Then the root element has attribute "className" which does not contain "box-shadow-16dp"

# disabled Prop
Scenario: Verify "disabled" prop adds disabled class
    Given the "disabled" property is set to true
    Then the root element has attribute "className" which contains "disabled"

Scenario: Verify "disabled" prop when false
    Given the component is rendered with defaults
    Then the root element has attribute "className" which does not contain "disabled"

# Rendered element type
Scenario: Verify renders as span by default
    Given the component is rendered with defaults
    Then the root element tag is "SPAN"

Scenario: Verify renders as button when onClick is set
    Given the component is rendered with an onClick handler
    Then the root element tag is "BUTTON"
    Then the root element has attribute "type" which is "button"

Scenario: Verify renders as button when asButton is true
    Given the "asButton" property is set to true
    Then the root element tag is "BUTTON"

# children Prop
Scenario: Verify children are rendered
    Given the component is rendered with text "Chip Label"
    Then the root element contains text "Chip Label"
