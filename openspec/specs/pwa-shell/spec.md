# pwa-shell Specification

## Purpose

Packages the app so it can be installed on a phone's home screen and used
fully offline, since all of its data already lives on-device.

## Requirements

### Requirement: Installable app
The system SHALL expose a web app manifest (name, icons, theme/background
colors, standalone display) enabling "Add to Home Screen" installation.

#### Scenario: Installing the app
- **WHEN** the user installs the app from their mobile browser
- **THEN** it launches from the home screen icon in standalone mode without browser chrome

### Requirement: Offline availability
The system SHALL cache its static assets via a service worker so the app
loads and functions without a network connection.

#### Scenario: Opening offline
- **WHEN** the user opens the installed app with no network connection
- **THEN** the app loads and all previously entered data remains accessible
