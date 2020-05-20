import { AnyAction } from "redux";
import { GotoAction, ReadyRoute } from "../../../logic";

/**Props que se le pasan a un compoente que dibuja un conjunto de elementos del menu de ruta */
export interface RenderTreeContainer {
    /**Profundidad del elemento, 0 es raíz */
    depth: number;

    /**Sub rutas hijas a dibujar*/
    subroutes: RenderTreeItem[];
}

/**Props que se le pasan a un componente que dibuja un elemento del menu de ruta */
export interface RenderTreeItem extends RenderTreeContainer {
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

export interface RouteItemProps extends RenderTreeItem {
    /**Si la ruta actual es esta o un hijo */
    active: boolean;
    /**Si la ruta actual es esta */
    activeStrict: boolean;
}