import { ReadyRoute, ReadyRouteWithParamsExtra, SubrouteMap, ParamMapTemplate, RouteConfigParams, MappedReadyRoute, RouteConfig, createReadyRoute, RouteConfigBase, ExtractRouteParams, getPath, getNamePath, RouterMap, getConf, ParamMap } from "./types";
import { conf, readyConf } from "./types"; //Se ocupan para que compilen bien los tipos
import { treeTraversal, enumObject, sequenceEquals, take, firstMap, arrayToMap } from "simple-pure-utils";
import { AnyAction } from "redux";
import { getLocation, namePathToLocation, RelativePath, getRelativeNamePath, gotoActionCreator, GotoAction } from "./location";
export { getLocation, GotoAction } from "./location";
export { getNamePath } from "./types";
/**Devuelve en forma de arreglo los elementos de primer nivel de un mapa de rutas */
export function listSubs(sub: SubrouteMap): ReadyRoute[] {
    return enumObject(sub).map(x => x.value);
}

/**Lista todas las rutas de un arbol de rutas */
export function routeMapTraverse(app: ReadyRoute, includeRoot: boolean): ReadyRoute[] {
    const tree = includeRoot ? [app] : [...listSubs(app)];
    return treeTraversal(tree, x => listSubs(x));
}



/**Obtiene el routerMap del react-first-router dado el mapa de ruteo de la aplicación */
export function getRouteMap(app: ReadyRoute): RouterMap {
    const routerItems = routeMapTraverse(app, true);

    const ret = arrayToMap(routerItems, x => getLocation(x), x => ({
        path: getPath(x),
        thunk: getConf(x).thunk
    })) as RouterMap;
    return ret;
}

/**Encuentra una ruta dado su nombre de accion (que es lo mismo que el location) */
export function findRouteByLocation(map: ReadyRoute, location: string): ReadyRoute | undefined {
    const items = routeMapTraverse(map, false);
    return firstMap(items, x => getLocation(x) == location, x => x);
}


/**Dado un conjunto de keys que definen una ruta, devuelve un arreglo con los elementos de esa ruta */
export function getRoutePath<T>(map: SubrouteMap, keys: string[]): ReadyRoute[] {
    if (keys.length == 0)
        return [];
    const head = (map as any)[keys[0]] as ReadyRoute<any>;

    const submap = head;
    const subkeys = keys.slice(1);
    return [head, ...getRoutePath<any>(submap, subkeys)];
}

/**Devuelve true si la ruta 'x' es igual o una subruta de 'base' */
export function isSubroute(base: ReadyRoute, x: ReadyRoute): boolean {
    const basePath = getNamePath(base);
    const xPath = getNamePath(x);

    return sequenceEquals(basePath, take(xPath, basePath.length));
}



/**Devuelve una acción para viajar a cierta ruta, note que hay que tener con el type del action ya que no encaja el objeto con el tipo
 * en sí
 */
export function goto<TRoute extends ReadyRoute & ReadyRouteWithParamsExtra<false>>(route: TRoute): GotoAction
export function goto<TRoute extends ReadyRoute & ReadyRouteWithParamsExtra<true>>(route: TRoute, params: ExtractRouteParams<TRoute>): GotoAction
export function goto<TRoute extends ReadyRoute>(route: TRoute, params?: ExtractRouteParams<TRoute>): GotoAction
export function goto<TRoute extends ReadyRoute>(route: TRoute, params?: ExtractRouteParams<TRoute>): GotoAction {
    const namePath = getNamePath(route);
    return gotoActionCreator(namePath, params);
}


/**Crea una ruta sin parámetros y sin subrutas */
export function route()
    : MappedReadyRoute<{}, RouteConfigParams<{}>, false>
/**Crea una ruta con parámetros, las rutas con parámetros no pueden tener subrutas */
export function route
    <TParams extends ParamMapTemplate>
    (config: RouteConfigParams<TParams>)
    : MappedReadyRoute<{}, RouteConfigParams<TParams>, true>

/**Crea una ruta sin parámetros */
export function route
    <TSubrouteMap extends SubrouteMap>
    (config: RouteConfig, subroutes?: TSubrouteMap)
    : MappedReadyRoute<TSubrouteMap, RouteConfigParams<undefined>, false>

export function route
    <TParams extends ParamMapTemplate | undefined,
        TSubrouteMap extends SubrouteMap>
    (config?: RouteConfigBase, subroutes?: TSubrouteMap)
    : MappedReadyRoute<TSubrouteMap, RouteConfigParams<TParams>, boolean> {

    return createReadyRoute(subroutes, config) as any;
}
