Feature: Privacy Policy Links

  Scenario: User can access the privacy policy from Launchpad
    Given the user is on the Launchpad home page
    When the user clicks the Privacy Policy link
    Then the Privacy Policy page should be displayed
