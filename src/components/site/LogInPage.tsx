import React from 'react';
import Splash from './Splash';
import {RouteComponentProps} from 'react-router-dom';
import {logo} from '../../assets/index';

export default class LogInPage extends React.Component <RouteComponentProps<{}>,{}> {

    render() {
        return(
            <div className=" bg-sunrise-bg bg-cover h-screen w-screen flex flex-col justify-between">
                {/* LOGO */}
                <div id="header" className="flex justify-center bg-gradient-to-b from-custom-darkblue via-custom-darkblue to-transparen w-full h-60">
                    <img src={logo} className="h-full pt-8 pb-20" alt="well said logo" />
                </div>

                {/* BODY - Form/Picture */}
                <div id="body" className="flex justify-center items-center h-full pb-8">
                    <div id="formArea" className="flex justify-center h-full pb-8 pt-2 w-2/5 ml-8 rounded-2xl">
                        <div id="formHolder"  className=" bg-custom-deeppurple rounded-xl bg-opacity-70 w-10/12">
                            <Splash />
                        </div>
                    </div>
                    <div id="splashContent" className="w-3/5 h-full flex flex-col justify-center items-center ml-6">
                        <p className="text-6xl text-white font-bold mb-4 py-2 px-4 bg-custom-deeppurple bg-opacity-70 rounded">Your words have power.</p>
                        <p className="text-4xl text-white font-semibold mt-4 py-2 px-4 bg-custom-deeppurple bg-opacity-70 rounded">Use them well.</p>
                    </div>
                </div>

                {/* FOOTER */}
                <div id="footer" className="flex justify-center items-end bg-gradient-to-b from-transparent to-custom-deeppurple bg-opacity-20 w-full h-72">
                    <p className="text-white text-opacity-75 p-2">Jacob Powell © 2021</p>
                </div>
            </div>
        )
    }
}