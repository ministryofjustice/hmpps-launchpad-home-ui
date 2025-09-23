Feature: Health Check API

  Scenario: Health endpoint returns healthy
    Given an API context
    When I request the health endpoint
    Then the response should indicate healthy

  Scenario: Health endpoint returns unhealthy
    Given an API context
    When I request the health endpoint with "unhealthy=true"
    Then the response should indicate unhealthy

  Scenario: Ping endpoint returns UP
    Given an API context
    When I request the ping endpoint
    Then the response should be "UP"

  Scenario: Ping endpoint returns DOWN with header
    Given an API context
    When I request the ping endpoint with header "x-force-down" set to "true"
    Then the response should be "DOWN"

  Scenario: Health endpoint returns error for simulateError
    Given an API context
    When I POST to the health endpoint with payload "simulateError"
    Then the response should be an error