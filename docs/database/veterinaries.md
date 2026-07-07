# Table: veterinaries

Represents veterinary clinics or emergency centers.

## Columns

| Column                 | Type        | Required | Default           | Description |
| ---------------------- | ----------- | -------- | ----------------- | ----------- |
| id                     | uuid        | Yes      | gen_random_uuid() | Unique veterinary id |
| name                   | text        | Yes      | -                 | Clinic name |
| address                | text        | Yes      | -                 | Street address |
| city                   | text        | Yes      | -                 | City name |
| phone                  | text        | No       | -                 | Contact phone |
| email                  | text        | No       | -                 | Contact email |
| website_url            | text        | No       | -                 | Website URL |
| whatsapp_phone         | text        | No       | -                 | WhatsApp phone |
| instagram_url          | text        | No       | -                 | Instagram profile |
| facebook_url           | text        | No       | -                 | Facebook page |
| tiktok_url             | text        | No       | -                 | TikTok profile |
| photo_url              | text        | No       | -                 | Main public image URL |
| logo_url               | text        | No       | -                 | Logo image URL |
| cover_url              | text        | No       | -                 | Cover image URL |
| latitude               | numeric     | Yes      | -                 | Latitude |
| longitude              | numeric     | Yes      | -                 | Longitude |
| is_emergency           | boolean     | Yes      | false             | Supports emergencies |
| is_24_7                | boolean     | Yes      | false             | Open 24/7 |
| description            | text        | No       | -                 | Extra details |
| years_experience       | integer     | No       | -                 | Years of experience |
| mission                | text        | No       | -                 | Clinic mission |
| values                 | text        | No       | -                 | Clinic values |
| languages              | text[]      | No       | -                 | Supported languages |
| parking_available      | boolean     | No       | false             | Parking available |
| accessibility_features | text        | No       | -                 | Accessibility notes |
| accepts_insurance      | boolean     | No       | false             | Future insurance support |
| payment_methods        | text[]      | No       | -                 | Supported payment methods |
| offers_home_visit      | boolean     | No       | false             | Offers home visits |
| home_visit_notes       | text        | No       | -                 | Home visit notes |
| created_at             | timestamptz | Yes      | now()             | Creation date |
| updated_at             | timestamptz | Yes      | now()             | Last update date |

## Notes

- `veterinaries` is the root table for clinic identity and operational data.
- Repeatable or structured modules such as services, staff, and hours should live in related tables.
