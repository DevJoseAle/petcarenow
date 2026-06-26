# Table: care_events

Represents scheduled care actions and calendar events for a pet.

This table is also the source for:

- vaccination summaries inside Care Profile
- latest medical visit inside Care Profile
- upcoming care cards in Home
- calendar/event listing in future HUs

## Columns

| Column      | Type        | Required | Default           | Description |
| ----------- | ----------- | -------- | ----------------- | ----------- |
| id          | uuid        | Yes      | gen_random_uuid() | Unique event |
| pet_id      | uuid        | Yes      | -                 | Related pet |
| owner_id    | uuid        | Yes      | -                 | Owner profile identifier |
| event_type  | text        | Yes      | -                 | `medication`, `consultation`, `deworming`, `vaccine`, `custom` |
| title       | text        | Yes      | -                 | Primary label |
| description | text        | No       | -                 | Optional detail |
| starts_at   | timestamptz | Yes      | -                 | Scheduled or applied date/time |
| ends_at     | timestamptz | No       | -                 | Optional end |
| status      | text        | Yes      | `scheduled`       | `scheduled`, `completed`, `cancelled` |
| reminder_at | timestamptz | No       | -                 | Optional reminder |
| metadata    | jsonb       | No       | -                 | Structured event-specific details |
| created_at  | timestamptz | Yes      | now()             | Creation date |
| updated_at  | timestamptz | Yes      | now()             | Last update date |

## Rules

- Vaccines are modeled as `event_type = 'vaccine'`
- Medical visits are modeled as `event_type = 'consultation'`
- Home may hide vaccines behind a feature flag while the data exists
- Events should be queryable by `pet_id` and `owner_id`
- Care Profile reads:
  - vaccine summary from `event_type = 'vaccine'`
  - latest medical visit from the most recent `event_type = 'consultation'`
- For completed historical events:
  - `starts_at` represents the effective date/time of the vaccine or visit
  - `status = 'completed'` is preferred
- This table should support both:
  - historical medical information
  - future scheduled reminders

## Relationships

```txt
pets (1) ──────────── (*) care_events
profiles (1) ──────── (*) care_events
```

## Metadata Conventions

`metadata` should remain optional, but when present it should follow event-specific conventions.

### Vaccine metadata

Recommended keys:

```json
{
  "vaccine_name": "Rabia",
  "dose": "1ra dosis",
  "applied_at": "2026-06-26T10:30:00Z",
  "next_due_at": "2027-06-26T10:30:00Z",
  "notes": "Sin reacciones"
}
```

Notes:

- `title` should stay human readable, e.g. `Vacuna antirrabica`
- `starts_at` should generally match `applied_at` for completed vaccines

### Consultation metadata

Recommended keys:

```json
{
  "clinic_name": "Clinica Vet Norte",
  "doctor_name": "Dra. Perez",
  "reason": "Control general",
  "notes": "Se recomienda seguimiento en 6 meses"
}
```

Notes:

- `title` should stay human readable, e.g. `Consulta de control`
- `starts_at` should represent the date/time of the visit

## Query Defaults

### Vaccination summary

Base filter:

```sql
owner_id = :owner_id
and pet_id = :pet_id
and event_type = 'vaccine'
and status <> 'cancelled'
```

Suggested ordering:

```sql
starts_at desc
```

### Latest medical visit

Base filter:

```sql
owner_id = :owner_id
and pet_id = :pet_id
and event_type = 'consultation'
and status = 'completed'
```

Suggested ordering:

```sql
starts_at desc
limit 1
```

## Constraints and Indexes

Recommended constraints:

- check `event_type` against allowed values
- check `status` against allowed values
- foreign key `pet_id -> pets.id`
- foreign key `owner_id -> profiles.id`

Recommended indexes:

- `(owner_id, pet_id, event_type, starts_at desc)`
- `(owner_id, starts_at desc)`

## RLS Expectations

Users must only access their own events.

Ownership rule:

```sql
care_events.owner_id = auth.uid()
```

If the project keeps `profiles.id = auth.users.id`, this rule stays aligned with the current ownership model.
