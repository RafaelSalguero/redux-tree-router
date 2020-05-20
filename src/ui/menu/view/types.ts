import { AnyAction } from "redux";
import { GotoAction, ReadyRoute } from "../../../logic";

/**Props que se le pasan a un compoente que dibuja un conjunto de elementos del menu de ruta */
export interface RenderTreeContainer {
    /**Profundidad del elemento, 0 es raíz */
    depth: number;

    /**Sub rutas hijas a dibujar*/
    subroutes: RouteItemProps[];
}

/**Props que se le pasan a un componente que dibuja un elemento del menu de ruta */
export interface RouteItemProps extends RenderTreeContainer {
    /**Nombre único de la ruta */
    key: string;
    /**Acción de ruteo que se debe de ejecutar cuando se de click al botón */
    to: AnyAction;
    /**Icono */
    icon?: React.ReactNode;
    /**Descripción larga*/
    tooltip?: string;
    /**Descripción corta  */
    text?: string;
    route: ReadyRoute;
}
 