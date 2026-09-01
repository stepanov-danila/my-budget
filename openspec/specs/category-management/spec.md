# category-management Specification

## Purpose

Lets the user maintain, per month, the list of expense and income
categories - adding them manually or from a default list, keeping them
sorted by amount, and removing them safely with an Undo window.

## Requirements

### Requirement: Expense/Income sections
The system SHALL separate categories into an Expenses view and an Income
view, switchable by tab, each scoped to the active month.

#### Scenario: Switching category type
- **WHEN** the user selects the Income tab
- **THEN** only income categories for the active month are shown, and expense categories are hidden until the Expenses tab is reselected

### Requirement: Add category manually
The system SHALL allow adding a category to the active month by typing a
custom name.

#### Scenario: Manual category creation
- **WHEN** the user enters a custom category name and confirms
- **THEN** a new category with that name and a zero amount is added to the active month's list

### Requirement: Add category from default list
The system SHALL offer a dropdown of default categories, scoped to
Expenses or Income, that the user can pick from to add to the active month.

#### Scenario: Selecting a default category
- **WHEN** the user opens the default category dropdown and selects one not already present in the active month
- **THEN** that category is added to the active month's list with a zero amount

#### Scenario: Default category already added
- **WHEN** the user opens the default category dropdown for the active month
- **THEN** categories already present in that month's list are not offered again

### Requirement: Categories sorted by amount
The system SHALL keep categories sorted by amount in descending order. The
order recalculates when a category is added, and when an in-progress amount
edit is committed (the amount field loses focus) - not on every
intermediate keystroke or slider-drag tick while the field is focused.

#### Scenario: Reorder after amount change
- **WHEN** a category's amount is edited to exceed another category's amount and the amount field then loses focus
- **THEN** the edited category moves above the other category in the list

#### Scenario: No reorder while a field is still focused
- **WHEN** a category's amount is being edited and the field is still focused, even though the new value would change its sort position
- **THEN** the category stays in its current list position until the field loses focus

#### Scenario: New category insertion
- **WHEN** a new category is added
- **THEN** it is inserted into the list at the position matching its current amount

### Requirement: Delete category with Undo
The system SHALL let the user remove a category via a quick action, without
a confirmation dialog, and offer an Undo option for a short time after
removal.

#### Scenario: Delete then undo
- **WHEN** the user removes a category and taps Undo before the Undo window expires
- **THEN** the category and its amount are restored to the active month

#### Scenario: Delete without undo
- **WHEN** the user removes a category and the Undo window expires without action
- **THEN** the category remains permanently removed from the active month
