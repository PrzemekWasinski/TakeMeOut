# EatMeOut - Unit Tests

This folder contains MSTest unit tests for the EatMeOut restaurant ordering web application.

These tests were written to validate logic-based features as described in the project report, fulfilling the coursework requirement for automated unit testing.

This folder also contains the test case tables that was made throughout the stages of the project.

---

## Technologies Used
- .NET 6 SDK
- MSTest framework
- C# 10
- Manual + automated testing

---

## Test Files & Coverage

| File                        | Description
`OrderCalculationTests.cs` - Tests cart total calculation (qty × price)
`CreditLogicTests.cs`      - Tests user credit deduction logic
`PricingTierTests.cs`      - Tests smart pricing tier logic (£ / ££ / £££)
`RatingLogicTests.cs`      - Tests O(1) running average rating update
`SearchFilterTests.cs`     - Tests text-based filtering across name, cuisine, menu
`UserRoleAccessTests.cs`   - Tests access control for users vs. restaurants
`LogoutSessionTests.cs`    - Tests session/token presence and invalidation
`CartValidationTests.cs`   - Tests detection of empty/null carts
`WithdrawalLogicTests.cs`  - Tests restaurant withdrawal based on earnings
`OrderHistorySortingTests.cs` - Tests that order history is sorted newest-first
`InputValidationTests.cs`  - Tests email and password validation logic

---

## Notes

- Tests are isolated and do not modify or depend on the main application database.
- All tests pass via `dotnet test`.
- Matches unit testing plan described in the Testing section of the report.
