Feature: Transactions

  Scenario: User can view transactions
    Given the user navigates to the Transactions page
    Then the transactions should be visible

    Scenario: Error is shown when transactions fail to load
      Given the user navigates to the Transactions page
      When there is a problem loading the transactions
      Then an error message should be displayed to the user