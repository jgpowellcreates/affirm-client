import React, {Component} from 'react';
import AuthContext from './AuthContext';
import {Link} from 'react-router-dom';
import {IAffirmations, userRoles} from '../../types/Models';
import {FaThList,FaUserCog, FaCommentDots, FaHandsHelping, FaDoorClosed, FaDoorOpen} from 'react-icons/fa/index';
import {logoInverse} from '../../assets/index';

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
                {/* <div className="fixed top-0 w-full h-16 p-0 z-0 bg-gradient-to-r from-cyan-500 via-cyan-500 to-cyan-300 text-center">
                    <img src={logoInverse}
                     alt="Well Said Logo"
                     className="h-full relative mx-auto my-2"
                     />
                </div> */}
                <div id="leftNav" className="fixed top-0 h-screen w-40  my-auto bg-cyan-500">
                    <div className="h-1/5 flex py-auto align-middle">
                        <img src={logoInverse}
                            alt="Well Said Logo"
                            className="w-full relative m-auto"
                        />
                    </div>
                    <hr className="text-white w-4/5 m-auto"/>
                    <ul className="mx-3 h-4/5">
                        <Link to='/browse' onClick={() => this.context.update()}>
                            <div className="relative rounded-full h-20 pt-4 text-white text-center mx-auto my-8 hover:text-cyan-100 hover:shadow-md hover:cursor-pointer">
                                    <FaThList className="m-auto"/>
                                    <h3 className="font-semibold pt-2">Browse</h3>
                            </div>
                        </Link>
                        {this.context.roleId === userRoles.admin
                        ?
                        <Link to="/admindash">
                            <div className="relative rounded-full h-20 pt-4 text-white text-center mx-auto my-8 hover:text-cyan-100 hover:shadow-md hover:cursor-pointer">
                                <FaUserCog className="m-auto" />
                                <h3 className="font-semibold pt-2">Dashboard</h3>
                            </div>
                        </Link>
                        :<></>
                        }
                        <Link to="/mypractice" onClick={() => this.context.update()} >
                            <div className="relative rounded-full h-20 pt-4 text-white text-center mx-auto my-8 hover:text-cyan-100 hover:shadow-md hover:cursor-pointer">
                                <FaCommentDots className="m-auto" />
                                <h3 className="font-semibold pt-2">My Practice</h3>
                            </div>
                        </Link>
                        <Link to="/resources">
                            <div className="relative rounded-full h-20 pt-4 text-white text-center mx-auto my-8 hover:text-cyan-100 hover:shadow-md hover:cursor-pointer">
                                <FaHandsHelping className="m-auto" />
                                <h3 className="font-semibold pt-2">Resources</h3>
                            </div>
                        </Link>

                        {/* THIS IS A BUTTON FOR DEV TESTING PURPOSES */}
                        {/* <li><button onClick={() => console.log(this.context)}>Check Context</button></li> */}

                        <Link to="/">
                            <div
                                className="relative rounded-full h-20 pt-4 text-white text-center mx-auto my-8 hover:text-cyan-100 hover:shadow-md hover:cursor-pointer"
                                onClick={() => this.context.clearToken()}>
                                <FaDoorOpen className="m-auto" /> {/* door-close .....door-open on hover? */}
                                <h3 className="font-semibold pt-2">Log Out</h3>
                            </div>
                        </Link>
                    </ul>
                </div>
            </div>
        )
    }
};