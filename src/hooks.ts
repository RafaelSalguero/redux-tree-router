import { ReadyRoute } from "./logic";
import { useSelector } from "react-redux";
import { isLocationSubrouteOf, getLocation } from "./logic/location";
import { conf, readyConf } from "./logic/types";

/**
 * Devuelve true si la ruta actual es igual o una subruta de @param route
 * @param exact True si sólo devolver true si la ruta es exactamente igual, false para devolver true si es igual o hijo, default es falso
 */
export function useRoute(route: ReadyRoute, exact?: boolean) : boolean {
    const currentLocation : string = useSelector((state: any) => state.location.type);
    
    const routeLocation = getLocation(route);
    if(exact) {
        return currentLocation == routeLocation;
    }
    
    return isLocationSubrouteOf(routeLocation, currentLocation);
}