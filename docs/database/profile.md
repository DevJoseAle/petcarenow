# Table: profiles

Represents the application profile associated with an authenticated user.

## Columns

| Column               | Type        | Required | Default | Description                               |
| -------------------- | ----------- | -------- | ------- | ----------------------------------------- |
| id                   | uuid        | Yes      | -       | Profile identifier. Matches auth.users.id |
| full_name            | text        | No       | -       | User full name                            |
| avatar_url           | text        | No       | -       | Profile avatar                            |
| country              | text        | No       | -       | User country                              |
| language             | text        | No       | es      | Preferred language                        |
| onboarding_completed | boolean     | No       | false   | Onboarding completion status              |
| created_at           | timestamptz | No       | now()   | Creation date                             |
| updated_at           | timestamptz | No       | now()   | Last update date                          |

---

## Business Rules

* One profile exists for each authenticated user.
* Profile IDs are expected to match Supabase Auth user IDs.
* Onboarding completion is tracked using `onboarding_completed`.

---

## Relationships

### auth.users → profiles

```txt
auth.users (1)
        │
        ▼
profiles (1)
```

Relationship:

```sql
profiles.id = auth.users.id
```

---

## Default Values

| Column               | Value |
| -------------------- | ----- |
| language             | es    |
| onboarding_completed | false |
| created_at           | now() |
| updated_at           | now() |

---

## Security

Profiles are user-owned records.

Access should be restricted to the authenticated owner through Row Level Security policies.
