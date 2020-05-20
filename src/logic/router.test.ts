import { route, goto } from "./api";
import { ReadyRoute , MappedReadyRoute, RouteConfigParams, conf, readyConf } from "./types";
import { RouterView, RouteProps } from "../ui";
import * as React from "react";

test("route test", () => {
    const routes =
        route({
            label: "Inicio"
        }, {
            solicitud: route({
                label: "Solicitud"
            }, {
                edit: route({
                    params: { id: "string" },
                    label: "Otro"
                }),
                list: route({
                    label: "Listado"
                })
            })
        });


    goto(routes.solicitud.edit, { id: "hola" });
    goto(routes.solicitud);

    const expected = {
        [conf]: {
            label: "Inicio",
            params: undefined,
            [readyConf]: {
                hasParams: false,
                namePath: [],
                path: "/"
            }
        },
        solicitud: {
            [conf]: {
                label: "Solicitud",
                params: undefined,
                [readyConf]: {
                    hasParams: false,
                    namePath: ["solicitud"],
                    path: "/solicitud/"
                }
            },
            edit: {
                [conf]: {
                    label: "Otro",
                    params: { id: "string" },
                    [readyConf]: {
                        hasParams: true,
                        namePath: ["solicitud", "edit"],
                        path: "/solicitud/edit/:id"
                    }
                },
            },
            list: {
                [conf]: {
                    label: "Listado",
                    params: undefined,
                    [readyConf]: {
                        hasParams: false,
                        namePath: ["solicitud", "list"],
                        path: "/solicitud/list/"
                    }
                },
            }
        }
    }

 

    expect(routes).toEqual(expected);
    console.log(routes);
})