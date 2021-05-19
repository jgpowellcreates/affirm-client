import React, {Component} from 'react';
import AuthContext from './AuthContext';
import {Link} from 'react-router-dom';
import {userRoles} from '../../types/Models';

export default class Navigation extends Component<{},{}> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>

    constructor(props : any){
        super(props);
        this.state = {

        }
    }

    render() {
        return(
            <div className="container">
                <div className='header' style={{background: "purple", position: 'fixed', width: "100%", height: '4em', top: '0', textAlign: 'center'}}>
                    <h1>
                        Affirm Brand
                    </h1>
                </div>
                <div className="sidebar" style={{background: 'blue', position: 'fixed', width: '10em', height: '100vh', top:'0', padding: '5em 0 0 0'}}>
                    <ul style={{listStyle:"none", margin: '0 10px',padding: "0"}}>
                        <li>
                            <Link to='/browse'>
                                <h3>Browse</h3>
                            </Link>
                        </li>
                        {this.context.roleId === userRoles.admin
                        ?
                        <li>
                            <Link to="/admindash">Admin Dashboard</Link>
                        </li>
                        :<></>
                        }
                        <li>
                            <Link to="/mypractice">
                                <h3>My Practice</h3>
                            </Link>
                        </li>
                        <li>
                            <Link to="/resources">
                                <h3>Resources</h3>
                            </Link>
                        </li>
                        {/* THIS IS A BUTTON FOR DEV TESTING PURPOSES */}
                        <li><button onClick={() => console.log("Id:", this.context.id, "RoleId:", this.context.roleId, 'Token:', this.context.token)}>Check States</button></li>

                        <li onClick={() => this.context.clearToken()}>
                            <h3>Log Out</h3>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
};