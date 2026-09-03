## ADDED Requirements

### Requirement: Amount editor via popup
The system SHALL display a category's amount in exactly one place per row,
as a tappable control. Tapping it SHALL open a modal dialog containing the
manual field, slider, and stepper buttons for editing that category's
amount; the row itself SHALL NOT host an always-visible amount input.

#### Scenario: Opening the amount editor
- **WHEN** the user taps a category's displayed amount
- **THEN** a dialog opens showing that category's manual field, slider, and stepper buttons, pre-filled with its current amount

#### Scenario: Single amount display without duplication
- **WHEN** a category row is rendered
- **THEN** its amount appears exactly once, and no separate always-visible input duplicates it

#### Scenario: Closing the editor
- **WHEN** the user closes the amount editor dialog
- **THEN** the row shows the updated amount and the dialog's controls are no longer visible
