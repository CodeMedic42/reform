Feature: SelectInput Component Props

# Id Prop
Scenario: Verify "id" prop
    Given the "id" property is set to "foo"
    Then the root element has attribute "id" which is "foo"
    Then the ".ra-input-label" element has attribute "id" which is "foo-label"
    Then the ".ra-tray" element from body has attribute "id" which is "foo-drop-down-tray"

Scenario: Verify "id" prop when empty
    Given the "id" property is set to ""
    Then the root element has attribute "id" which has a value

Scenario: Verify "id" prop when null
    Given the "id" property is set to null
    Then the root element has attribute "id" which has a value

Scenario: Verify "id" prop when undefined
    Given the "id" property is set to undefined
    Then the root element has attribute "id" which has a value

# className Prop
Scenario: Verify "className" prop
    Given the "className" property is set to "foo"
    Then the root element has attribute "className" which contains "foo"
    Then the root element has attribute "className" which contains "ra-select-input"
    Then the root element has attribute "className" which contains "ra-drop-down-input"
    Then the root element has attribute "className" which contains "ra-input"
    Then the root element has attribute "className" which contains "size-md"

Scenario: Verify "className" prop when null
    Given the "className" property is set to null
    Then the root element has attribute "className" which contains "ra-select-input"
    Then the root element has attribute "className" which contains "ra-drop-down-input"
    Then the root element has attribute "className" which contains "ra-input"
    Then the root element has attribute "className" which does not contain "null"

Scenario: Verify "className" prop when undefined
    Given the "className" property is set to undefined
    Then the root element has attribute "className" which contains "ra-select-input"
    Then the root element has attribute "className" which contains "ra-drop-down-input"
    Then the root element has attribute "className" which contains "ra-input"
    Then the root element has attribute "className" which contains "size-md"
    Then the root element has attribute "className" which does not contain "undefined"

# placeholder prop
Scenario: Verify "placeholder" prop
    Given the "placeholder" property is set to "FooBar"
    And the "value" property is set to undefined
    Then the ".ra-select-anchor" element has text "FooBar"

Scenario: Verify "placeholder" prop and value prop is set
    Given the "placeholder" property is set to "FooBar"
    And the "value" property is set to "targetValue"
    Then the ".ra-select-anchor" element has text "targetValue"
    Then the ".ra-select-anchor" element does not have text "FooBar"

Scenario: Verify "placeholder" prop shown when value clearedw
    Given the "placeholder" property is set to "FooBar"
    And the "value" property is set to "targetValue"
    When the "value" property is changed to null
    Then the ".ra-select-anchor" element has text "FooBar"
    Then the ".ra-select-anchor" element does not have text "targetValue"

# nullable Prop
Scenario: Verify "nullable" prop
    Given the "nullable" property is set to true
    And the "value" property is set to "targetValue"
    Then the "button.clear" element should exist

Scenario: Verify "nullable" prop when null
    Given the "nullable" property is set to null
    And the "value" property is set to "targetValue"
    Then the "button.clear" element should exist

Scenario: Verify "nullable" prop when undefined
    Given the "nullable" property is set to undefined
    And the "value" property is set to "targetValue"
    Then the "button.clear" element should exist

Scenario: Verify "nullable" prop when false
    Given the "nullable" property is set to false
    And the "value" property is set to "targetValue"
    Then the "button.clear" element should not exist

# options Prop
Scenario: Verify "options" prop as string list
    Given the "options" property is set to a string collection of:
    | values |
    | valueA |
    | valueB |
    | valueC |
    And the "id" property is set to "foo"
    Then the "#foo-drop-down-tray.ra-tray" element from body has element "#foo-valueA.ra-dd-list-item"
    Then the "#foo-valueA.ra-dd-list-item" element from body has text "valueA"
    Then the "#foo-drop-down-tray.ra-tray" element from body has element "#foo-valueB.ra-dd-list-item"
    Then the "#foo-valueB.ra-dd-list-item" element from body has text "valueB"
    Then the "#foo-drop-down-tray.ra-tray" element from body has element "#foo-valueC.ra-dd-list-item"
    Then the "#foo-valueC.ra-dd-list-item" element from body has text "valueC"

Scenario: Verify "options" prop as numeric list
    Given the "options" property is set to a numeric collection of:
    | values |
    | 40 |
    | 41 |
    | 42 |
    And the "id" property is set to "foo"
    Then the "#foo-drop-down-tray.ra-tray" element from body has element "#foo-40.ra-dd-list-item"
    Then the "#foo-40.ra-dd-list-item" element from body has text "40"
    Then the "#foo-drop-down-tray.ra-tray" element from body has element "#foo-41.ra-dd-list-item"
    Then the "#foo-41.ra-dd-list-item" element from body has text "41"
    Then the "#foo-drop-down-tray.ra-tray" element from body has element "#foo-42.ra-dd-list-item"
    Then the "#foo-41.ra-dd-list-item" element from body has text "41"

Scenario: Verify "options" prop as object list
    Given the "options" property is set to a collection of:
    | value  | label   | 
    | valueA | Value A |
    | valueB | Value B |
    | valueC | Value C |
    And the "id" property is set to "foo"
    Then the "#foo-drop-down-tray.ra-tray" element from body has element "#foo-valueA.ra-dd-list-item"
    Then the "#foo-valueA.ra-dd-list-item" element from body has text "Value A"
    Then the "#foo-valueA.ra-dd-list-item" element from body does not have class "selected"
    Then the "#foo-drop-down-tray.ra-tray" element from body has element "#foo-valueB.ra-dd-list-item"
    Then the "#foo-valueB.ra-dd-list-item" element from body has text "Value B"
    Then the "#foo-valueB.ra-dd-list-item" element from body does not have class "selected"
    Then the "#foo-drop-down-tray.ra-tray" element from body has element "#foo-valueC.ra-dd-list-item"
    Then the "#foo-valueC.ra-dd-list-item" element from body has text "Value C"
    Then the "#foo-valueC.ra-dd-list-item" element from body does not have class "selected"

# value Prop
Scenario: Verify "value" prop with value in options
    Given the "options" property is set to a collection of:
    | value  | label   | 
    | valueA | Value A |
    | valueB | Value B |
    | valueC | Value C |
    And the "value" property is set to "valueB"
    And the "id" property is set to "foo"
    Then the "#foo-valueA.ra-dd-list-item" element from body does not have class "selected"
    Then the "#foo-valueB.ra-dd-list-item" element from body has class "selected"
    Then the "#foo-valueC.ra-dd-list-item" element from body does not have class "selected"
    Then the ".ra-select-anchor" element has text "Value B"

Scenario: Verify "value" prop without value in options
    Given the "options" property is set to a collection of:
    | value  | label   | 
    | valueA | Value A |
    | valueB | Value B |
    | valueC | Value C |
    And the "value" property is set to "valueD"
    And the "id" property is set to "foo"
    Then the "#foo-valueA.ra-dd-list-item" element from body does not have class "selected"
    Then the "#foo-valueB.ra-dd-list-item" element from body does not have class "selected"
    Then the "#foo-valueC.ra-dd-list-item" element from body does not have class "selected"
    Then the ".ra-select-anchor" element has text "valueD"

Scenario: Verify "value" prop with value in options changes
    Given the "options" property is set to a collection of:
    | value  | label   | 
    | valueA | Value A |
    | valueB | Value B |
    | valueC | Value C |
    And the "value" property is set to "valueB"
    And the "id" property is set to "foo"
    When the "value" property is changed to "valueC"
    Then the "#foo-valueA.ra-dd-list-item" element from body does not have class "selected"
    Then the "#foo-valueB.ra-dd-list-item" element from body does not have class "selected"
    Then the "#foo-valueC.ra-dd-list-item" element from body has class "selected"
    Then the ".ra-select-anchor" element has text "Value C"

#optionValuePath
Scenario: Verify "optionValuePath" prop
    Given the "options" property is set to a collection of:
    | key  | label   | 
    | valueA | Value A |
    | valueB | Value B |
    | valueC | Value C |
    And the "value" property is set to "valueB"
    And the "id" property is set to "foo"
    And the "optionValuePath" property is set to "key"
    Then the "#foo-valueA.ra-dd-list-item" element from body does not have class "selected"
    Then the "#foo-valueB.ra-dd-list-item" element from body has class "selected"
    Then the "#foo-valueC.ra-dd-list-item" element from body does not have class "selected"
    Then the ".ra-select-anchor" element has text "Value B"

#optionLabelPath
Scenario: Verify "optionLabelPath" prop
    Given the "options" property is set to a collection of:
    | value  | text   | 
    | valueA | Value A |
    | valueB | Value B |
    | valueC | Value C |
    And the "value" property is set to "valueB"
    And the "id" property is set to "foo"
    And the "optionLabelPath" property is set to "text"
    Then the "#foo-valueA.ra-dd-list-item" element from body has text "Value A"
    Then the "#foo-valueA.ra-dd-list-item" element from body does not have class "selected"
    Then the "#foo-valueB.ra-dd-list-item" element from body has text "Value B"
    Then the "#foo-valueB.ra-dd-list-item" element from body has class "selected"
    Then the "#foo-valueC.ra-dd-list-item" element from body has text "Value C"
    Then the "#foo-valueC.ra-dd-list-item" element from body does not have class "selected"
    Then the ".ra-select-anchor" element has text "Value B"

#selectedLabelPath
Scenario: Verify "selectedLabelPath" prop
    Given the "options" property is set to a collection of:
    | value  | label   | position  |
    | valueA | Value A | First  |
    | valueB | Value B | Second |
    | valueC | Value C | Third  |
    And the "value" property is set to "valueB"
    And the "id" property is set to "foo"
    And the "selectedLabelPath" property is set to "position"
    Then the "#foo-valueA.ra-dd-list-item" element from body has text "Value A"
    Then the "#foo-valueA.ra-dd-list-item" element from body does not have class "selected"
    Then the "#foo-valueB.ra-dd-list-item" element from body has text "Value B"
    Then the "#foo-valueB.ra-dd-list-item" element from body has class "selected"
    Then the "#foo-valueC.ra-dd-list-item" element from body has text "Value C"
    Then the "#foo-valueC.ra-dd-list-item" element from body does not have class "selected"
    Then the ".ra-select-anchor" element has text "Second"