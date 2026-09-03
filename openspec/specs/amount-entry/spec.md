# amount-entry Specification

## Purpose

Provides a manual field and an adaptive slider, kept in sync, for entering
and editing a category's total amount for the month.

## Requirements

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
50,000 RUB and a step of 1,000.

#### Scenario: Fresh category default range
- **WHEN** a new category is created
- **THEN** its amount slider spans 0 to 50,000 with 1,000 increments

### Requirement: Adaptive slider maximum
The system SHALL increase the slider's maximum only when the amount exactly
reaches the current maximum, so the range grows as the slider is driven to
its current edge, without jumping ahead just because a much larger amount
was typed directly. A single continuous drag gesture SHALL grow the
maximum at most once, even if the slider's position is re-evaluated against
the newly-grown range while the same gesture is still active.

#### Scenario: Dragged to edge
- **WHEN** the user drags the slider to its rightmost position, reaching the current maximum exactly
- **THEN** the slider maximum increases, extending the range further

#### Scenario: Typed value exceeds max
- **WHEN** the user types an amount greater than the current slider maximum but not exactly equal to it
- **THEN** the amount is saved as typed, but the slider maximum stays the same and the slider visually shows its current maximum

#### Scenario: Typed value exactly matches the max
- **WHEN** the user types an amount that exactly equals the current slider maximum
- **THEN** the slider maximum increases, extending the range further

#### Scenario: Growth does not cascade within one drag
- **WHEN** the user drags the slider to its edge in one continuous gesture and keeps dragging without releasing
- **THEN** the maximum grows by exactly one step for that gesture, not repeatedly

### Requirement: Fine-adjustment stepper buttons
The system SHALL provide increment and decrement buttons next to the
manual amount field that adjust the amount by the slider's step size, so an
exact value can be reached without depending on drag precision.

#### Scenario: Increment button
- **WHEN** the user taps the increment button
- **THEN** the amount increases by one step and the field and slider reflect the new value

#### Scenario: Decrement button
- **WHEN** the user taps the decrement button and the amount is at least one step above zero
- **THEN** the amount decreases by one step and the field and slider reflect the new value

#### Scenario: Decrement does not go below zero
- **WHEN** the user taps the decrement button and the amount is less than one step
- **THEN** the amount becomes zero rather than going negative

### Requirement: Amount editor via popup
The system SHALL display a category's amount in exactly one place per row,
as a tappable control. Tapping it SHALL open a modal dialog, centered on
screen on every viewport size, containing the manual field, slider, and
stepper buttons for editing that category's amount; the row itself SHALL
NOT host an always-visible amount input. The dialog's confirm button SHALL
have a comfortably large tap target.

#### Scenario: Opening the amount editor
- **WHEN** the user taps a category's displayed amount
- **THEN** a dialog opens showing that category's manual field, slider, and stepper buttons, pre-filled with its current amount

#### Scenario: Single amount display without duplication
- **WHEN** a category row is rendered
- **THEN** its amount appears exactly once, and no separate always-visible input duplicates it

#### Scenario: Closing the editor
- **WHEN** the user closes the amount editor dialog
- **THEN** the row shows the updated amount and the dialog's controls are no longer visible

#### Scenario: Dialog is centered on screen
- **WHEN** the amount editor dialog is open, on any viewport size
- **THEN** it is centered both vertically and horizontally, not anchored to the bottom edge
