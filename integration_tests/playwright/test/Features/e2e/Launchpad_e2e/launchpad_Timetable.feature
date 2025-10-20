Feature: Launchpad Timetable

  Scenario: User can view the timetable
    Given the user navigates to the Launchpad home page
    Then the timetable should be visible

    Scenario: Error is shown when Timetable fails to load
      Given the user navigates to the Launchpad home page
      When there is a problem loading the timetable
      Then an error message should be displayed to the user