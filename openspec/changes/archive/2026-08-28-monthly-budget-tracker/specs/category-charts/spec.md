## Purpose

Visualizes how the active month's income or expense breaks down across
categories, so the user can see spending distribution at a glance.

## ADDED Requirements

### Requirement: Category breakdown chart
The system SHALL display a chart showing each category's share of the
active month's total, scoped to whichever of Expenses or Income is
currently selected.

#### Scenario: Viewing expense chart
- **WHEN** the user is on the Expenses view for a month with categories
- **THEN** a chart shows the relative amount of each expense category

#### Scenario: No categories yet
- **WHEN** the user is on a view for a month with no categories
- **THEN** the chart area shows an empty state instead of a chart

### Requirement: Chart updates with data
The system SHALL update the chart whenever category amounts, additions, or
removals change for the active month.

#### Scenario: Chart reflects new category
- **WHEN** a category is added or its amount changes
- **THEN** the chart updates to reflect the current category amounts
