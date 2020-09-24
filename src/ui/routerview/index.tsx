import * as React from "react";
import { ReadyRoute, listSubs, findRouteByLocation, isSubroute } from "../../logic";
import { firstMap, shallowEquals } from "simple-pure-utils";
import { toSelector, createSelector } from "async-reselect";
import { getName, OmitConfSymbol, ParamMap } from "../../logic/types";
import { connect } from "react-redux";
import { useRouteKey, useRouteProps } from "../menu";

export interface RouteProps<TParams> {
    location: string;
    params: TParams;
}

/**Props que se le pasan a un componente cuando es dibujado por el @RouterView */
export interface RouteComponentProps<TParams> {
    route?: RouteProps<TParams>;
}

type RouteComponentMap<T> = {
    [K in keyof T]: React.ComponentType<any>
}
interface Props<T extends ReadyRoute> {
    /**Mapa de las rutas a dibujar */
    base: T;
    /**Por cada ruta hija o subhija del arbol de rutas de 'base', el componente a dibujar en esa parte de la ruta.
     * Al componente se le pasarán unos props de tipo @see RouteComponentProps
     */
    map: RouteComponentMap<OmitConfSymbol<T>>;
    /**Componente a dibujar cuando la ruta actual no encaje con ningun elemento de @see base */
    root?: React.ComponentType<RouteComponentProps<any>>;
};

/**Dibuja un elemento de cierto mapa de rutas, conectandose a la ruta del state.location */
export function RouterView<T extends ReadyRoute>(props: Props<T>) {
    const key = useRouteKey(props.base);
    const routeProps = useRouteProps();

    if (!key) {
        //Ninguna encaja:
        if (!props.root) {
            throw new Error("Ninguna ruta encaja, establezca 'root'");
        }

        const R = props.root;
        return <R route={routeProps} />;
    }

    const Comp = props.map[key] as React.ComponentClass<RouteComponentProps<any>>;
    if (!Comp) {
        return null;
    }

    return (
        <Comp route={routeProps} />
    );
}
