# Table: veterinary_staff

Medical staff associated with a veterinary clinic.

## Columns

| Column           | Type        | Required | Description |
| ---------------- | ----------- | -------- | ----------- |
| id               | uuid        | Yes      | Unique staff id |
| veterinary_id    | uuid        | Yes      | Referenced clinic |
| photo_url        | text        | No       | Profile image |
| full_name        | text        | Yes      | Staff full name |
| specialty        | text        | No       | Main specialty |
| university       | text        | No       | University |
| years_experience | integer     | No       | Years of experience |
| bio              | text        | No       | Short biography |
| languages        | text[]      | No       | Spoken languages |
| schedule_notes   | text        | No       | Optional schedule notes |
| instagram_url    | text        | No       | Instagram URL |
| facebook_url     | text        | No       | Facebook URL |
| linkedin_url     | text        | No       | LinkedIn URL |
| is_active        | boolean     | Yes      | Active flag |
| created_at       | timestamptz | Yes      | Creation date |
| updated_at       | timestamptz | Yes      | Last update date |
