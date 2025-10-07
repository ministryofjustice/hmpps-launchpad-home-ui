@profile @launchpad
Feature: Launchpad Profile
  As a prisoner using the Launchpad system
  I want to view and interact with my profile page
  So that I can access my personal information, timetable, money, incentives, and visits

  Background:
    Given I am on the Launchpad homepage
    When I navigate to my profile page

  @smoke @profile-module
  Scenario: User can see their profile details module on homepage
    Given I am on the Launchpad homepage
    Then I should see the profile details module
    And the profile module should display "Profile" as the heading
    And the profile module should show the description "Check money, visits, incentives (IEP), adjudications and timetable."

  @navigation @profile-access
  Scenario: User can navigate to their profile page
    Given I am on the Launchpad homepage
    When I click on the profile link
    Then I should be redirected to the profile page
    And the URL should contain "/profile"

  @timetable @profile-content
  Scenario: User can see today's timetable on their profile page
    Then I should see the "Today's timetable" section
    And the timetable section should be visible

  @timetable @navigation-link
  Scenario: User can see the View my timetable link on their profile page
    Then I should see the "View my timetable" link
    And the timetable link should be clickable

  @incentives @profile-content
  Scenario: User can see their Incentive Level on their profile page
    Then I should see the "Incentives (IEP)" section heading
    And I should see the "Current level:" information
    And both incentive elements should be visible

  @money @account-balance
  Scenario: User can see their Account Balance on their profile page
    Then I should see the "Money" section heading
    And the money section should be visible

  @money @expandable-sections
  Scenario Outline: User can expand money sections on their profile page
    When I click on the "<section>" section
    Then the "<section>" section should expand
    And I should see "My current balance is:" information
    And the balance details should be visible

    Examples:
      | section |
      | Spends  |
      | Private |
      | Savings |

  @visits @profile-content
  Scenario: User can see their Visits information on their profile page
    Then I should see the "Visits" section heading
    And I should see the "Next visit" card
    And I should see the "Visits I've got left" card
    And all visit elements should be visible

  @comprehensive @profile-overview
  Scenario: User can see all main sections on their profile page
    Then I should see all the following sections:
      | Section Name    | Element Type |
      | Today's timetable | heading      |
      | Incentives (IEP)  | heading      |
      | Money            | heading      |
      | Visits           | heading      |
    And all sections should be properly displayed

  @accessibility @profile-ui
  Scenario: Profile page elements are accessible and interactive
    Then all profile sections should be visible within 5 seconds
    And all expandable sections should be clickable
    And all navigation links should be accessible
    And the page should be fully loaded without errors