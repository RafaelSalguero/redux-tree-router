import { AnyAction } from "redux";
import { last } from "simple-pure-utils";
import { GotoRelativeFunc } from "./location";
import { RxfyScalar } from "react-rxk";

import {  } from "redux-first-router-link";


/**Símbolo de la propiedad que se usa para configurar una ruta */
export const conf = Symbol("routeConfig");
/**Propiedad para las parte calculada de la configuración de la ruta*/
export const readyConf = Symbol("routeReadyConfig");

/**Parametros de una ruta*/
export interface ParamMap {
    [K: string]: string | number;
}

/**Quita el [conf] de un ReadyRoute */
export type OmitConfSymbol<TRoute extends ReadyRoute> = Omit<TRoute, typeof conf>;

/**Indica la forma de los parámetros de una ruta */
export interface ParamMapTemplate {
    [K: string]: "string" | "number"
}

/**Thunk al que se le hace dispatch cuando la ruta es llamada */
export interface RouteThunk {
    (dispatch: (action: AnyAction) => any, getState: () => any): any;
}

export interface RouteConfigBase  {
    /**Acción a ejecutar al entrar en la ruta */
    thunk?: RouteThunk;
    /**Descripción de la ruta */
    description?: string;
    /**Icono de la ruta */
    icon?: JSX.Element;
    /**Ruta o null para autoasignar la ruta */
    path?: string;
    /**Si la ruta esta visible */
    visible?: RxfyScalar<boolean>;
}

/**
 * Configuración de una ruta
 */
export interface RouteConfig
    extends RouteConfigBase {
    /**Label de la ruta, puede ser un string o una función que devuelva el label en función de los parámetros*/
    label?: React.ReactElement | string;
}

/**
 * Configuración de una ruta con parámetros
 */
export interface RouteConfigParams< TParams extends (ParamMapTemplate | undefined) = (ParamMapTemplate | undefined)>
    extends RouteConfigBase {
    /**Parámetros de la ruta */
    params: TParams;

    /**Label de la ruta, puede ser un string o una función que devuelva el label en función de los parámetros*/
    label?: React.ReactNode | ((params: MappedParamMap<TParams>, goto: GotoRelativeFunc) => RxfyScalar<React.ReactNode | null>);
}

/**Propiedades extras que lleva la configuración de un @ReadyRoute */
export interface ReadyRouteConfExtras<THasParams extends boolean> {
    /**Información procesada de la ruta*/
    [readyConf]: {
        /**Ruta calculada de la ruta */
        path: string;
        /**Ruta necesaria para llegar al objeto segun los nombres de las rutas */
        namePath: string[];
        /**Si la ruta tiene parametros */
        hasParams: THasParams;
    }
}

/**Configuración de una ruta que ya fue procesada */
export interface ReadyRouteConfig< TParams extends (ParamMapTemplate | undefined) = (ParamMapTemplate | undefined), THasParams extends boolean = boolean>
    extends RouteConfigParams<  TParams>, ReadyRouteConfExtras<THasParams> { }

/**Devuelve true o falso si los parametros están definidos */
export type TConfigHasParams<TParams extends ParamMapTemplate | undefined> =
    TParams extends {} ? true : false;

/**Indica que la definición de una ruta ya paso por la función @see route y esta lista para es utilizada por el @see RouterView y @see redux-first-router */
export interface ReadyRoute<  TParams extends (ParamMapTemplate | undefined) = (ParamMapTemplate | undefined)> extends Route  {
    [conf]: ReadyRouteConfig<  TParams, TConfigHasParams<TParams>>,
}

/**Convierte un @see Route a un @see ReadyRoute sin parámetros */
export type MappedReadyRoute<TRoute extends SubrouteMap, TConfig extends RouteConfigBase, THasParams extends boolean> =
    TRoute & { [conf]: TConfig & ReadyRouteConfExtras<THasParams> };



/**Convierte un @see ParamMapTemplate a un @see ParamMap*/
export type MappedParamMap<TTemplate extends ParamMapTemplate | undefined> =
    TTemplate extends undefined ? undefined :
    {
        [K in keyof TTemplate]:
        TTemplate[K] extends "string" ? string :
        TTemplate[K] extends "number" ? number : never;
    }

/**Obtiene el tipo del template de parametros de un @see ReadyRoute */
type ExtractRouteParamTemplate<TRoute extends ReadyRoute> = TRoute[typeof conf]["params"];

/**Obtiene el tipo de los parametros (no el tipo del template de parámetros) de un @see ReadyRoute */
export type ExtractRouteParams<TRoute extends ReadyRoute> = MappedParamMap<ExtractRouteParamTemplate<TRoute>>;

/**Un mapa de subrutas */
export interface SubrouteMap  {
    [subroute: string]: ReadyRoute 
}

/**Una definición de una ruta */
export interface Route extends SubrouteMap  {
    [conf]: RouteConfigBase 
}

export interface ReadyRouteWithParamsExtra<THasParams extends boolean> {
    [conf]: {
        [readyConf]: {
            hasParams: THasParams
        }
    }
};

/**Pega los nombres de las claves del subroutemap en cada ruta
 * @param parent undefined para usar el key
 */
function neastRouteNames(routes: SubrouteMap, parent: string | undefined): SubrouteMap {
    let ret: SubrouteMap = {};
    for (const key in routes) {
        const c = routes[key][conf];
        const r = routes[key][conf][readyConf];

        const currParent = parent ?? key;

        ret[key] = {
            ...neastRouteNames(routes[key], currParent),
            [conf]: {
                ...c,
                [readyConf]: {
                    path: c.path ? c.path : ("/" + currParent + r.path),
                    namePath: [currParent, ...r.namePath],
                    hasParams: r.hasParams
                }
            }
        }
    }

    return ret;
}


/**Crea un @see ReadyRoute a partir de una ruta formada por sus subrutas y al configuración de la misma */
export function createReadyRoute(subroutes: SubrouteMap | undefined, config: RouteConfig | undefined): ReadyRoute {
    const route: Route = {
        ...subroutes,
        [conf]: (config ?? {})
    };
    return createReadyRouteFromRoute(route);
}
/**Crea un @see ReadyRoute a partir de un @see Route */
function createReadyRouteFromRoute(route: Route): ReadyRoute {
    const params = (route[conf] as RouteConfigParams)["params"];

    const paramNames = Object.keys(params || {});
    const paramPathParts = paramNames.map(x => ":" + x);
    const currPathParts = paramPathParts.join("/");

    const ret = {
        ...neastRouteNames(route, undefined),
        [conf]: {
            ...route[conf],
            params: params,
            [readyConf]: {
                namePath: [],
                path: "/" + currPathParts,
                hasParams: params != null
            }
        }
    } as ReadyRoute;
    
    return ret;
}

/**Obtiene el path de una ruta, ya sea cakculado o el asignado por el usuario */
export function getPath(route: ReadyRoute): string {
    return route[conf][readyConf].path;
}

/**Obtiene un arreglo de nombres de rutas que representan la ruta completa para llegar a @see route*/
export function getNamePath(route: ReadyRoute): string[] {
    return route[conf][readyConf].namePath;
}

/**Obtiene el nombre de la ruta en la ruta padre. Note que este no es el nombre del action */
export function getName(route: ReadyRoute): string {
    return last(route[conf][readyConf].namePath)!;
}

/**Obtiene la configuración del usuario de la ruta */
export function getConf(route: ReadyRoute) {
    return route[conf];
}

/**Devuelve si una ruta tiene parámetros */
export function hasParams(route: ReadyRoute) {
    return route[conf]["params"] != null;
}

/**True si la configuración es un ReadyConfig, indicando que ya paso por la función que procesa las rutas */
function isReadyRouteConf(config: RouteConfigBase): config is ReadyRouteConfig {
    return (config as ReadyRouteConfig)[readyConf] != null;
}

/**True si la ruta es un @see ReadyRoute */
export function isReadyRoute(route: Route): route is ReadyRoute {
    return isReadyRouteConf(route[conf]);
}


/**Mapa de rutas del react-first-router */
export interface RouterMap {
    [K: string]: {
        path: string;
        thunk: RouteThunk | undefined;
    }
}



