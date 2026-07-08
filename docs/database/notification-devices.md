# Table: notification_devices

Represents the devices registered by an authenticated owner to receive notifications.

## Columns

| Column             | Type        | Required | Default           | Description |
| ------------------ | ----------- | -------- | ----------------- | ----------- |
| id                 | uuid        | Yes      | gen_random_uuid() | Device registration identifier |
| owner_id           | uuid        | Yes      | -                 | Owner profile identifier |
| expo_push_token    | text        | Yes      | -                 | Expo push token associated with the device |
| platform           | text        | Yes      | -                 | `ios`, `android`, `web` |
| device_name        | text        | No       | -                 | Human-readable device name when available |
| is_active          | boolean     | Yes      | true              | Whether this device registration is active |
| last_registered_at | timestamptz | Yes      | now()             | Last successful token registration time |
| created_at         | timestamptz | Yes      | now()             | Creation date |
| updated_at         | timestamptz | Yes      | now()             | Last update date |

## Rules

- A user can have multiple registered devices.
- The active device for a token should be tracked with `is_active`.
- `owner_id` must match the authenticated user profile.

## Relationships

```txt
profiles (1) ──────────── (*) notification_devices
```
