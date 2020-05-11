import * as React from "react";
import { getRenderTree } from "./logic";
import { SubrouteMap } from "../../../logic";
import { RouterContainerProps, RouterItemProps } from "./types";

interface RouteProps {
    location: string;
    params: any;
}

interface Props {
    /**Mapa de las rutas a dibujar */
    routes: SubrouteMap;
    /**Componente que va a dibujar los elementos del menu */
    children: React.ComponentType<RouterItemProps>;
};


/**Dibuja un mapa de rutas con un componente específico para dibujar cada uno de los elementos
*/
export class RouteMenu extends React.PureComponent<Props> {
    render() {
        const props = this.props;
        const items = getRenderTree(props.routes, 0);
        const Comp = props.children;
        return items.map(x => <Comp {...x} />);
    }
}