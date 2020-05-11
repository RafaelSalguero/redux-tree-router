import * as React from "react";
interface State {
    hasError: boolean;
    info?: string;
    verInfo: boolean;
    fullState?: any;
    stack?: string;
}
export class ErrorBoundary extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            hasError: false,
            verInfo: false,
        };
    }

    static getDerivedStateFromError(error: any): Partial<State> {
        console.error(error);
        // Update state so the next render will show the fallback UI.

        let state: string;
        try {
            //state = JSON.stringify(getState());
            state ="";
        } catch (error) {
            state = "No se pudo obtener el state";
        }

        return {
            hasError: true,
            info: error?.toString(),
            fullState: state,
            stack: error?.stack
        };
    }



    render() {
        if (this.state.hasError) {

            return (
                <>
                    <h1>Ha ocurrido un problema :(</h1>
                    Por favor contacte a soporte técnico y envíe la siguiente información:

    {
                        !this.state.verInfo &&
                        <button onClick={() => this.setState({ verInfo: true })} >
                            Ver información técnica
                        </button>
                    }
                    {
                        this.state.verInfo &&
                        <p>
                            <b>error:</b>
                            <p>
                                {this.state.info}
                            </p>

                            <b>stack:</b>
                            <p>
                                {this.state.stack}
                            </p>

                            <b>ruta:</b>
                            <p>
                                {window.location.hash}
                            </p>

                            <b>state:</b>
                            {this.state.fullState}
                        </p>

                    }
                </>
            );
        }

        return this.props.children;
    }
}