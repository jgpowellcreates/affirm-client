import React, {Component} from 'react';
import AuthContext from '../../site/AuthContext';
import AddUserCollection from '../Modals/AddUserCollection';
import EditUserCollection from '../Modals/EditUserCollection';
import DeleteUserCollection from '../Modals/DeleteUserCollection';
import AddAffirmation from '../Modals/AddAffirmation';
import EditUserAffirmation from '../Modals/EditUserAffirmation';
import DeleteUserAffirmation from '../Modals/DeleteUserAffirmation';
import IntervalTimer from './IntervalTimer';
import {IAffirmations, IUserCollections} from '../../../types/Models';

interface IMyPractice {
    userCollectionResults?: IUserCollections[] | null;
    affirmationResults?: IAffirmations[] | null;
    collectionFilter: number | null;
    intervalArray?: IAffirmations[] | null;
}

class MyPractice extends Component <{},IMyPractice> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>

    constructor(props : any){
        super(props);
        this.state = {
            userCollectionResults: null,
            affirmationResults: null,
            collectionFilter: null,
            intervalArray: [],
        }
    }

    componentDidMount() {
        this.grabUserCollections()
    }

    //I'll refer to this as "refreshDash" when passing it as a prop so that it matches the AdminDash props setup.
    grabUserCollections = () => {
        let affirmationArray:any = [];

        fetch(`${process.env.REACT_APP_DATABASE_URL}mycollections/`, {
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": `${this.context.token}`
            })
        })
        .then(data => data.json())
        .then(data => {
            console.log(data)
            if (data.userCollection) {
                data.userCollection.map((coll:IUserCollections, index:number) => {
                    affirmationArray.push(...coll.affirmations)
                })
                this.setState({
                    userCollectionResults: data.userCollection,
                    affirmationResults: affirmationArray,
                    intervalArray: affirmationArray
                })
            } else {
                console.log("Nothing to return");
            }
        })
    }

    intervalArrayFilter : IAffirmations[] | null = [];

    setIntervalFilter = () => {
        console.log("Starting the logic!")
        this.intervalArrayFilter?.splice(0,this.intervalArrayFilter.length);
        console.log("IntervalArrayFilter is reset:", this.intervalArrayFilter)
        if (this.state.affirmationResults && this.state.collectionFilter) {
            this.state.affirmationResults.map((aff, index) => {
                //console.log("Mapping affs w/ a filter set")
                if (aff.userCollectionId === this.state.collectionFilter) {
                    this.intervalArrayFilter?.push(aff)
                    console.log("Aff",aff.id,"was added to interval array")
                    //console.log("Run the function w/", this.intervalArrayFilter)
                }
            })
        } else {
            console.log("There is no filter. All affs added to interval array")
            this.state.affirmationResults?.map((aff, index) => {
                this.intervalArrayFilter?.push(aff)
            })
            // this.setState({intervalArray: this.state.affirmationResults})
        }
        this.updateIntervalArray();
    }

    updateIntervalArray() {
        console.log(this.intervalArrayFilter && this.intervalArrayFilter.length)
        this.setState({intervalArray: this.intervalArrayFilter}, this.fireIntervalModal)
    }

    fireIntervalModal() {
        if (this.state.intervalArray!.length > 0) {
            console.log("Firing Interval Timer w/ :", this.state.intervalArray)
        } else {
            console.log("Can't use this feature w/o affirmations selected")
        }
    }

    render(){
        return(
            <div id="activePracticeWindow" className="w-full h-screen">
                <div id="backgroundColor" className=" h-screen bg-gradient-to-r from-cyan-500 via-cyan-500 to-amber-500">
                    <div className="h-20 bg-gradient-to-r from-cyan-500 via-cyan-500 to-amber-500">
                        <h3 className="text-center pt-6 text-cyan-50 text-3xl font-bold">My Practice</h3>
                    </div>

                    <div id="navCurve" className="h-full bg-white rounded-tl-3xl pl-3 pt-3">
                        
                        <div className="grid grid-cols-12">
                            <div className="col-span-4 flex flex-row justify-center content-end">
                                <div className="flex content-end text-center min-w-max pl-4 mx-3">
                                    <h4 className="bg-cyan-500 px-5 pt-1 rounded-t-lg text-lg text-white font-bold">My Collections</h4>
                                </div>
                                <div>
                                    <AddUserCollection refreshDash={this.grabUserCollections}/>
                                </div>
                            </div>
                            <div className="col-span-5 flex flex-row justify-center content-end">
                                <div className="flex content-end text-center min-w-max pl-4 mx-3">
                                    <h4 className="bg-cyan-500 px-5 pt-1 rounded-t-lg text-lg text-white font-bold">My Affirmations</h4>
                                </div>
                                <div>
                                    <AddAffirmation 
                                        collectionResults={this.state.userCollectionResults}
                                        refreshDash={this.grabUserCollections}
                                    />
                                </div>
                            </div>
                            <div className="col-span-3">
                                <div className="flex content-end text-center w-min pl-4 mx-3">
                                </div>
                            </div>
                        </div>

                        {/* COLUMN DETAILS */}
                        <div className="grid grid-cols-12">
                            
                        {/* COLUMN 1 = Collections */}
                            <div id="COL 1" className="col-span-4 px-3">
                                {/* HEADER REPLACES THIS SPACE */}
                                <div id="contentWrapper" className="px-2 py-1 rounded-lg bg-cyan-500">
                                    <div className="bg-cyan-50 rounded-lg hover:bg-white">
                                        <div className="p-2 my-1"
                                        onClick={() =>  this.setState({collectionFilter: null})}>
                                            <h4 className="text-cyan-900 font-semibold">All Collections</h4>
                                        </div>
                                    </div>
                                    {this.state.userCollectionResults && this.state.userCollectionResults.map((coll, index) => {
                                        return <div key={index} className="bg-cyan-50 rounded-lg my-2 hover:bg-white">
                                                <div className="hideParent flex justify-between items-center space-x-4 p-2"
                                                onClick={() => this.setState({collectionFilter: coll.id})}>
                                                    <h4 className="text-cyan-900 font-semibold">{coll.title}</h4>
                                                    <div id="buttonOptions" className="flex flex-row justify-end">
                                                        <div className="hideChild">
                                                            <EditUserCollection collInfo={coll} refreshDash={this.grabUserCollections}/>
                                                        </div>
                                                        <div className="hideChild">
                                                            <DeleteUserCollection collInfo={coll} refreshDash={this.grabUserCollections}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    })}
                                </div>
                            </div>

                        {/* COLUMN 2 = Affirmations */}
                            <div className="col-span-5 px-3">
                                {/* HEADER REPLACES THIS SPACE */}
                                <div id="contentWrapper" className="px-2 py-1 rounded-lg bg-cyan-500">
                                    {this.state.affirmationResults && this.state.collectionFilter
                                        ? this.state.affirmationResults.filter(aff => aff.userCollectionId === this.state.collectionFilter).map((aff, index) => {
                                            return <div key={index} className="bg-cyan-50 rounded-lg my-2 hover:bg-white">
                                                    <div className="hideParent flex justify-between items-center space-x-4 p-2">
                                                        <h4 className="text-cyan-900 font-semibold">{aff.statement}</h4>
                                                        <div id="buttonOptions" className="flex flex-row justify-end">
                                                            <div className="hideChild">
                                                                <EditUserAffirmation
                                                                    collectionResults={this.state.userCollectionResults}
                                                                    //thisCollId={0}   //It sees the [] of userCollections. How can I grab just the collId? 
                                                                    affInfo={aff}
                                                                    refreshDash={this.grabUserCollections}
                                                                />
                                                            </div>
                                                            <div className="hideChild">
                                                                <DeleteUserAffirmation
                                                                    affirmationId={aff.id}
                                                                    affirmationInfo={aff}
                                                                    refreshDash={this.grabUserCollections}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                        })
                                        : this.state.affirmationResults && this.state.affirmationResults.map((aff, index) => {
                                            return <div key={index} className="bg-cyan-50 rounded-lg my-2 hover:bg-white">
                                                    <div className="hideParent flex justify-between items-center space-x-4 p-2">
                                                        <h4 className="text-cyan-900 font-semibold">{aff.statement}</h4>
                                                        <div id="buttonOptions" className="flex flex-row justify-end">
                                                            <div className="hideChild">
                                                                <EditUserAffirmation
                                                                    collectionResults={this.state.userCollectionResults}
                                                                    //thisCollId={0}
                                                                    affInfo={aff}
                                                                    refreshDash={this.grabUserCollections}
                                                                />
                                                            </div>
                                                            <div className="hideChild">
                                                                <DeleteUserAffirmation
                                                                    affirmationId={aff.id}
                                                                    affirmationInfo={aff}
                                                                    refreshDash={this.grabUserCollections}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                    })}
                                </div>
                            </div>


                        {/* COLUMN 3 = Interval Player */}
                            <div id="Interval Player" className="col-span-3 px-3">
                            <h3 className="text-center">Start My Practice!</h3>
                                <IntervalTimer
                                    setIntervalFilter={this.setIntervalFilter}
                                    intervalArray={this.state.intervalArray!}
                                />
                            </div>
                        </div>
                        {/* END OF COLUMNS */}
                    </div>
                </div> 
            </div>
        )
    }
}
export default MyPractice;