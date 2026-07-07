create table if not exists public.veterinary_service_categories (
  code text primary key,
  label text not null,
  description text,
  sort_order integer not null default 0
);

alter table public.veterinary_service_categories enable row level security;

create policy "Authenticated users can view veterinary service categories"
on public.veterinary_service_categories
for select
to authenticated
using (true);

insert into public.veterinary_service_categories (
  code,
  label,
  description,
  sort_order
)
values
  ('general_consultation', 'Consulta General', 'Atención general y control preventivo.', 1),
  ('vaccination', 'Vacunación', 'Vacunas y refuerzos.', 2),
  ('emergency', 'Urgencias', 'Atención de urgencia.', 3),
  ('surgery', 'Cirugía', 'Procedimientos quirúrgicos.', 4),
  ('hospitalization', 'Hospitalización', 'Hospitalización y observación.', 5),
  ('diagnostic_imaging', 'Imágenes', 'Ecografía y radiografía.', 6),
  ('laboratory', 'Laboratorio', 'Exámenes y análisis clínicos.', 7),
  ('dentistry', 'Odontología', 'Limpieza y tratamientos dentales.', 8),
  ('dermatology', 'Dermatología', 'Piel, pelo y alergias.', 9),
  ('traumatology', 'Traumatología', 'Lesiones y movilidad.', 10),
  ('cardiology', 'Cardiología', 'Control cardiaco.', 11),
  ('behavior', 'Etología', 'Conducta y comportamiento.', 12),
  ('ophthalmology', 'Oftalmología', 'Salud ocular.', 13),
  ('exotics', 'Exóticos', 'Mascotas exóticas.', 14),
  ('felines', 'Felinos', 'Atención orientada a gatos.', 15),
  ('canines', 'Caninos', 'Atención orientada a perros.', 16),
  ('microchip', 'Microchip', 'Implantación y registro.', 17),
  ('deworming', 'Desparasitación', 'Control antiparasitario.', 18),
  ('euthanasia', 'Eutanasia', 'Acompañamiento y procedimiento.', 19),
  ('certificates', 'Certificados', 'Certificados clínicos o de viaje.', 20),
  ('weight_control', 'Control de peso', 'Seguimiento nutricional y de peso.', 21)
on conflict (code) do nothing;
