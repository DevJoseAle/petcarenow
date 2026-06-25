# Table: pets

Represents a pet belonging to a user profile.

## Columns

| Column             | Type         | Required | Default           | Description              |
| ------------------ | ------------ | -------- | ----------------- | ------------------------ |
| id                 | uuid         | Yes      | gen_random_uuid() | Unique pet identifier    |
| owner_id           | uuid         | Yes      | -                 | Owner profile identifier |
| name               | text         | Yes      | -                 | Pet name                 |
| pet_type           | pet_type     | Yes      | -                 | Pet species              |
| gender             | pet_gender   | No       | -                 | Pet gender               |
| breed              | text         | No       | -                 | Breed                    |
| birth_date         | date         | No       | -                 | Birth date               |
| age_years          | integer      | No       | -                 | Age in years             |
| weight_kg          | numeric(5,2) | No       | -                 | Weight in kilograms      |
| photo_url          | text         | No       | -                 | Pet photo                |
| allergies          | text[]       | Yes      | {}                | Known allergies          |
| medical_conditions | text[]       | Yes      | {}                | Known medical conditions |
| is_active          | boolean      | Yes      | true              | Active status            |
| created_at         | timestamptz  | Yes      | now()             | Creation date            |
| updated_at         | timestamptz  | Yes      | now()             | Last update date         |

---

## Relationships

### profiles → pets

| Table | Column   | References | Referenced Column |
| ----- | -------- | ---------- | ----------------- |
| pets  | owner_id | profiles   | id                |

Cardinality:

```txt
Profile (1) ──────────── (*) Pets
```

A profile may own multiple pets.

A pet belongs to a single profile.

---

## Ownership Rule

```sql
pets.owner_id = profiles.id
```

---

## Custom Types

### pet_type

Represents the species of the pet.

Examples:

```txt
dog
cat
bird
rabbit
other
```

### pet_gender

Represents the pet gender.

Examples:

```txt
male
female
unknown
```

---

## Row Level Security (RLS)

### Policies

| Policy Name               | Command | Condition (USING)     | Check (WITH CHECK)    |
| ------------------------- | ------- | --------------------- | --------------------- |
| Users can read own pets   | SELECT  | auth.uid() = owner_id | -                     |
| Users can insert own pets | INSERT  | -                     | auth.uid() = owner_id |
| Users can update own pets | UPDATE  | auth.uid() = owner_id | -                     |
| Users can delete own pets | DELETE  | auth.uid() = owner_id | -                     |

### Security Summary

* Users can only view their own pets.
* Users can only create pets for themselves.
* Users can only update their own pets.
* Users can only delete their own pets.

### Effective Rule

```sql
auth.uid() = owner_id
```

All operations are restricted to the authenticated owner of the pet.

---

## Example

```txt
Profile
└── id: user-123

Pets
├── Luna
│   └── owner_id: user-123
│
├── Max
│   └── owner_id: user-123
│
└── Rocky
    └── owner_id: user-123
```
