# Design System

## Screen

All screens must use:

```tsx
<Screen>
```

Responsibilities:

* safe areas
* background
* scrolling behavior

## Naming

Screens:

```txt
LoginScreen
HomeScreen
PetProfileScreen
```

Components:

```txt
PrimaryButton
PetCard
EmergencyButton
```

Hooks:

```txt
useLoginViewModel
usePetProfileViewModel
```

## Shared Components

Located in:

```txt
src/components
```

Feature-specific UI remains inside the feature.

## Styling

Prefer existing theme tokens.

Avoid repeated hardcoded values.

## Component Rules

Components should:

* receive typed props
* remain reusable
* avoid business logic

Components should not:

* call services
* access Supabase
* mutate stores directly
Never create styles inline unless the value is truly dynamic.

Prefer:

const styles = StyleSheet.create(...)

Avoid:

<View style={{ padding: 16 }} />