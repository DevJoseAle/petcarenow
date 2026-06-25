import { AuthRoutes, HomeRoutes } from "./navigatorTypes";

type AppRoutes = 
    AuthRoutes | 
    HomeRoutes;

interface RouteConfig {
  title: string;
}

// Mapa centralizado
export const RouteDetails: Record<AppRoutes, RouteConfig> = {
  [AuthRoutes.Login]: { title: 'Iniciar Sesión' },
  [AuthRoutes.Register]: { title: 'Crear cuenta' },
  [HomeRoutes.Home]: { title: 'Inicio' },
  [HomeRoutes.PetOnboarding]: {
    title: 'Tu mascota',
  },
  [HomeRoutes.Pets]: { title: 'Mascotas' },
  [HomeRoutes.Calendar]: { title: 'Calendario' },
  [HomeRoutes.More]: { title: 'Más' },
  [HomeRoutes.CareProfile]: {
    title: 'Perfil de cuidado',
  },
  [HomeRoutes.RecordEntry]: {
    title: 'Registro rápido',
  },
  [HomeRoutes.EventEntry]: {
    title: 'Programar cuidado',
  },
  [HomeRoutes.Veterinaries]: {
    title: 'Veterinarias',
  },
  [HomeRoutes.VeterinaryProfile]: {
    title: 'Veterinaria',
  },
  [HomeRoutes.PetDetail]: {
    title: 'Detalle de mascota',
  },
};
