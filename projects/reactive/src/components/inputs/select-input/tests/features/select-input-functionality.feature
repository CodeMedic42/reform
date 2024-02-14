Feature: SelectInput Component Functionality

Open Tests
Scenario: Tray closed
    Given the "value" property is set to null
    Then the ".ra-drop-down" element has attribute "className" which does not contain "open"
    Then the ".ra-tray" element from body has attribute "className" which contains "active-hidden"

Scenario: Opens with enter key
    Given the "value" property is set to null
    When "Tab" key is pressed 1 time(s)
    When "Enter" key is pressed 1 time(s)
    Then the ".ra-drop-down" element has attribute "className" which contains "open"
    Then the ".ra-tray" element from body has attribute "className" which does not contain "active-hidden"

Scenario: Opens on click
    Given the "value" property is set to null
    When the root element clicked 1 time(s)
    Then the ".ra-drop-down" element has attribute "className" which contains "open"
    Then the ".ra-tray" element from body has attribute "className" which does not contain "active-hidden"

Scenario: On open with not value, verify first option targeted
    Given the "options" property is set to a collection of:
    | value  | label   | 
    | valueA | Value A |
    | valueB | Value B |
    | valueC | Value C |
    And the "value" property is set to null
    And the "id" property is set to "foo"
    When the root element clicked 1 time(s)
    Then the "#foo-valueA.ra-dd-list-item" element from body has class "targeted"
    