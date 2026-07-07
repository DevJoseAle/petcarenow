-- Seed completo para enriquecer la veterinaria:
-- 6e0c2afd-2c2a-451a-b3f4-1db7787e15d7
--
-- Úsalo en Supabase SQL Editor.
-- Hace:
-- 1. update de la tabla public.veterinaries
-- 2. borra datos relacionados actuales de servicios/equipo/horarios
-- 3. inserta datos demo para visualizar el perfil rico en la app

begin;

update public.veterinaries
set
  name = 'Paw & Care',
  address = 'Avenida Nueva Providencia 2155',
  city = 'Santiago',
  phone = '+56 2 2984 7610',
  email = 'hola@pawandcare.cl',
  website_url = 'https://pawandcare.cl',
  whatsapp_phone = '+56 9 8765 4321',
  instagram_url = 'https://instagram.com/pawandcare.cl',
  facebook_url = 'https://facebook.com/pawandcare.cl',
  tiktok_url = 'https://tiktok.com/@pawandcare.cl',
  photo_url = 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80',
  logo_url = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  cover_url = 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1600&q=80',
  latitude = -33.42532,
  longitude = -70.61715,
  is_emergency = true,
  is_24_7 = false,
  description = 'En Paw & Care cuidamos a tu mascota como si fuera parte de nuestra familia, con atención clínica cercana, clara y profesional.',
  years_experience = 8,
  mission = 'Brindar atención veterinaria integral con calidez humana, criterio clínico y seguimiento constante para cada familia.',
  values = 'Amor, compromiso, respeto, excelencia, empatía.',
  languages = array['Español', 'English'],
  parking_available = true,
  accessibility_features = 'Entrada a nivel calle, box accesible y apoyo para movilidad reducida.',
  accepts_insurance = false,
  payment_methods = array['Efectivo', 'Tarjeta', 'Transferencia'],
  offers_home_visit = true,
  home_visit_notes = 'Visitas a domicilio disponibles en Providencia, Ñuñoa, Las Condes y Santiago Centro previa coordinación.'
where id = '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7';

delete from public.veterinary_services
where veterinary_id = '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7';

delete from public.veterinary_staff
where veterinary_id = '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7';

delete from public.veterinary_hours
where veterinary_id = '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7';

insert into public.veterinary_services (
  veterinary_id,
  name,
  description,
  duration_minutes,
  price_amount,
  currency,
  image_url,
  category_code,
  is_available
)
values
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'Consulta general',
    'Evaluación clínica completa, control preventivo y plan de cuidados personalizado.',
    30,
    25000,
    'CLP',
    'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=800&q=80',
    'general_consultation',
    true
  ),
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'Vacunación',
    'Vacunas esenciales, refuerzos y revisión previa según edad y condición.',
    20,
    22000,
    'CLP',
    'https://images.unsplash.com/photo-1583512603806-077998240c7a?auto=format&fit=crop&w=800&q=80',
    'vaccination',
    true
  ),
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'Urgencias',
    'Atención prioritaria para cuadros agudos, dolor, vómitos, heridas y descompensaciones.',
    45,
    45000,
    'CLP',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'emergency',
    true
  ),
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'Cirugía',
    'Procedimientos programados y cirugías menores con seguimiento postoperatorio.',
    90,
    150000,
    'CLP',
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    'surgery',
    true
  ),
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'Hospitalización',
    'Observación clínica breve y soporte para pacientes en recuperación.',
    120,
    80000,
    'CLP',
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
    'hospitalization',
    true
  ),
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'Ecografía',
    'Estudio por imágenes para apoyo diagnóstico y seguimiento.',
    35,
    55000,
    'CLP',
    'https://images.unsplash.com/photo-1511174511562-5f97f4f4a6d9?auto=format&fit=crop&w=800&q=80',
    'diagnostic_imaging',
    true
  ),
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'Laboratorio clínico',
    'Perfil sanguíneo, bioquímica y exámenes rápidos de apoyo.',
    25,
    32000,
    'CLP',
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
    'laboratory',
    true
  ),
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'Control de peso',
    'Seguimiento nutricional y evaluación de condición corporal.',
    25,
    18000,
    'CLP',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
    'weight_control',
    true
  );

insert into public.veterinary_staff (
  veterinary_id,
  photo_url,
  full_name,
  specialty,
  university,
  years_experience,
  bio,
  languages,
  schedule_notes,
  instagram_url,
  is_active
)
values
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
    'Dra. María López',
    'Medicina interna',
    'Universidad de Chile',
    8,
    'Médica veterinaria enfocada en medicina preventiva, pacientes crónicos y acompañamiento familiar.',
    array['Español', 'English'],
    'Lunes a viernes de 09:00 a 17:00.',
    'https://instagram.com/dra.marialopezvet',
    true
  ),
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80',
    'Dr. Carlos Ruiz',
    'Cirugía veterinaria',
    'Universidad Mayor',
    10,
    'Especialista en cirugía de tejidos blandos y resolución de urgencias quirúrgicas.',
    array['Español'],
    'Bloque quirúrgico de lunes, miércoles y viernes.',
    'https://instagram.com/dr.carlosruizvet',
    true
  ),
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=800&q=80',
    'Dra. Ana Torres',
    'Dermatología',
    'Universidad Andrés Bello',
    6,
    'Consulta de piel, alergias, otitis recurrentes y planes de seguimiento dermatológico.',
    array['Español', 'English'],
    'Martes y jueves con agenda extendida.',
    null,
    true
  );

insert into public.veterinary_hours (
  veterinary_id,
  hour_type,
  day_of_week,
  opens_at,
  closes_at,
  notes,
  is_24_hours,
  is_closed
)
values
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'general',
    1,
    '08:00',
    '20:00',
    null,
    false,
    false
  ),
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'general',
    2,
    '08:00',
    '20:00',
    null,
    false,
    false
  ),
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'general',
    3,
    '08:00',
    '20:00',
    null,
    false,
    false
  ),
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'general',
    4,
    '08:00',
    '20:00',
    null,
    false,
    false
  ),
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'general',
    5,
    '08:00',
    '20:00',
    null,
    false,
    false
  ),
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'general',
    6,
    '09:00',
    '16:00',
    null,
    false,
    false
  ),
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'general',
    0,
    '10:00',
    '14:00',
    null,
    false,
    false
  ),
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'emergency',
    null,
    null,
    null,
    'Urgencias disponibles todos los días por evaluación y derivación prioritaria.',
    true,
    false
  ),
  (
    '6e0c2afd-2c2a-451a-b3f4-1db7787e15d7',
    'home_visit',
    null,
    '15:00',
    '21:00',
    'Atención a domicilio de lunes a sábado previa coordinación.',
    false,
    false
  );

commit;
