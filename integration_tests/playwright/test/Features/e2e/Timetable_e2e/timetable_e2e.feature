Feature: Timetable E2E

  Scenario: User can view the timetable grid
    Given the user navigates to the Timetable page
    Then the timetable grid should be visible

    Scenario: Error is shown when Timetable grid fails to load
      Given the user navigates to the Timetable page
      When there is a problem loading the timetable grid
      Then an error message should be displayed to the user