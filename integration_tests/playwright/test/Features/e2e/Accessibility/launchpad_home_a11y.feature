Feature: Launchpad Home Page Accessibility

  Scenario: Home page passes accessibility checks
    Given the user navigates to the Launchpad home page
    When an accessibility scan is run
    Then there should be no accessibility violations
