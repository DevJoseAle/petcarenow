# PetCareNow Agent Guide

## Project

PetCareNow is a mobile-first pet care application.

Technology stack:

* Expo 56
* React Native
* TypeScript
* Expo Router
* NativeWind
* Zustand
* Supabase

This repository contains only the mobile application.

## Architecture

Feature-first architecture.

```txt
src/
├── app/
├── components/
├── config/
├── core/
└── features/
```

### App

The `app` folder is reserved for Expo Router.

Routes should only import and export screens.

Do not implement screen logic directly inside route files.

### Features

Each feature owns its own implementation.

Standard structure:

```txt
feature/
├── hooks/
├── screens/
├── service/
└── store/
```

Additional folders may be created when justified.

### Components

`src/components` is reserved for shared reusable UI.

Feature-specific components should stay inside their feature.

## Core Rules

* Use strict TypeScript
* Avoid `any`
* Screens end with `Screen`
* Business logic must not live inside screens
* Hooks contain presentation logic
* Services contain integrations
* Stores contain global state
* All screens must use the shared `Screen` component
* Do not install libraries without approval
* Do not modify architecture without approval

## Development Workflow

All work follows:

```txt
SPEC
↓
PLAN
↓
IMPLEMENTATION
↓
TEST
↓
SUMMARY
```

## Documentation Routing

Read only the documentation required for the current task.

### Creating or updating a feature specification

Read:

```txt
docs/SPEC_DRIVEN_DEVELOPMENT.md
```

### Working on UI

Read:

```txt
docs/ARCHITECTURE.md
docs/DESIGN_SYSTEM.md
```

### Working on Hooks/ViewModels

Read:

```txt
docs/ARCHITECTURE.md
docs/TESTING.md
```

### Working on Services or Stores

Read:

```txt
docs/ARCHITECTURE.md
docs/TESTING.md
```

### Working on Tests

Read:

```txt
docs/TESTING.md
```

### Working on a specific feature

Read only:

```txt
docs/specs/<feature-name>.md
```

Never load all feature specifications.

## Approval Required

Ask for approval before:

* Installing dependencies
* Changing architecture
* Modifying routing structure
* Changing shared components
* Introducing new patterns
* Deleting files
* Renaming feature folders
