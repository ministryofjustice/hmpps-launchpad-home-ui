Feature: Timetable Navigation Grid

  Scenario: User can navigate the timetable grid
    Given the user is on the Timetable page
    Then the navigation grid should be visible

    Scenario: Error is shown when navigation grid fails to load
      Given the user is on the Timetable page
      When there is a problem loading the navigation grid
      Then an error message should be displayed to the user