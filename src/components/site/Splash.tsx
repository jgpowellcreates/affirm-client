import React, {Component} from 'react';
import AuthContext from './AuthContext';

interface IUserInfoState {
    email?: string | number | readonly string[] | undefined;
    password?: string | number | readonly string[] | undefined;
    fName?: string | number | readonly string[] | undefined;
    lName?: string | number | readonly string[] | undefined;
    isNewAccount: boolean;
}

export default class Splash extends Component<{},IUserInfoState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>

    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            password: '',
            fName: '',
            lName: '',
            isNewAccount: false,
        }
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
                    id="standard-required" 
                    placeholder="First Name"
                    value={this.state.fName}
                    onChange={this.handleChange('fName')}
                    />
                <label htmlFor="lName">Last Name</label>
                <input
                    required
                    type="text"
                    id="standard-required"
                    placeholder="Last Name"
                    value={this.state.lName}
                    onChange={this.handleChange('lName')}
                    />
                <br />
                <button
                    onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.sendUserSignIn(e)}>Register</button>
                <button
                    onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.setState({isNewAccount: false})}
                    >I Have an Account</button>
                </>
            )
        } else {
            return(
                <>
                <br />
                <button
                    onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.sendUserSignIn(e)}>Log In</button>
                <button
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
            console.log(data.token);
            this.context.setToken(data.token)
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
                        id="standard-required" 
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.handleChange('email')}
                        />
                    <label htmlFor="password">Password</label>
                    <input
                        required
                        type="password"
                        id="standard-required-password-input" 
                        placeholder="Secure Password"
                        value={this.state.password}
                        onChange={this.handleChange('password')}
                        /* inputProps={{"aria-label":"Password"}}  */ />
                    {this.toggleLogIn()}
                </form>
                <button onClick={() => this.checkStates()}>Check States</button>
            </div>
        )
    }
}