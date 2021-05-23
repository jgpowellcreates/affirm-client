import React, {Component} from 'react';
import AuthContext from './AuthContext';
import {RouteComponentProps} from 'react-router-dom';

interface IUserInfoState {
    email?: string | number | readonly string[] | undefined;
    password?: string | number | readonly string[] | undefined;
    fName?: string | number | readonly string[] | undefined;
    lName?: string | number | readonly string[] | undefined;
    isNewAccount: boolean;
}

interface ILoginProps extends RouteComponentProps {

}

export default class Splash extends Component<ILoginProps,IUserInfoState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>

    constructor(props: ILoginProps) {
        super(props);
        this.state = {
            email: '',
            password: '',
            fName: '',
            lName: '',
            isNewAccount: false,
        }
    }

    componentDidMount() {
        console.log("History:",this.props.history)
        this.props.history.push("/");
    }

    toggleLogIn = () => {
        if(this.state.isNewAccount) {
            return(
                <>
                <br />
                <label htmlFor="fName">First Name</label>
                <input
                    required
                    type="text"
                    placeholder="First Name"
                    value={this.state.fName}
                    onChange={this.handleChange('fName')}
                    />
                <label htmlFor="lName">Last Name</label>
                <input
                    required
                    type="text"
                    placeholder="Last Name"
                    value={this.state.lName}
                    onChange={this.handleChange('lName')}
                    />
                <br />
                <button
                    type="button" 
                    onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.sendUserSignIn(e)}>Register</button>
                <button
                    type="button" 
                    onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.setState({isNewAccount: false})}
                    >I Have an Account</button>
                </>
            )
        } else {
            return(
                <>
                <br />
                <button
                    type="button" 
                    onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.sendUserSignIn(e)}>Log In</button>
                <button
                    type="button" 
                    onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.setState({isNewAccount: true})}
                    >I'm a New User</button>
                </>
            )
        }
    }

    handleChange = (prop: keyof IUserInfoState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, [prop]: event.target.value });
      };

    sendUserSignIn = (e:React.MouseEvent<HTMLButtonElement>) => {
        if (e) {e.preventDefault(); }
        console.log("Compiling user info...")
        const url = this.state.isNewAccount ? "auth/register" : "auth/login";
        const bodyObj = this.state.isNewAccount ? {
            email: this.state.email,
            password: this.state.password,
            fName: this.state.fName,
            lName: this.state.lName
        } : {
            email: this.state.email,
            password: this.state.password
        };

        console.log("Start the fetch!")
        fetch(`${process.env.REACT_APP_DATABASE_URL}${url}`, {
            method: "POST",
            body: JSON.stringify(bodyObj),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        })
        .then(data => data.json())
        .then(data => {
            if (data.token) this.props.history.push("/browse");
            console.log(data.token);
            this.context.setToken(data.token);
        })
    }
    
    checkStates() {
        console.log(this.state)
    }

    render() {
        return(
            <div>
                <form>
                    <label htmlFor="email">Email</label>
                    <input
                        required
                        type="text"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.handleChange('email')}
                        />
                    <label htmlFor="password">Password</label>
                    <input
                        required
                        type="password"
                        placeholder="Secure Password"
                        value={this.state.password}
                        onChange={this.handleChange('password')}
                        />
                    {this.toggleLogIn()} 
                </form>
                <button onClick={() => this.checkStates()}>Check States</button>
            </div>
        )
    }
}