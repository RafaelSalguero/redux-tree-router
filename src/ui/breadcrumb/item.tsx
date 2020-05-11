import * as React from "react";
import {  RxfyScalar } from "react-rxk";

export interface BreadcrumbItemProps {
    /**Breadcrumb label */
    label: React.ReactNode;

    /**Nombre de la ruta */
    name: string;

    /**Parámetros de la ruta */
    params: any;

    /**Si este es el elemento activo del breadcrumb, normalmente es el último */
    active: boolean;

    /**Si este breadcrumb es home */
    home: boolean;
}