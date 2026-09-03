# category-management Specification

## Purpose

Lets the user maintain, per month, the list of expense and income
categories - adding them manually or from a default list, keeping their
order stable, and removing them safely with an Undo window.

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

### Requirement: Category list order
The system SHALL keep categories in a stable order that does not change
when an amount is edited. A new category is appended after the existing
ones. Removing a category and then restoring it via Undo SHALL put it back
at the exact position it occupied before removal.

#### Scenario: New category appended
- **WHEN** a new category is added
- **THEN** it appears after all existing categories of the same type, regardless of its amount

#### Scenario: Amount change does not reorder
- **WHEN** a category's amount is edited to exceed another category's amount
- **THEN** the list order is unchanged

#### Scenario: Undo restores original position
- **WHEN** a category is removed and then restored via Undo
- **THEN** it reappears at the same position in the list it occupied before removal, not at the end
