import * as React from "react";
import { AnyAction } from "redux";

export interface BreadcrumbItemProps {
    /**Breadcrumb label */
    label: React.ReactNode;

    /**Accion de la ruta */
    to: AnyAction

    /**Si este es el elemento activo del breadcrumb, normalmente es el último */
    active: boolean;

    /**Si este breadcrumb es home */
    home: boolean;
}