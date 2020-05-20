import * as React from "react";
import { getRenderTree } from "./logic";
import { SubrouteMap, findRouteByLocation } from "../../../logic";
import { RouteItemProps } from "./types";

interface RouteProps {
    location: string;
    params: any;
}

interface Props {
    /**Mapa de las rutas a dibujar */
    routes: SubrouteMap;
    /**Componente que va a dibujar los elementos del menu.
     * Para saber si el componente esta activo use el @see useLocationActive
    */
    children: React.ComponentType<RouteItemProps>;
};


/**Dibuja un mapa de rutas con un componente específico para dibujar cada uno de los elementos
*/
export function RouteMenu(props: Props) {
    const items = getRenderTree(props.routes, 0);
    const Comp = props.children;

    return items.map(x => {
        return (
            <Comp
                {...x}
            />
        );
    });
}