import React, {Component} from 'react';

class Resources extends Component <{},{}> {
    constructor(props : any){
        super(props);
        this.state = {

        }
    }

    render(){
        return(
            <div id="activeResourceWindow" className="w-full h-screen">
                <div id="backgroundColor" className=" h-screen bg-gradient-to-r from-cyan-500 via-cyan-500 to-green-500">
                    <div className="h-20 bg-gradient-to-r from-cyan-500 via-cyan-500 to-green-500">
                        <h3 className="text-center pt-6 text-cyan-50 text-3xl font-bold">Resources</h3>
                    </div>
                    <div id="navCurve" className="h-full bg-white rounded-tl-3xl pl-3 pt-3">

                        {/* BODY CONTENT */}

                        <p className="text-center pt-72">I am not yet resourceful.</p>
                        <p className="text-center p-6">Please try to find it in your heart to forgive me.</p>
                    </div>
                </div>
            </div>
        )
    }
}
export default Resources;