import React, {Component} from 'react';

class Resources extends Component <{},{}> {
    constructor(props : {}){
        super(props);
        this.state = {

        }
    }

    

    render(){
        return(
            <div id="activeResourceWindow" className="w-full h-screen">
                <div id="backgroundColor" className=" h-screen bg-gradient-to-r from-custom-darkblue via-custom-darkblue to-custom-darkblue-dark">
                    <div className="h-20 bg-gradient-to-r from-custom-darkblue via-custom-darkblue to-custom-darkblue-dark">
                        <h3 className="text-center pt-6 text-white text-3xl font-bold">Resources</h3>
                    </div>

                    <div id="navCurveBGColor" className="h-full rounded-tl-3xl bg-gradient-to-b from-custom-lightblue-light via-custom-orange to-custom-deeppurple-shade">
                    <div id="navCurve" className="h-full bg-white bg-opacity-80 rounded-tl-3xl pl-3 pt-3">

                        {/* BODY CONTENT */}

                        <p className="text-center font-bold text-2xl pt-40">I am not yet resourceful.</p>
                        <p className="text-center font-bold text-lg pt-6 pb-2">Please try to find it in your heart to forgive me.</p>
                        <p className="text-center font-bold text-lg p-2">This will hold static content.</p>
                        <div className="group text-opacity-0 text-center">
                            <p className=" text-center font-bold text-lg p-2">Special Thanks to:</p>
                                <p className="text-black text-opacity-0 group-hover:text-opacity-100">Our EFA instructos: <b>Donovan Triplett, Corynne Moody, Jason Line, Cris Matson (OG), & Ryan Bogan</b></p>
                                <p className="text-black text-opacity-0 group-hover:text-opacity-100"><b>Reed Brown:</b> Blue Badge task master</p>
                                <p className="text-black text-opacity-0 group-hover:text-opacity-100"><b>Brian Oliver II:</b> Tons of helpful resources on routing, databases, validation</p>
                                <p className="text-black text-opacity-0 group-hover:text-opacity-100"><b>Alexander Mason:</b> Wrote half of my program</p>
                                <p className="text-black text-opacity-0 group-hover:text-opacity-100"><b>Alec Synnestvedt, Jessica Wiersma, & Troy Sandy:</b> Troubleshooting sessions and company</p>
                                <p className="text-black text-opacity-0 group-hover:text-opacity-100"><b>Rachel Christopher:</b> All the good looking parts of this app</p>
                                <p className="text-black text-opacity-0 group-hover:text-opacity-100"><b>Cohort WD 80:</b> Making this a beautiful communal experience.</p>
                        </div>

                    </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Resources;