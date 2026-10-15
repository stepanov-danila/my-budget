# theme-switching Specification

## Purpose

Keeps the UI's light/dark appearance in sync with the OS/browser's
color-scheme preference, including live while the app is open.

## Requirements

### Requirement: Follow system theme
The system SHALL render the UI using the light or dark color scheme
reported by the OS/browser (`prefers-color-scheme`), with no manual
control to override it.

#### Scenario: Launching with a system theme
- **WHEN** the app launches
- **THEN** it renders using whichever of light or dark the OS/browser currently reports via `prefers-color-scheme`

#### Scenario: System theme changes while the app is open
- **WHEN** the user changes their OS/browser color-scheme preference while the app is open, without closing or reloading it
- **THEN** the app immediately re-renders using the new color scheme
