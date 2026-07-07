# Table: veterinary_hours

Structured schedule blocks for veterinary clinics.

## Columns

| Column        | Type        | Required | Description |
| ------------- | ----------- | -------- | ----------- |
| id            | uuid        | Yes      | Unique hour block id |
| veterinary_id | uuid        | Yes      | Referenced clinic |
| hour_type     | text        | Yes      | Block type |
| day_of_week   | integer     | No       | 0-6 day of week |
| opens_at      | time        | No       | Opening time |
| closes_at     | time        | No       | Closing time |
| notes         | text        | No       | Extra notes |
| is_24_hours   | boolean     | Yes      | 24 hours block |
| is_closed     | boolean     | Yes      | Closed block |
| created_at    | timestamptz | Yes      | Creation date |
| updated_at    | timestamptz | Yes      | Last update date |
