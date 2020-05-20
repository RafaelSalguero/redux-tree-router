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
            label: "Otro"
        }),
        list: route({
            label: "Listado"
        })
    })
});
```

### Para dibujar las rutas utilice el `RouterView`
```tsx
<RouterView
    base={routes.solicitud}
    map={{
        edit: (route: RouteComponentProps<{id: number}>) => <div>{route.params.id}</div>,
        list: () => <div>hola</div>
    }}
/>;
```