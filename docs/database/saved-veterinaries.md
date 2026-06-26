# Table: saved_veterinaries

Represents a veterinary clinic saved by a user.

## Columns

| Column        | Type        | Required | Default           | Description |
| ------------- | ----------- | -------- | ----------------- | ----------- |
| id            | uuid        | Yes      | gen_random_uuid() | Unique save id |
| owner_id      | uuid        | Yes      | -                 | Owner profile identifier |
| veterinary_id | uuid        | Yes      | -                 | Referenced veterinary |
| pet_id        | uuid        | No       | -                 | Optional associated pet |
| created_at    | timestamptz | Yes      | now()             | Creation date |

## Relationships

```txt
profiles (1) ──────── (*) saved_veterinaries
veterinaries (1) ──── (*) saved_veterinaries
pets (0..1) ───────── (*) saved_veterinaries
```
