import { findRouteByLocation, getRoutePath, ReadyRoute as RouteItem, getLocation } from "../../logic";
import * as React from "react";
import { BreadcrumbItemProps } from "./item";
import { getConf, getNamePath, ParamMap } from "../../logic/types";
import { GotoRelativeFunc, gotoRelative } from "../../logic/location";
import { useSelector } from "react-redux";

interface RouteProps {
    location: string;
    params: any;
}


interface Props<T extends RouteItem> {
    /**Mapa de las rutas a dibujar */
    base: T;
};

interface ViewProps<T extends RouteItem> extends Props<T> {
    /**True para mostrar el icono de home en la raíz del breadcrumb */
    home?: boolean;
    /**Dibuja un elemento del breadcrumb */
    render: React.ComponentType<BreadcrumbItemProps>;
};

class BreadcrumbType<T extends RouteItem> extends React.PureComponent<Props<T>> { }
export function Breadcrumbs<T extends RouteItem>(props: ViewProps<T>) {
    const location = useSelector((state: any) => state.location.type);
    const params = useSelector((state: any) => state.location.payload);

    const currItem =
        getLocation(props.base) == location ? props.base :
            findRouteByLocation(props.base, location);

    if (currItem == null) {
        return null;
    }

    const baseLevel = getNamePath(props.base).length;
    //Todas las partes sin el home:
    const partsTail = getRoutePath<any>(props.base, getNamePath(currItem).slice(baseLevel));
    //Incluyendo el home (si esta configurado así)
    const parts = props.home ? [props.base, ...partsTail] : partsTail;

    return (
        <>
            {
                parts.map((x, i) => {
                    const name = getLocation(x);
                    const conf = getConf(x);
                    const esHome = x == props.base;
                    const esLeaf = i == (parts.length - 1);
                    const gotoRel: GotoRelativeFunc = (up, relativeNamePath, params) => gotoRelative(currItem, { up, relativeNamePath }, params);
                    const label: React.ReactNode = typeof (conf.label) == "function" ? conf.label(params as any, gotoRel) : conf.label;
                    const to = {
                            type: name,
                            payload: params
                    }
                    return <props.render
                        key={to.type}
                        label={label}
                        home={esHome}
                        active={esLeaf}
                        to={to}
                    />
                })
            }
        </>
    );
}
