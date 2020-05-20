import { RouteItemProps } from "./types";
import { SubrouteMap, listSubs, getLocation, findRouteByLocation } from "../../../logic";
import { hasParams, getName, getConf } from "../../../logic/types";

/**Obtiene todos los props necesarios para dibujar un menu de rutas dado
 * un conjunto de subrutas
 * @param depth Profundidad de @see subrouteMap, si esta es la raíz, debe de ser 0
 */
export function getRenderTree(subrouteMap: SubrouteMap, depth: number = 0): RouteItemProps[] {
    //Sólo mostramos las rutas sin parámetros
    const subs =
        listSubs(subrouteMap)
            .filter(x => !hasParams(x));



    return subs.map<RouteItemProps>(x => {
        const location = getLocation(x);
        
        const name = getName(x);
        const conf = getConf(x);
        const text = "" + (conf.label || name)

        return {
            key: location,
            to: { type: location },
            icon: conf.icon,
            text: text,
            tooltip: conf.description,
            depth: depth + 1,
            subroutes: getRenderTree(x, depth + 1),
            route: x,
        }
    });
}