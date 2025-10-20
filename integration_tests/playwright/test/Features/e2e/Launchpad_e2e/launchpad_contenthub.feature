Feature: Launchpad External Web Links - Content Hub

  Scenario: User can see the content hub module
    Given the user navigates to the Launchpad home page
    Then the Content Hub link should be visible
    And the Content Hub image should be visible
    And the Content Hub heading should be "Content Hub"
    And the Content Hub description should be "Watch, read and listen to local and national content."

    Scenario: Error is shown when Content Hub fails to load
      Given the user navigates to the Launchpad home page
      When there is a problem loading the Content Hub module
      Then an error message should be displayed to the user