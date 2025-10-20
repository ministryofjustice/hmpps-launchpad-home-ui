Feature: Profiles Timetable

  Scenario: User can view profiles timetable
    Given the user is on the Profiles Timetable page
    Then the profiles timetable should be visible

    Scenario: Error is shown when profiles timetable fails to load
      Given the user is on the Profiles Timetable page
      When there is a problem loading the profiles timetable
      Then an error message should be displayed to the user