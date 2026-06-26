# Domain Model

## User

Represents an authenticated person.

Storage:

```txt
auth.users
```

Responsibilities:

* Authentication
* Session management
* Identity

---

## Profile

Represents the user's application profile.

Storage:

```txt
profiles
```

Responsibilities:

* Personal information
* Country
* Language
* Onboarding state

Relationship:

```txt
User (1) ──── (1) Profile
```

---

## Pet

Represents a pet owned by a profile.

Storage:

```txt
pets
```

Responsibilities:

* Pet identity
* Demographics
* Allergies
* Medical conditions
* Weight
* Activity state

Relationship:

```txt
Profile (1) ──── (*) Pets
```

---

## Care Event

Represents a health or care-related event associated with a pet.

Storage:

```txt
care_events
```

Responsibilities:

* Vaccination history
* Medical consultations
* Scheduled care actions
* Event timeline for calendar

Relationship:

```txt
Pet (1) ──── (*) Care Events
Profile (1) ──── (*) Care Events
```

---

# Current Relationship Tree

```txt
auth.users
└── profiles
    ├── pets
    └── care_events
```

## Ownership Rules

A profile owns its pets.

Ownership is enforced through:

```sql
pets.owner_id = profiles.id
```

RLS ensures users can only access their own pets.

## Future Planned Entities

Potential future entities:

```txt
vaccinations
medications
symptom_checks
emergency_contacts
appointments
health_records
```

## Modeling Decision

For the current roadmap, vaccines and medical visits should not be modeled as standalone top-level tables first.

They should be represented through:

```txt
care_events.event_type = 'vaccine'
care_events.event_type = 'consultation'
```

This keeps Home, Care Profile and Calendar aligned on the same source of truth.
