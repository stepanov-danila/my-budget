## Purpose

Provides a manual field and an adaptive slider, kept in sync, for entering
and editing a category's total amount for the month.

## ADDED Requirements

### Requirement: Synced manual and slider input
The system SHALL allow entering a category's amount either by typing a
number or by dragging a slider, keeping both in sync with each other.

#### Scenario: Manual entry updates slider
- **WHEN** the user types an amount into the numeric field
- **THEN** the slider position updates to reflect that amount

#### Scenario: Slider updates field
- **WHEN** the user drags the slider
- **THEN** the numeric field updates to show the corresponding amount

### Requirement: Default slider range
The system SHALL initialize a category's amount slider with a range of 0 to
50,000 RUB and a step of 100.

#### Scenario: Fresh category default range
- **WHEN** a new category is created
- **THEN** its amount slider spans 0 to 50,000 with 100 increments

### Requirement: Adaptive slider maximum
The system SHALL increase the slider's maximum when the user enters a value
above the current maximum, or drags the slider to its right edge, so the
slider can always represent the desired amount.

#### Scenario: Typed value exceeds max
- **WHEN** the user types an amount greater than the current slider maximum
- **THEN** the slider maximum increases to accommodate that amount

#### Scenario: Dragged to edge
- **WHEN** the user drags the slider to its rightmost position
- **THEN** the slider maximum increases, extending the range further
