## Purpose

Lets the user manage the set of months they track, switch between them via
tabs, and always see the income/expense/difference balance for whichever
month is active.

## ADDED Requirements

### Requirement: Month tabs navigation
The system SHALL display every existing month as a tab the user can switch
between via horizontal scroll or swipe.

#### Scenario: Switching active month
- **WHEN** the user taps a different month tab
- **THEN** the app displays that month's categories and balance as the active month

### Requirement: Add new month
The system SHALL allow creating a new month either empty or by carrying over
the previous month's categories and amounts as editable starting values.

#### Scenario: Create empty month
- **WHEN** the user adds a new month and chooses to start empty
- **THEN** the new month is created with no categories

#### Scenario: Create month copied from previous
- **WHEN** the user adds a new month and chooses to carry over from the previous month
- **THEN** the new month is created with the same categories and amounts as the previous month, editable independently from it

### Requirement: Delete month with confirmation
The system SHALL require explicit confirmation before deleting a month and
its data, with no Undo after confirmation.

#### Scenario: Confirmed deletion
- **WHEN** the user requests to delete a month and confirms in the dialog
- **THEN** the month and all its categories and amounts are permanently removed

#### Scenario: Cancelled deletion
- **WHEN** the user requests to delete a month and cancels the confirmation dialog
- **THEN** the month and its data remain unchanged

### Requirement: Always-visible month balance
The system SHALL always display, for the active month, total income, total
expense, and the difference (income minus expense), pinned so it stays
visible while the category list scrolls.

#### Scenario: Balance updates on data change
- **WHEN** a category amount changes in the active month
- **THEN** the displayed income, expense, and difference update immediately

#### Scenario: Balance stays visible while scrolling
- **WHEN** the user scrolls a long category list
- **THEN** the balance bar remains visible at the top of the screen

### Requirement: Multiple months supported
The system SHALL support adding and deleting more than one month, with each
month's data managed independently.

#### Scenario: Many months exist
- **WHEN** the user has created several months
- **THEN** all of them appear as tabs and can each be selected, edited, or deleted independently
