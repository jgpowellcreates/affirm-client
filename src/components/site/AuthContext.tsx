import React from 'react';

export type UserContextProps = {
    token: string | null;
    id: string | null;
    roleId: number | null;
    setToken: CallableFunction;
    clearToken: CallableFunction;
}

//This is the fallback value. 
const AuthContext = React.createContext<UserContextProps>({
    token: null,
    id: null,
    roleId: null,
    setToken: (token: string | null) => {},
    clearToken: () => {}
})

export default AuthContext; //can't write "Export default" followed by "const"

export interface IAuthState {
    token: string | null;
    id: string | null;
    roleId: number | null;
    isLoading: boolean;
}

export class AuthContextProvider extends React.Component<{},IAuthState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            token: localStorage.getItem("token"),
            id: null,
            roleId: null,
            isLoading: true,
        }
    }

    setToken = (token: string | null) => {
        this.setState({token: token})
    }

    clearToken = () => {
        localStorage.clear();
        this.setState({token: null})
    }

    componentDidMount() {
        this.validateToken()
    }

    componentDidUpdate(prevProps: {}, prevState: IAuthState) {
        if (prevState.token !== this.state.token) {
            this.validateToken()
        }
    }

    validateToken = () => {

        if (this.state.token) {
            localStorage.setItem("token", this.state.token);

            fetch(`${process.env.REACT_APP_DATABASE_URL}auth/`, {
                headers: {Authorization: this.state.token}
            })
            .then((res) => {
                if (res.status !== 200) {
                    this.setState({
                        token: null,
                        id: null,
                        roleId: null,
                        isLoading: false
                    });

                    localStorage.removeItem("token");
                }
                return res.json();
            })
            .then((data) => {
                console.log("Context fetch:", data)
                if (data.id) {
                    this.setState({
                        id: data.id,
                        roleId: data.roleId,
                        isLoading: false
                    })
                }
            })
        } else {
            this.setState({
                id: null,
                roleId: null,
                isLoading: false,
            })

            localStorage.removeItem("token");
        }
    }

    //Below, we're providing the initiated context
    render(){
        return(
            <AuthContext.Provider
                value={{
                    token: this.state.token,
                    id: this.state.id,
                    roleId: this.state.roleId,
                    setToken: this.setToken,
                    clearToken: this.clearToken
                }}
            >
            {!this.state.isLoading && this.props.children}
            </AuthContext.Provider>
        )
    }
}