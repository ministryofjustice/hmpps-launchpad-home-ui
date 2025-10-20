Feature: Launchpad Inside Time

  Scenario: User can access Inside Time
    Given the user navigates to the Launchpad home page
    Then the Inside Time link should be visible

    Scenario: Error is shown when Inside Time fails to load
      Given the user navigates to the Launchpad home page
      When there is a problem loading the Inside Time module
      Then an error message should be displayed to the user