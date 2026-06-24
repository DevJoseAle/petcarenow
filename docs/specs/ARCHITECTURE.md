# Architecture

## Folder Structure

```txt
src/
├── app/
├── components/
├── config/
├── core/
└── features/
```

## Responsibilities

### app

Expo Router only.

Contains:

* route files
* layouts
* route groups

Does not contain:

* business logic
* service calls
* state management

### features

Feature ownership.

Example:

```txt
features/auth
features/home
features/pets
features/emergency
```

Each feature owns:

* screens
* hooks
* services
* stores
* types
* feature components

### components

Shared UI only.

Examples:

```txt
Button
TextField
Screen
Card
```

### core

Cross-feature infrastructure.

Examples:

```txt
theme
navigatorTypes
constants
```

## Layer Responsibilities

### Screens

Responsible for:

* rendering UI
* calling ViewModel actions
* navigation

Not responsible for:

* API calls
* validation logic
* business rules

### Hooks

Responsible for:

* presentation state
* form state
* orchestration
* loading/error handling

### Services

Responsible for:

* Supabase
* API calls
* storage
* integrations

### Stores

Responsible for:

* shared state
* persistence
* state mutations

Avoid business logic inside stores.

## State Management

Use:

* local state for local UI
* Zustand for global state

## Data Flow

```txt
Screen
↓
Hook / ViewModel
↓
Service
↓
Supabase
```

Or:

```txt
Screen
↓
Hook
↓
Store
```

## Styling Architecture

PetCareNow uses React Native StyleSheet.

Structure:

src/
├── components/
├── config/
│   └── UI/
│       ├── colors.ts
│       ├── spacing.ts
│       ├── typography.ts
│       └── radius.ts

Styles should consume design tokens whenever possible.

Example:

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    backgroundColor: COLORS.background,
  },
});