import { ReadyRoute, getNamePath, ParamMap, ParamMapTemplate } from "./types";
import { take } from "simple-pure-utils";
import { Action } from "redux";

/**Devuelve el nombre de la acción de redux-first-router (que es lo mismo que el location del redux-first-router)*/
export function namePathToLocation(namePath: string[]): string {
    return "goto_" + namePath.join("/");
}

/**Devuelve el nombre de la acción de redux-first-router (que es lo mismo que el location del redux-first-router)*/
export function getLocation(route: ReadyRoute): string {
    return namePathToLocation(getNamePath(route));
}

/**True si @param location es hijo de @param baseLocation 
 * Note que devuelve false si son iguales
*/
export function isLocationSubrouteOf(baseLocation:string, location:string) {
    return location.startsWith(baseLocation + "/");
}

/**Instrucción para viajar a una ruta relativa*/
export interface RelativePath {
    /**Cantidad de niveles para viajar hacia arríba
     * 0 = "./"
     * 1 = "../"
     * 2 = "../../"
     * 3 = ...
     */
    up: number;

    /**Nombres de las rutas a ir después de haber viajado hacia arriba */
    relativeNamePath: string[];
}


/**Se usa como comodin para representar las acciones que son de ruta, ya que el type del action varia con la ruta */
type RouteNameActionPlaceholder = "___ROUTE_NAME_ACTION_PLACEHOLDER";

/**Acción de goto, note que este es un tipo especial ya que no encaja el tipo con el objeto tal cual, pues el tipo de las acciones del router varia con cada ruta, por eso se usa el @see RouteNameActionPlaceholder */
export interface GotoAction extends Action<RouteNameActionPlaceholder> {
    payload: any
}

export function gotoActionCreator(namePath: string[], params: ParamMap | undefined): GotoAction {
    return {
        type: namePathToLocation(namePath) as RouteNameActionPlaceholder,
        payload: params || {}
    };
}

/**Devuelve una acción para viajar a cierta ruta relativz */
export function gotoRelative(current: ReadyRoute, path: RelativePath, params?: ParamMap): GotoAction {
    const namePath = getRelativeNamePath(getNamePath(current), path);
    return gotoActionCreator(namePath, params);

}


/**Viaja a una ruta relativa a la actual
 * @param up Cantidad de niveles a viajar hacia arriba
 */
export interface GotoRelativeFunc {
    (up: number, relativeNamePath: string[], params?: ParamMap): GotoAction
}

/**Obtiene un namePath relativo a otro */
export function getRelativeNamePath(current: string[], path: RelativePath): string[] {
    return [...take(current, current.length - path.up), ...path.relativeNamePath];
}

