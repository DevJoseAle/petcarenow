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

# Current Relationship Tree

```txt
auth.users
└── profiles
    └── pets
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
