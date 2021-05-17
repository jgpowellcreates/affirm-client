import React from 'react';

export type UserContextProps = {
    token: string | null;
    id: string | null;
    roleId: number | null;
    setToken: CallableFunction;
}

//This is the fallback value. 
const AuthContext = React.createContext<UserContextProps>({
    token: null,
    id: null,
    roleId: null,
    setToken: (token: string | null) => {}
})

export default AuthContext; //can't write "Export default" followed by "const"

export interface IAuthState {
    token: string | null;
    id: string | null;
    roleId: number | null;
}

export class AuthContextProvider extends React.Component<{},IAuthState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            token: localStorage.getItem("token"),
            id: null,
            roleId: null
        }
    }

    setToken = (token: string | null) => {
        this.setState({token: token})
    }

    componentDidMount() {
        this.setState({token: localStorage.getItem("token")})
    }

    componentDidUpdate(prevProps: {}, prevState: IAuthState) {
        if (prevState.token !== this.state.token) {
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
                            roleId: null
                        });

                        localStorage.removeItem("token");
                    }
                    return res.json();
                })
                .then((data) => {
                    console.log("Context fetch:", data)
                    if (data.user) {
                        this.setState({
                            id: data.id,
                            roleId: data.roleId
                        })
                    }
                })
            } else {
                this.setState({
                    id: null,
                    roleId: null
                })

                localStorage.removeItem("token");
            }
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
                    setToken: this.setToken
                }}
            >
            {this.props.children}
            </AuthContext.Provider>
        )
    }
}