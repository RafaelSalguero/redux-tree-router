import { useSelector } from "react-redux";
import { isLocationSubrouteOf, getLocation } from "./logic/location";
import { findRouteByLocation, isSubroute, listSubs, ReadyRoute } from "./logic";
import { conf, ExtractRouteParams, getName, OmitConfSymbol, readyConf } from "./logic/types";
import { firstMap, last } from "simple-pure-utils";
import { RouteProps } from "./ui";
import { useMemo } from "react";

/**Obtiene la ruta actual */
function useCurrentLocation(): string {
    return useSelector((state: any) => state.location.type);
}

function useCurrentParams<T>(): T {
    return useSelector((state: any) => state.location.payload);
}

/**
 * Returns the current route parameters or null if the actual route is not @param route.
 * If the actual route matches but doesn't have parameters returns an empty object 
 * @param strict True to only match @param route, false to match also subroutes
 */
export function useRouteParams<TRoute extends ReadyRoute>(route: TRoute, strict: boolean = false): ExtractRouteParams<TRoute> | null {
    const inRoute = useInRoute(route, strict);
    const stateParams = useCurrentParams<ExtractRouteParams<TRoute>>();
    const params = useMemo(() => stateParams ?? {} , [ stateParams]);

    if(!inRoute) return null;
    return params;
}

/**Obtiene los @see RouteProps de la ruta actual */
export function useRouteProps<TParams>() : RouteProps<TParams> {
    const location = useCurrentLocation();
    const params = useCurrentParams<TParams>();
    
    return useMemo(() => ({
        location: location,
        params: params
    }), [location, params]);
}

/** Obtiene los keys de una ruta */
export type RouteKeys<T extends ReadyRoute> = keyof OmitConfSymbol<T>;

/**Dado un mapa de rutas, obtiene la clave de la ruta actual, encaja tambien las subrutas, si la ruta actual
 * no es hija de la ruta @param base, devuelve null
 */
export function useRouteKey<T extends ReadyRoute>(base: T): RouteKeys<T> | null {
    const location = useCurrentLocation();
    const currItem = findRouteByLocation(base, location);

    if (currItem == null)
        return null;

    const subs = listSubs(base);
    const key = firstMap(subs, x => isSubroute(x, currItem), x => getName(x)) as keyof OmitConfSymbol<T>;

    return key;
}

/**
 * Returns true if @param route is the active route
 * @param strict True to only match @param route, false to match also subroutes
 */
export function useInRoute(route: ReadyRoute, strict: boolean = false) {
    const routeLocation = getLocation(route);
    return useInLocation(routeLocation, strict);
}

/**
 * True if @param location is the active route
 * @param location The action type of the tested route
 * @param strict True to only match the tested route, false to match also subruoutes
 */
export function useInLocation(location: string, strict: boolean = false) {
    const current = useCurrentLocation();
    if (location == current)
        return true;

    if (strict)
        return false;

    return isLocationSubrouteOf(location, current);
}