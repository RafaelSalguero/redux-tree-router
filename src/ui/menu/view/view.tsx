import * as React from "react";
import { getRenderTree } from "./logic";
import { SubrouteMap, findRouteByLocation } from "../../../logic";
import { RouterContainerProps, RouterItemProps, RouteItemPropsActive } from "./types";
import { useSelector } from "react-redux";

interface RouteProps {
    location: string;
    params: any;
}

interface Props {
    /**Mapa de las rutas a dibujar */
    routes: SubrouteMap;
    /**Componente que va a dibujar los elementos del menu */
    children: React.ComponentType<RouteItemPropsActive>;
};


/**Dibuja un mapa de rutas con un componente específico para dibujar cada uno de los elementos
*/
export class RouteMenu extends React.PureComponent<Props> {
    render() {
        const props = this.props;
        const items = getRenderTree(props.routes, 0);
        const Comp = props.children;

        const currentLocation: string = useSelector((state: any) => state.location.type);
      

        return items.map(x => {
            const location = x.key;
            const currentActive = location == currentLocation;
            
            const childActive = findRouteByLocation(x.route, currentLocation) != null;
    
            const activeStrict = currentActive;
            const active = activeStrict || childActive;

            return (
                <Comp
                    {...x}
                    activeStrict={activeStrict}
                    active={active}
                />
            );
        });
    }
}