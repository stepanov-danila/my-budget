## MODIFIED Requirements

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

## ADDED Requirements

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
