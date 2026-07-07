# Table: veterinary_service_categories

Catalog of structured veterinary service categories.

## Columns

| Column      | Type    | Required | Description |
| ----------- | ------- | -------- | ----------- |
| code        | text    | Yes      | Stable category code |
| label       | text    | Yes      | Human-readable label |
| description | text    | No       | Optional description |
| sort_order  | integer | Yes      | Display order |

## Notes

- This table avoids inconsistent free text for services.
- Services should always reference one category code.
