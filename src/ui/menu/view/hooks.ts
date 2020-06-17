import { useSelector } from "react-redux";
import { isLocationSubrouteOf } from "../../../logic/location";

/**Obtiene la ruta actual */
function useCurrentLocation(): string {
    return useSelector((state: any) => state.location.type);
}

/**
 * Devuelve true si la @param location es la ruta activa
 * @param location La ruta que se desea saber si es activa, es el type del action
 * @param strict False para devolver true si esta activa la ruta o sus hijos, true para solo la ruta
 */
export function useRoute(location: string, strict: boolean = false) {
    const current = useCurrentLocation();
    if (location == current)
        return true;

    if (strict)
        return false;

    return isLocationSubrouteOf(location, current);
}