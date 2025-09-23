Feature: Microsoft SSO Login

  Scenario: User logs in via Microsoft SSO
    Given the user is on the login page
    When the user logs in with valid Microsoft SSO credentials
    Then the user should be redirected to the home page and be authenticated
