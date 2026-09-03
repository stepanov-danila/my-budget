## REMOVED Requirements

### Requirement: Categories sorted by amount
**Reason**: Reordering rows as amounts change made the list hard to scan
while editing several categories in a row — a row the user is looking at
could jump elsewhere the moment an edit committed.
**Migration**: Categories now keep a stable, insertion-based order (see
"Category list order" below). No data migration is needed; existing
category order in storage becomes the new stable order as-is.

## ADDED Requirements

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
