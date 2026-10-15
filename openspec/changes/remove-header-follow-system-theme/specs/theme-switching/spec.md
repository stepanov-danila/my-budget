# Spec Delta

## ADDED Requirements

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

## REMOVED Requirements

### Requirement: Toggle theme
**Reason**: The app no longer offers a manual theme choice - it always
follows the OS/browser preference instead, including live while open.
**Migration**: None needed; users who want dark mode set it at the OS
level and the app follows automatically.

### Requirement: Persisted theme choice
**Reason**: There is no manual choice left to persist - the theme is
always derived live from the OS/browser preference, never stored.
**Migration**: None needed; a previously stored theme value, if present
in existing persisted data, is simply no longer read.
