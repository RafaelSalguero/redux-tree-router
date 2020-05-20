# react-tree-router
## Arbol de rutas con `react-first-router`

### Defina su arbol de rutas:
```ts
const routes =
route({
    label: "Inicio"
}, {
    solicitud: route({
        label: "Solicitud"
    }, {
        edit: route({
            params: { id: "string" },
            label: id => "Otro " + id //Los labels pueden acceder a los parámetros, y pueden devolver promesas/observables
        }),
        list: route({
            label: "Listado"
        })
    })
});
```

### Para dibujar las rutas utilice el `RouterView`
    - Dibujara el elemento del mapa de rutas, ya sea si encaja la ruta o subruta
    - Si ningún elemento del mapa de rutas encaja dibuja `root` 

```tsx
<RouterView
    base={routes.solicitud}
    root={Solicitudes}
    map={{
        edit: (route: RouteComponentProps<{id: number}>) => <div>{route.params.id}</div>,
        list: () => <div>hola</div>
    }}
/>;
```

