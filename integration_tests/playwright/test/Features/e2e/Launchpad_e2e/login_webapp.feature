Feature: Authentication Bypass

  Scenario: User can access application with bypassed authentication
    Given the authentication is bypassed with Wiremock stubs
    When the user navigates to the home page
    Then the user should have access to the application without login
