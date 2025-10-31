Feature: Launchpad National Prison Radio

  Scenario: User can access National Prison Radio
    Given the user navigates to the Launchpad home page
    Then the National Prison Radio link should be visible

    Scenario: Error is shown when National Prison Radio fails to load
      Given the user navigates to the Launchpad home page
      When there is a problem loading the National Prison Radio module
      Then an error message should be displayed to the user