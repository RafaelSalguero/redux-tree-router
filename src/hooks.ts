import { useSelector } from "react-redux";
import { isLocationSubrouteOf, getLocation } from "./logic/location";
import { ReadyRoute } from "./logic";

/**Obtiene la ruta actual */
function useCurrentLocation(): string {
    return useSelector((state: any) => state.location.type);
}

/**
 * Devuelve true si @param route es la ruta activa
 */
export function useInRoute(route: ReadyRoute, strict: boolean = false) {
    const routeLocation = getLocation(route);
    return useInLocation(routeLocation, strict);
}

/**
 * Devuelve true si la @param location es la ruta activa
 * @param location La ruta que se desea saber si es activa, es el type del action
 * @param strict False para devolver true si esta activa la ruta o sus hijos, true para solo la ruta
 */
export function useInLocation(location: string, strict: boolean = false) {
    const current = useCurrentLocation();
    if (location == current)
        return true;

    if (strict)
        return false;

    return isLocationSubrouteOf(location, current);
}