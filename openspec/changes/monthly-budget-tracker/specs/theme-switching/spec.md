## Purpose

Lets the user toggle between a light and a dark UI theme and keeps that
choice applied across app restarts.

## ADDED Requirements

### Requirement: Toggle theme
The system SHALL provide a control to switch the UI between light and dark
themes.

#### Scenario: Switching to dark
- **WHEN** the user toggles the theme to dark
- **THEN** all screens render using the dark color scheme

#### Scenario: Switching to light
- **WHEN** the user toggles the theme to light
- **THEN** all screens render using the light color scheme

### Requirement: Persisted theme choice
The system SHALL remember the selected theme across app restarts and page
reloads.

#### Scenario: Reload after choosing dark
- **WHEN** the user reopens the app after previously selecting the dark theme
- **THEN** the app opens already in the dark theme
