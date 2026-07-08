# Table: notification_preferences

Represents the notification preferences configured by each authenticated owner.

## Columns

| Column                  | Type        | Required | Default | Description |
| ----------------------- | ----------- | -------- | ------- | ----------- |
| owner_id                | uuid        | Yes      | -       | Owner profile identifier |
| upcoming_care_enabled   | boolean     | Yes      | true    | Enables reminders for upcoming care events |
| medications_enabled     | boolean     | Yes      | true    | Enables reminders for medication events |
| vaccines_enabled        | boolean     | Yes      | true    | Enables reminders for vaccine-related events |
| important_alerts_enabled| boolean     | Yes      | true    | Enables alerts for relevant care situations |
| daily_summary_enabled   | boolean     | Yes      | false   | Enables a daily app reminder |
| created_at              | timestamptz | Yes      | now()   | Creation date |
| updated_at              | timestamptz | Yes      | now()   | Last update date |

## Rules

- One row per owner.
- `owner_id` must match the authenticated user profile.
- Preferences are the source of truth for client-side scheduling decisions.

## Relationships

```txt
profiles (1) ──────────── (1) notification_preferences
```
