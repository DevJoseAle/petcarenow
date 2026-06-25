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
  [HomeRoutes.Detail]: { title: 'Detalle del Producto' },
  [HomeRoutes.PetOnboarding]: {
    title: 'Tu mascota',
  },
};
