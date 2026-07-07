# Table: veterinary_services

Services offered by a veterinary clinic.

## Columns

| Column           | Type        | Required | Description |
| ---------------- | ----------- | -------- | ----------- |
| id               | uuid        | Yes      | Unique service id |
| veterinary_id    | uuid        | Yes      | Referenced clinic |
| name             | text        | Yes      | Service name |
| description      | text        | No       | Service description |
| duration_minutes | integer     | No       | Approximate duration |
| price_amount     | numeric     | No       | Optional price |
| currency         | text        | No       | Currency code |
| image_url        | text        | No       | Service image |
| category_code    | text        | Yes      | Referenced category |
| is_available     | boolean     | Yes      | Availability flag |
| created_at       | timestamptz | Yes      | Creation date |
| updated_at       | timestamptz | Yes      | Last update date |
