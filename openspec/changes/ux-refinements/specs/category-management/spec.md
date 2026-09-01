## MODIFIED Requirements

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
