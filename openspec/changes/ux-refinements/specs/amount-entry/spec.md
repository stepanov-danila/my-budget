## MODIFIED Requirements

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
was typed directly.

#### Scenario: Dragged to edge
- **WHEN** the user drags the slider to its rightmost position, reaching the current maximum exactly
- **THEN** the slider maximum increases, extending the range further

#### Scenario: Typed value exceeds max
- **WHEN** the user types an amount greater than the current slider maximum but not exactly equal to it
- **THEN** the amount is saved as typed, but the slider maximum stays the same and the slider visually shows its current maximum

#### Scenario: Typed value exactly matches the max
- **WHEN** the user types an amount that exactly equals the current slider maximum
- **THEN** the slider maximum increases, extending the range further
