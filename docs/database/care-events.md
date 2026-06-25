# Table: care_events

Represents scheduled care actions and calendar events for a pet.

## Columns

| Column      | Type        | Required | Default           | Description |
| ----------- | ----------- | -------- | ----------------- | ----------- |
| id          | uuid        | Yes      | gen_random_uuid() | Unique event |
| pet_id      | uuid        | Yes      | -                 | Related pet |
| owner_id    | uuid        | Yes      | -                 | Owner profile identifier |
| event_type  | text        | Yes      | -                 | `medication`, `consultation`, `deworming`, `vaccine`, `custom` |
| title       | text        | Yes      | -                 | Primary label |
| description | text        | No       | -                 | Optional detail |
| starts_at   | timestamptz | Yes      | -                 | Scheduled start |
| ends_at     | timestamptz | No       | -                 | Optional end |
| status      | text        | Yes      | `scheduled`       | `scheduled`, `completed`, `cancelled` |
| reminder_at | timestamptz | No       | -                 | Optional reminder |
| created_at  | timestamptz | Yes      | now()             | Creation date |
| updated_at  | timestamptz | Yes      | now()             | Last update date |

## Rules

- Vaccines are modeled as `event_type = 'vaccine'`
- Home may hide vaccines behind a feature flag while the data exists
- Events should be queryable by `pet_id` and `owner_id`

## Relationships

```txt
pets (1) ──────────── (*) care_events
profiles (1) ──────── (*) care_events
```
