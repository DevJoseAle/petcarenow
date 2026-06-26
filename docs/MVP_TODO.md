# PetCareNow MVP TODO

## Current Status

### Authentication

* [x] Sign In
* [x] Sign Up
* [x] Session Persistence
* [x] User Profile Creation
* [x] Apple Sign In

### Database

* [x] profiles
* [x] pets
* [x] pet photo storage bucket

---

# Foundation

## Design System

* [ ] Define color palette
* [ ] Define spacing tokens
* [ ] Define typography tokens
* [ ] Define icon strategy
* [ ] Create reusable Screen component
* [ ] Create reusable Button component
* [ ] Create reusable TextField component
* [ ] Create reusable Card component
* [ ] Create reusable EmptyState component
* [ ] Create reusable LoadingState component

---

# Pet Management

## Specification

* [ ] Create pets specification

## Database

* [ ] Validate pets schema
* [ ] Validate storage integration

## UI

* [x] Pets list screen
* [x] Add pet screen base
* [x] Edit pet screen base
* [ ] Pet profile screen
* [x] Active pet selector

## Features

* [x] Create pet base
* [x] Edit pet base
* [x] Delete pet
* [x] Upload pet photo
* [x] Change active pet

## Tests

* [ ] Pet screens tests
* [ ] Pet view model tests
* [x] Pet service tests

---

# Home

## Specification

* [x] Create home specification

## UI

* [x] Header section
* [x] Active pet card
* [x] Emergency card
* [x] Today for pet card behind flag
* [x] Quick log section
* [x] Upcoming care section
* [x] Care profile section

## Navigation

* [x] Active pet card → Pet profile
* [x] Change pet action
* [x] Emergency action
* [x] Calendar action

## Tests

* [ ] Home UI tests

---

# Next HU

## HU-Perfil de cuidado

* [ ] Definir especificación de perfil de cuidado
* [ ] Implementar edición de datos clínicos/base
* [ ] Integrar entry point para vacunas
* [ ] Agregar tests de hooks/screens del flujo

---

# Emergency

## Specification

* [ ] Create emergency specification

## Database

* [ ] Create veterinary_clinics table
* [ ] Seed initial clinics

## UI

* [ ] Emergency screen
* [ ] Clinic card
* [ ] Clinic detail screen

## Features

* [ ] List clinics
* [ ] Call clinic
* [ ] Open maps

## Tests

* [ ] Emergency screen tests
* [ ] Emergency service tests

---

# Quick Log

## Specification

* [ ] Create quick log specification

## Database

* [ ] Create weight_logs table
* [ ] Create symptom_logs table
* [ ] Create medication_logs table
* [ ] Create pet_notes table

## Weight Log

### UI

* [ ] Weight form
* [ ] Weight history

### Features

* [ ] Create weight entry
* [ ] View weight history

### Tests

* [ ] Weight tests

---

## Symptom Log

### UI

* [ ] Symptom form
* [ ] Symptom history

### Features

* [ ] Create symptom entry
* [ ] View symptom history

### Tests

* [ ] Symptom tests

---

## Medication Log

### UI

* [ ] Medication form
* [ ] Medication history

### Features

* [ ] Create medication entry
* [ ] View medication history

### Tests

* [ ] Medication tests

---

## Notes

### UI

* [ ] Note form
* [ ] Notes history

### Features

* [ ] Create note
* [ ] Edit note
* [ ] Delete note

### Tests

* [ ] Notes tests

---

# Care Events

## Specification

* [ ] Create care events specification

## Database

* [ ] Create care_events table

## UI

* [ ] Events list screen
* [ ] Create event screen
* [ ] Edit event screen
* [ ] Event detail screen

## Features

* [ ] Create event
* [ ] Edit event
* [ ] Delete event
* [ ] Mark event completed

## Event Types

* [ ] Vaccine
* [ ] Deworming
* [ ] Medication
* [ ] Vet appointment
* [ ] Grooming
* [ ] Custom reminder

## Tests

* [ ] Care events tests

---

# Calendar

## Specification

* [ ] Create calendar specification

## UI

* [ ] Calendar screen
* [ ] Day view
* [ ] Upcoming events view

## Features

* [ ] Display care events
* [ ] Open event details
* [ ] Create event from calendar

## Tests

* [ ] Calendar tests

---

# Notifications

## Specification

* [ ] Create notifications specification

## Features

* [ ] Vaccine reminders
* [ ] Medication reminders
* [ ] Care event reminders

## Tests

* [ ] Notification tests

---

# More

## UI

* [ ] User profile screen
* [ ] Settings screen
* [ ] Notifications settings
* [ ] Subscription screen
* [ ] Help screen
* [ ] Legal screen

## Features

* [ ] Sign out
* [ ] Edit profile
* [ ] Notification preferences

## Tests

* [ ] More section tests

---

# MVP Release Checklist

## Product

* [ ] User can create pets
* [ ] User can edit pets
* [ ] User can upload pet photos
* [ ] User can switch active pet

## Home

* [ ] Home displays active pet
* [ ] Home displays upcoming care
* [ ] Home displays quick actions

## Emergency

* [ ] User can find veterinary clinics
* [ ] User can call a clinic
* [ ] User can open directions

## Tracking

* [ ] User can register weight
* [ ] User can register symptoms
* [ ] User can register medication
* [ ] User can create notes

## Planning

* [ ] User can create care events
* [ ] User can view calendar
* [ ] User can receive reminders

## Quality

* [ ] Documentation updated
* [ ] Tests completed
* [ ] Manual QA completed
* [ ] MVP ready for TestFlight
