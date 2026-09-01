## ADDED Requirements

### Requirement: Safe-area aware layout in standalone mode
The system SHALL keep the app's top UI clear of the device's status bar
(clock, signal, battery) when running in standalone PWA mode, by respecting
the device's safe-area insets instead of assuming zero top inset.

#### Scenario: Standalone launch on a device with a status bar or notch
- **WHEN** the installed app launches in standalone mode on a device with a status bar or notch
- **THEN** the header and sticky balance bar are padded clear of the safe area and do not render under the status bar indicators
