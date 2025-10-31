Feature: Launchpad Hyperlinks

  Scenario: User can access the timetable from Launchpad
    Given the user is on the Launchpad home page
    When the user clicks the "View my timetable" hyperlink
    Then the timetable page should be displayed

  Scenario: User can access the profile from Launchpad
    Given the user is on the Launchpad home page
    When the user clicks the "Profile" hyperlink
    Then the profile page should be displayed

  Scenario: User can access the content hub from Launchpad
    Given the user is on the Launchpad home page
    When the user clicks the "Content Hub" hyperlink
    Then the content hub page should be displayed