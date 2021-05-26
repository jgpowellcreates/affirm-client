import React, {Component} from 'react';
import AuthContext from './AuthContext';
import {RouteComponentProps, withRouter} from 'react-router-dom';

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
    validLoginError: boolean;
}

interface ILoginProps extends RouteComponentProps {

}

class SignInFields extends Component<ILoginProps,IUserInfoState> {
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
            validLoginError: false,
        }
    }

    componentDidMount() {
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

        //Email
        this.state.email.match(/(\w\.?)+@[\w\.-]+\.\w{2,}/) ? this.emailError = false : this.emailError = true;

        //Password
        this.state.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/) ? this.passwordError = false : this.passwordError = true;

        //fName
        this.state.fName.match(/[A-Za-z]{1,16}/) ? this.fNameError = false : this.fNameError = true

        //lName
        this.state.lName.match(/[A-Za-z]{1,16}/) ? this.lNameError = false : this.lNameError = true

        this.checkForm()
        //this.setState({emailError:emailError,passwordError:passwordError,fNameError:fNameError,lNameError:lNameError}, () => this.checkForm())
    }

    checkForm = () => {

        if(this.state.isNewAccount) {
            if (this.emailError === true ||
                this.passwordError === true ||
                this.fNameError === true ||
                this.lNameError === true) {
                    this.setState({formIsValid: false, emailError: this.emailError, passwordError: this.passwordError, fNameError: this.fNameError, lNameError: this.lNameError})
            } else {
                console.log("This form is valid!",
                            //"Email Error:", this.state.emailError,
                            //"fName Error:", this.state.fNameError,
                            //"lName Error:", this.state.lNameError,
                            //"password Error:", this.state.passwordError,
                            )
                this.sendUserSignIn();
            } 
        } else {
            if (this.emailError === true ||
                this.passwordError === true) {
                    this.setState({formIsValid: false, emailError: this.emailError, passwordError: this.passwordError})
            } else {
                console.log("This form is valid!",
                            //"Email Error:", this.state.emailError,
                            //"password Error:", this.state.passwordError,
                            )
                this.sendUserSignIn();
            } 
        }
    }


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
            data.token ? this.props.history.push("/browse") : this.setState({validLoginError: true});
            this.context.setToken(data.token);
        })
    }

    toggleLogIn = () => {
        this.setState({isNewAccount: !this.state.isNewAccount})
        //If your submission was not valid, if you toggle the fields will reset.
        if(!this.state.formIsValid) {
            this.setState({formIsValid: true, emailError: false, passwordError: false, fNameError: false, lNameError: false,
                           email: '', password:'', fName:'', lName:'' })
        }
    }

    //=====================================STARTING VIEW===========================================
    render() {
        return(
            <div id="form" className=" flex flex-col justify-between h-full min-w-max py-5 px-10">

                {/* This div puts the 2 rows of fields & buttons in a column */}
                <div id="inputs">
                    <div id="topRow" className="flex flex-col">
                        <div id="emailField" className="flex flex-col mb-1">
                            <div id="inputInfo" className="flex flex-row justify-between">
                                <label className="text-white font-bold" htmlFor="email">Email</label>
                                {this.state.emailError ? <p className="text-alert text-sm">*valid email required</p> : <></>}
                            </div>
                            <input
                                required
                                type="text"
                                placeholder="Email"
                                className="mx-3 p-1 px-2 rounded-md bg-custom-lightblue bg-opacity-50 ring-0 ring-custom-yellow focus:bg-white focus:ring-4 focus:outline-none"
                                value={this.state.email}
                                onChange={this.handleChange('email')}
                                />
                        </div>

                        <div id="passwordField" className="flex flex-col mb-1">
                            <div id="inputInfo" className="flex flex-row justify-between">
                                <label className="text-white font-bold" htmlFor="password">Password</label>
                                {this.state.passwordError ? <p className="text-alert text-sm">*strong password required</p> : <></>}
                            </div>
                                <input
                                required
                                type="password"
                                placeholder="Secure Password"
                                className="mx-3 p-1 px-2 rounded-md bg-custom-lightblue bg-opacity-50 ring-0 ring-custom-yellow focus:bg-white focus:ring-4 focus:outline-none"
                                value={this.state.password}
                                onChange={this.handleChange('password')}
                                />
                        </div>
                            
                    </div>

                    {this.changeView()} 
                </div>

                <div id="buttonSection" className="justify-self-end content-end">
                    {this.buttonView()}
                </div>

            </div>
        )
    }

    // ========================================CONDITIONALLY RENDERED INPUT FIELDS==============================================
    changeView = () => {
        //Changes available form fields
        if(this.state.isNewAccount) {
            return(
                <>
                <div id="bottomRow" className="flex flex-col">
                    <div id="firstNameField" className="flex flex-col mb-1">
                        <div id="inputInfo" className="flex flex-row justify-between">
                            <label className="text-white font-bold" htmlFor="fName">First Name</label>
                            {this.state.fNameError ? <p className="text-alert text-sm">*Name required</p> : <></>}
                        </div>
                        <input
                            required
                            type="text"
                            placeholder="First Name"
                            className="mx-3 p-1 px-2 rounded-md bg-custom-lightblue bg-opacity-50 ring-0 ring-custom-yellow focus:bg-white focus:ring-4 focus:outline-none"
                            value={this.state.fName}
                            onChange={this.handleChange('fName')}
                            />
                    </div>

                    <div id="lastNameField" className="flex flex-col mb-1">
                        <div id="inputInfo" className="flex flex-row justify-between">
                            <label className="text-white font-bold" htmlFor="lName">Last Name</label>
                            {this.state.lNameError ? <p className="text-alert text-sm">*Name required</p> : <></>}
                        </div>
                        <input
                            required
                            type="text"
                            placeholder="Last Name"
                            className="mx-3 p-1 px-2 rounded-md bg-custom-lightblue bg-opacity-50 ring-0 ring-custom-yellow focus:bg-white focus:ring-4 focus:outline-none"
                            value={this.state.lName}
                            onChange={this.handleChange('lName')}
                            />
                    </div>
                </div>
                </>
            )
        } else {
            return <></>
        }
    }

    // ========================================CONDITIONALLY RENDERED BUTTON OPTIONS==============================================
    buttonView = () => {
        if(this.state.isNewAccount) {
            return(
                <div id="buttonHolder" className="flex flex-row justify-around">
                        <button
                            type="button" 
                            className="inline-flex px-4 py-2 text-md font-semibold text-custom-deeppurple bg-custom-yellow-light border border-transparent rounded-md hover:bg-custom-yellow focus:outline-none focus:bg-custom-yellow-dark"
                            onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.validateForm(e)}>Register</button>
                        <button
                            type="button" 
                            className="inline-flex px-4 py-2 text-md font-semibold text-custom-deeppurple bg-custom-lightblue-light border border-transparent rounded-md hover:bg-custom-lightblue focus:outline-none focus:bg-custom-lightblue-dark"
                            onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.toggleLogIn()}
                            >I Have an Account</button>
                    </div>
            )
        } else {
            return(
                <> 
                {this.state.emailError || this.state.passwordError || this.state.validLoginError ? <p className="text-alert text-md font-bold text-center mx-auto min-w-max mb-8 bg-black bg-opacity-20 rounded-md">Invalid email/password.</p> : <></>}

                <div id="buttonHolder" className="flex flex-col justify-end">
                    <div id="buttonHolder" className="flex flex-row justify-around">
                        <button
                            type="button"
                            className="inline-flex px-4 py-2 text-md font-semibold text-custom-deeppurple bg-custom-yellow-light border border-transparent rounded-md hover:bg-custom-yellow focus:outline-none focus:bg-custom-yellow-dark"
                            onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.validateForm(e)}>Log In</button>
                        <button
                            type="button" 
                            className="inline-flex px-4 py-2 text-md font-semibold text-custom-deeppurple bg-custom-lightblue-light border border-transparent rounded-md hover:bg-custom-lightblue focus:outline-none focus:bg-custom-lightblue-dark"
                            onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.toggleLogIn()}
                            >I'm a New User</button>
                    </div>
                </div>
                </>
            )
        }
    }

}

export default withRouter(SignInFields);