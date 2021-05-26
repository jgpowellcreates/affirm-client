import React from 'react';
import {IAffirmations, IUserCollections} from '../../types/Models';

export type UserContextProps = {
    token: string | null;
    id: string | null;
    roleId: number | null;
    allUserColls: IUserCollections[];
    allAffs: IAffirmations[];
    setToken: CallableFunction;
    clearToken: CallableFunction;
    update: CallableFunction;
}

//This is the fallback value. 
const AuthContext = React.createContext<UserContextProps>({
    token: null,
    id: null,
    roleId: null,
    allUserColls: [],
    allAffs: [],
    setToken: (token: string | null) => {},
    clearToken: () => {},
    update: () => {},
})

export default AuthContext; //can't write "Export default" followed by "const"

export interface IAuthState {
    token: string | null;
    id: string | null;
    roleId: number | null;
    isLoading: boolean;
    allUserColls: IUserCollections[],
    allAffs: IAffirmations[];
}

export class AuthContextProvider extends React.Component<{},IAuthState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            token: localStorage.getItem("token"),
            id: null,
            roleId: null,
            isLoading: true,
            allUserColls: [],
            allAffs: [],
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
    
    createFirstUserCollection = (name:string) => {
        const bodyObj = {
            title: `${name}'s Collection`,
            description: "Your affirmations are stored in collections. You can edit these or their contents anytime!",
        }

        fetch(`${process.env.REACT_APP_DATABASE_URL}mycollections/new`, {
            method: "POST",
            body: JSON.stringify(bodyObj),
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": `${this.state.token}`
            })
        })
        .then(data => data.json())
        .then((data) => {console.log(data)})
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
                //console.log("Context fetch:", data)
                let allAffirmations : IAffirmations[] = [];

                if (data.id) {
                    
                    if (data.userCollectionInfo.length > 0) {
                        data.userCollectionInfo.map((coll:IUserCollections) => {
                            return allAffirmations.push(...coll.affirmations)
                        })

                    } else {
                        this.createFirstUserCollection(data.fName)
                    }

                    this.setState({
                        id: data.id,
                        roleId: data.roleId,
                        allUserColls: data.userCollectionInfo,
                        allAffs: allAffirmations,
                        isLoading: false,
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
                    allUserColls: this.state.allUserColls,
                    allAffs: this.state.allAffs,
                    setToken: this.setToken,
                    clearToken: this.clearToken,
                    update: this.validateToken,
                }}
            >
            {!this.state.isLoading && this.props.children}
            </AuthContext.Provider>
        )
    }
}