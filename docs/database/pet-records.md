# Table: pet_records

Represents quick health logs for a pet.

## Columns

| Column       | Type        | Required | Default           | Description                         |
| ------------ | ----------- | -------- | ----------------- | ----------------------------------- |
| id           | uuid        | Yes      | gen_random_uuid() | Unique record identifier            |
| pet_id       | uuid        | Yes      | -                 | Related pet                         |
| owner_id     | uuid        | Yes      | -                 | Owner profile identifier            |
| record_type  | text        | Yes      | -                 | `weight`, `symptom`, `medication`, `note` |
| recorded_at  | timestamptz | Yes      | -                 | Combined date and time of the log   |
| description  | text        | Yes      | -                 | Human-readable detail               |
| value_numeric| numeric     | No       | -                 | Numeric value for weight-like logs  |
| value_unit   | text        | No       | -                 | Unit, e.g. `kg`                     |
| metadata     | jsonb       | No       | -                 | Extra structured info               |
| created_at   | timestamptz | Yes      | now()             | Creation date                       |
| updated_at   | timestamptz | Yes      | now()             | Last update date                    |

## Rules

- `weight` uses `value_numeric` and `value_unit = 'kg'`
- `symptom`, `medication` and `note` rely primarily on `description`
- `owner_id` must match the authenticated profile

## Relationships

```txt
pets (1) ──────────── (*) pet_records
profiles (1) ──────── (*) pet_records
```
