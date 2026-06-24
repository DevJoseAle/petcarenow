# Testing Strategy

## Goal

Test behavior.

Do not test implementation details.

## Hooks

Test:

* initial state
* loading state
* success state
* error state
* validations

## Services

Mock external dependencies.

Test:

* success responses
* failures
* empty responses
* mapping logic

Never call real Supabase.

## Stores

Test:

* initial state
* actions
* reset behavior
* persistence behavior

## Components

Test:

* rendering
* user interactions
* conditional rendering
* disabled states

## E2E

Not required unless explicitly requested.

## Test Naming

```txt
useLoginViewModel.test.ts
auth.service.test.ts
auth.store.test.ts
LoginScreen.test.tsx
```

## Mocks

Allowed only in tests.

Use:

* mocks
* spies
* stubs
* fakes

Never use fake implementations in production code.
