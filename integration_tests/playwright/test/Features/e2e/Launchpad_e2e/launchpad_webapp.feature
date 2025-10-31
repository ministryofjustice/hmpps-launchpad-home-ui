Feature: Launchpad Webapp

  Scenario: User can access the Launchpad webapp
    Given the user navigates to the Launchpad home page
    Then the Launchpad webapp should be accessible

    Scenario: Error is shown when Launchpad webapp fails to load
      Given the user navigates to the Launchpad home page
      When there is a problem loading the Launchpad webapp
      Then an error message should be displayed to the user