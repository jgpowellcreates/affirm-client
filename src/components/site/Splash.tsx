import React, {Component} from 'react';
import AuthContext from './AuthContext';
import {RouteComponentProps} from 'react-router-dom';

interface IUserInfoState {
    email: string;
    password: string;
    fName: string;
    lName: string;
    isNewAccount: boolean;
    emailError: boolean;
    passwordError: boolean;
    fNameError: boolean;
    lNameError: boolean;
    formIsValid: boolean;
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
            emailError: false,
            passwordError: false,
            fNameError: false,
            lNameError: false,
            formIsValid: true,
        }
    }

    componentDidMount() {
        console.log("History:",this.props.history)
        this.props.history.push("/");
    } 

    handleChange = (prop: keyof IUserInfoState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, [prop]: event.target.value });
      };

    
    emailError = false;
    passwordError = false;
    fNameError = false;
    lNameError = false;

    validateForm(e:React.MouseEvent<HTMLButtonElement>) {
        if (e) {e.preventDefault(); }
        console.log("validateForm is firing")

        //Email
        this.state.email.match(/(\w\.?)+@[\w\.-]+\.\w{2,}/) ? this.emailError = false : this.emailError = true;

        //Password
        this.state.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/) ? this.passwordError = false : this.passwordError = true;

        //fName
        this.state.fName.match(/[A-Za-z]{1,16}/) ? this.fNameError = false : this.fNameError = true

        //lName
        this.state.lName.match(/[A-Za-z]{1,16}/) ? this.lNameError = false : this.lNameError = true

        console.log("Vars before setting State", this.emailError, this.passwordError, this.fNameError, this.lNameError)
        this.checkForm()
        //this.setState({emailError:emailError,passwordError:passwordError,fNameError:fNameError,lNameError:lNameError}, () => this.checkForm())
    }

    checkForm = () => {

        if(this.state.isNewAccount) {
            if (this.emailError === true ||
                this.passwordError === true ||
                this.fNameError === true ||
                this.lNameError === true) {
                    console.log("Something on this form is not valid")
                    this.setState({formIsValid: false, emailError: this.emailError, passwordError: this.passwordError, fNameError: this.fNameError, lNameError: this.lNameError})
            } else {
                console.log("This form is valid!",
                            "Email Error:", this.state.emailError,
                            "fName Error:", this.state.fNameError,
                            "lName Error:", this.state.lNameError,
                            "password Error:", this.state.passwordError,)
                this.sendUserSignIn();
            } 
        } else {
            if (this.emailError === true ||
                this.passwordError === true) {
                    console.log("Something on this form is not valid")
                    this.setState({formIsValid: false, emailError: this.emailError, passwordError: this.passwordError})
            } else {
                console.log("This form is valid!",
                            "Email Error:", this.state.emailError,
                            "password Error:", this.state.passwordError,)
                this.sendUserSignIn();
            } 
        }
    }


    sendUserSignIn = () => {
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

    toggleLogIn = () => {
        this.setState({isNewAccount: !this.state.isNewAccount})
        console.log("Toggle has toggled.")
        //If your submission was not valid, if you toggle the fields will reset.
        if(!this.state.formIsValid) {
            console.log("I should have checked for form validity. Form is valid?", this.state.formIsValid)
            this.setState({formIsValid: true, emailError: false, passwordError: false, fNameError: false, lNameError: false,
                           email: '', password:'', fName:'', lName:'' })
        }
    }


    // ========================================RENDERED ITEMS HERE==============================================
    changeView = () => {
        //Changes available form fields
        if(this.state.isNewAccount) {
            return(
                <>
                <div id="bottomRow" className="flex flex-row bg-amber-300">
                    <div id="firstNameField" className="flex flex-col">
                        <label htmlFor="fName">First Name</label>
                        <input
                            required
                            type="text"
                            placeholder="First Name"
                            className="mx-3"
                            value={this.state.fName}
                            onChange={this.handleChange('fName')}
                            />
                        {this.state.fNameError ? <p className="text-alert text-sm">First Name field cannot be empty.</p> : <></>}
                    </div>

                    <div id="lastNameField" className="flex flex-col">
                        <label htmlFor="lName">Last Name</label>
                        <input
                            required
                            type="text"
                            placeholder="Last Name"
                            className="mx-3"
                            value={this.state.lName}
                            onChange={this.handleChange('lName')}
                            />
                        {this.state.lNameError ? <p className="text-alert text-sm">Last Name field cannot be empty.</p> : <></>}
                    </div>
                </div>

                <div id="buttonHolder" className="flex flex-row justify-around">
                    <button
                        type="button" 
                        className="inline-flex px-4 py-2 text-sm font-medium text-cyan-900 bg-cyan-100 border border-transparent rounded-md hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500"
                        onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.validateForm(e)}>Register</button>
                    <button
                        type="button" 
                        className="inline-flex px-4 py-2 text-sm font-medium text-cyan-900 bg-cyan-100 border border-transparent rounded-md hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500"
                        onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.toggleLogIn()}
                        >I Have an Account</button>
                </div>
                </>
            )
        } else {
            return(
                <>
                <div id="buttonHolder" className="flex flex-row justify-around">
                    <button
                        type="button"
                        className="inline-flex px-4 py-2 text-sm font-medium text-cyan-900 bg-cyan-100 border border-transparent rounded-md hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500"
                        onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.validateForm(e)}>Log In</button>
                    <button
                        type="button" 
                        className="inline-flex px-4 py-2 text-sm font-medium text-cyan-900 bg-cyan-100 border border-transparent rounded-md hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500"
                        onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.toggleLogIn()}
                        >I'm a New User</button>
                </div>
                </>
            )
        }
    }

    //=====================================STARTING VIEW===========================================
    render() {
        return(
            <div>
                <div id="form" className="bg-amber-400 flex flex-col justify-center max-w-min py-5 px-6">

                    {/* This div puts the 2 rows of fields & buttons in a column */}
                    <div id="topRow" className="flex flex-row bg-amber-300">
                        <div id="emailField" className="flex flex-col">
                            <label htmlFor="email">Email</label>
                                <input
                                required
                                type="text"
                                placeholder="Email"
                                className="mx-3"
                                value={this.state.email}
                                onChange={this.handleChange('email')}
                                />
                        </div>
                            {this.state.emailError      //You could write this better. Currently, a message will show independently for each email/password
                                ? this.state.isNewAccount
                                    ?<p className="text-alert text-sm">Email field must contain a valid email.</p>
                                    :<p className="text-alert text-sm">Not a valid email</p>
                                : <></>}

                        <div id="passwordField" className="flex flex-col">
                            <label htmlFor="password">Password</label>
                                <input
                                required
                                type="password"
                                placeholder="Secure Password"
                                className="mx-3"
                                value={this.state.password}
                                onChange={this.handleChange('password')}
                                />
                        </div>
                            {this.state.passwordError   //You could write this better. Currently, a message will show independently for each email/password
                                ? this.state.isNewAccount
                                    ?<p className="text-alert text-sm">Password must be 8 characters long and include<br />at least 1 number and 1 uppercase, lowercase and special character.</p>
                                    :<p className="text-alert text-sm">Not a valid password</p>
                                : <></>}
                    </div>

                    {this.state.formIsValid ? <></> : <p className="text-alert text-sm">Please correct the form fields before submitting.</p>}
                    {this.changeView()} 

                </div>
            </div>
        )
    }
}