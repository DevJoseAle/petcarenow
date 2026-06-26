# Table: veterinaries

Represents veterinary clinics or emergency centers.

## Columns

| Column       | Type        | Required | Default           | Description |
| ------------ | ----------- | -------- | ----------------- | ----------- |
| id           | uuid        | Yes      | gen_random_uuid() | Unique veterinary id |
| name         | text        | Yes      | -                 | Clinic name |
| address      | text        | Yes      | -                 | Street address |
| city         | text        | Yes      | -                 | City name |
| phone        | text        | No       | -                 | Contact phone |
| latitude     | numeric     | Yes      | -                 | Latitude |
| longitude    | numeric     | Yes      | -                 | Longitude |
| is_emergency | boolean     | Yes      | false             | Supports emergencies |
| is_24_7      | boolean     | Yes      | false             | Open 24/7 |
| description  | text        | No       | -                 | Extra details |
| created_at   | timestamptz | Yes      | now()             | Creation date |
| updated_at   | timestamptz | Yes      | now()             | Last update date |

## Notes

- The app will start with mock-first data until the real sourcing process is complete.
- Data should still be shaped to match this contract from day one.
