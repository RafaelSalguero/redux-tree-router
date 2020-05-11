import * as React from "react";
import { ReadyRoute, listSubs, findRouteByLocation, isSubroute } from "../../logic";
import { firstMap, shallowEquals } from "simple-pure-utils";
import { toSelector, createSelector } from "async-reselect";
import { getName, OmitConfSymbol, ParamMap } from "../../logic/types";
import { ErrorBoundary } from "./error";
import { connect } from "react-redux";

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
     * Al componente se le pasará el prop 'route' de tipo @see RouteProps
     */
    map: RouteComponentMap<OmitConfSymbol<T>>;
    /**Componente a dibujar cuando la ruta actual no encaje con ningun elemento de @see base */
    root?: React.ComponentType<RouteComponentProps<any>>;
};

interface ViewProps<T extends ReadyRoute> extends Props<T> {
    location: string;
    params: ParamMap;
};

class RouteRenderView<T extends ReadyRoute> extends React.Component<ViewProps<T>> {

    shouldComponentUpdate(nextProps: Readonly<ViewProps<T>>) {
        /**El map y el route tienen una forma especial de comparar */

        const equals =
            this.props.base == nextProps.base &&
            this.props.root == nextProps.root &&
            this.props.location == nextProps.location &&
            this.props.params == nextProps.params &&
            shallowEquals(this.props.map, nextProps.map)
            ;

        return !equals;
    }

    location = toSelector((props: ViewProps<T>) => props.location);
    params = toSelector((props: ViewProps<T>) => props.params);

    /**El prop que se le pasa al hijo a dibujar lo encerramos en un selector, para que sólo cambie la instancia si de verdad cambio el location y params */
    routeProp = createSelector({
        loc: this.location,
        params: this.params
    }, s => ({
        location: s.loc,
        params: s.params
    } as RouteProps<any>));

    render() {
        const props = this.props;

        const subs = listSubs(props.base);
        const currItem = findRouteByLocation(props.base, this.location.call(this.props));
        if (!currItem) {
            //Ninguna encaja:
            if (!props.root) {
                throw new Error("Ninguna ruta encaja, establezca 'root'");
            }

            const R = props.root;
            return <R route={this.routeProp.call(this.props)} />;
        }

        const key = firstMap(subs, x => isSubroute(x, currItem), x => getName(x)) as keyof OmitConfSymbol<T>;
        const Comp = props.map[key] as React.ComponentClass<RouteComponentProps<any>>;
        if (!Comp) {
            return null;
        }

        return (
            <ErrorBoundary>
                <Comp route={this.routeProp.call(this.props)} />
            </ErrorBoundary>
        );
    }
}

const context = React.createContext({ location: "", params: null as any });
export const RouterViewLocationProvider = context.Provider

const StateRouterViewLocationProvider = connect((state: any) => ({
    location: state.location.type,
    params: state.location.payload
} as any))((props: any) =>
    <RouterViewLocationProvider value={props}>
        {props.children}
    </RouterViewLocationProvider>
);

/**Dibuja un elemento de cierto mapa de rutas, conectandose a la ruta del state.location */
export class RouterView<T extends ReadyRoute> extends React.Component<Props<T>> {
    render() {
        return (
            <StateRouterViewLocationProvider>
                <context.Consumer>
                    {p => <RouteRenderView {... this.props} {...p} />}
                </context.Consumer>
            </StateRouterViewLocationProvider>
        )
    }
}

