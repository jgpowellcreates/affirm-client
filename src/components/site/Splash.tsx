import React, {Component} from 'react';
import AuthContext from './AuthContext';
import {Container, FormControl, InputLabel, Input, Button} from '@material-ui/core/';

interface IUserInfoState {
    email?: string | null;
    password?: string | null;
    fName?: string | null;
    lName?: string | null;
    isNewAccount: boolean;
}

export default class Splash extends Component<{},IUserInfoState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>

    constructor(props: any) {
        super(props);
        this.state = {
            email: null,
            password: null,
            fName: null,
            lName: null,
            isNewAccount: false,
        }
    }

    toggleLogIn = () => {
        if(this.state.isNewAccount) {
            return(
                <>
                <FormControl>
                    <InputLabel>First Name</InputLabel>
                    <Input
                        id="standard-required" 
                        value={this.state.fName}
                        onChange={this.handleChange('fName')}
                        inputProps={{"aria-label":"First Name"}}/>
                </FormControl>
                <FormControl>
                    <InputLabel>Last Name</InputLabel>
                    <Input
                        id="standard-required"
                        value={this.state.lName}
                        onChange={this.handleChange('lName')}
                        inputProps={{"aria-label":"Last Name"}}/>
                </FormControl>
                <br />
                <Button variant="contained" color="primary"
                    onClick={() => this.sendUserSignIn()}>Register</Button>
                <Button variant="contained"
                    onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.setState({isNewAccount: false})}
                    >I Have an Account</Button>
                </>
            )
        } else {
            return(
                <>
                <br />
                <Button variant="contained" color="primary"
                    onClick={() => this.sendUserSignIn()}>Log In</Button>
                <Button variant="contained"
                    onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.setState({isNewAccount: true})}
                    >I'm a New User</Button>
                </>
            )
        }
    }

    handleChange = (prop: keyof IUserInfoState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, [prop]: event.target.value });
      };

    sendUserSignIn = () => {
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
    
    render() {
        return(
            <Container>
                <form>
                    <FormControl>
                        <InputLabel>Email</InputLabel>
                        <Input
                            id="standard-required" 
                            value={this.state.email}
                            onChange={this.handleChange('email')}
                            inputProps={{"aria-label":"Email"}}/>
                    </FormControl>
                    <FormControl>
                        <InputLabel>Password</InputLabel>
                        <Input
                            id="standard-required-password-input" 
                            type="password"
                            value={this.state.password}
                            onChange={this.handleChange('password')}
                            inputProps={{"aria-label":"Password"}}  />
                    </FormControl>
                    {this.toggleLogIn()}
                </form>
            </Container>
        )
    }
}