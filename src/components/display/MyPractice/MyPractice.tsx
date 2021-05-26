import React, {Component} from 'react';
import AuthContext from '../../site/AuthContext';
import AddUserCollection from '../Modals/AddUserCollection';
import EditUserCollection from '../Modals/EditUserCollection';
import DeleteUserCollection from '../Modals/DeleteUserCollection';
import AddAffirmation from '../Modals/AddAffirmation';
import EditUserAffirmation from '../Modals/EditUserAffirmation';
import DeleteUserAffirmation from '../Modals/DeleteUserAffirmation';
import TimerContainer from './TimerContainer';
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

    constructor(props : {}){
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
        let affirmationArray:IAffirmations[] = [];

        fetch(`${process.env.REACT_APP_DATABASE_URL}mycollections/`, {
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": `${this.context.token}`
            })
        })
        .then(data => data.json())
        .then(data => {
            if (data.userCollection) {
                data.userCollection.map((coll:IUserCollections, index:number) => {
                    return affirmationArray.push(...coll.affirmations)
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
        this.intervalArrayFilter?.splice(0,this.intervalArrayFilter.length);
        if (this.state.affirmationResults && this.state.collectionFilter) {
            this.state.affirmationResults.map((aff, index) => {
                if (aff.userCollectionId === this.state.collectionFilter) {
                    this.intervalArrayFilter?.push(aff)
                }
            })
        } else {
            this.state.affirmationResults?.map((aff, index) => {
                return this.intervalArrayFilter?.push(aff)
            })
            // this.setState({intervalArray: this.state.affirmationResults})
        }
        this.updateIntervalArray();
    }

    updateIntervalArray() {
        this.setState({intervalArray: this.intervalArrayFilter})
    }

    render(){
        return(
            <div id="activePracticeWindow" className="w-full h-screen">
                <div id="backgroundColor" className=" h-screen bg-gradient-to-r from-custom-darkblue via-custom-darkblue to-custom-darkblue-dark">
                    <div className="h-20 bg-gradient-to-r from-custom-darkblue via-custom-darkblue to-custom-darkblue-dark">
                        <h3 className="text-center pt-6 text-white text-3xl font-bold">My Practice</h3>
                    </div>

                    <div id="navCurveBGColor" className="h-full rounded-tl-3xl bg-gradient-to-b from-custom-lightblue-light via-custom-orange to-custom-deeppurple-shade">
                    <div id="navCurve" className="h-full bg-custom-lightblue bg-opacity-80 rounded-tl-3xl pl-3 pt-3">
                        
                        <div className="grid grid-cols-12">
                            <div className="col-span-4 flex flex-row justify-center content-end">
                                <div className="flex content-end text-center min-w-max pl-4 mx-3">
                                    <h4 className="bg-white px-5 pt-1 rounded-t-lg text-lg text-custom-deeppurple font-bold">My Collections</h4>
                                </div>
                                <div>
                                    <AddUserCollection refreshDash={this.grabUserCollections}/>
                                </div>
                            </div>
                            <div className="col-span-5 flex flex-row justify-center content-end">
                                <div className="flex content-end text-center min-w-max pl-4 mx-3">
                                    <h4 className="bg-white px-5 pt-1 rounded-t-lg text-lg text-custom-deeppurple font-bold">My Affirmations</h4>
                                </div>
                                <div>
                                    <AddAffirmation 
                                        collectionResults={this.state.userCollectionResults}
                                        refreshDash={this.grabUserCollections}
                                    />
                                </div>
                            </div>
                            <div className="col-span-3 flex justify-center pr-6">
                                <div className="flex content-end text-center min-w-max pl-4 mx-3">
                                    <h4 className="bg-white px-5 pt-1 rounded-t-lg text-lg text-custom-deeppurple font-bold">Start My Practice</h4>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN DETAILS */}
                        <div className="grid grid-cols-12 h-full overflow-y-auto">
                            
                        {/* COLUMN 1 = Collections */}
                            <div id="COL 1" className="col-span-4 px-1">
                                {/* HEADER REPLACES THIS SPACE */}
                                <div id="contentWrapper" className="px-2 py-1 rounded-lg bg-white">
                                    <div className="bg-custom-lightblue-light rounded-lg hover:bg-opacity-30">
                                        <div className="p-3 my-1"
                                        onClick={() =>  this.setState({collectionFilter: null})}>
                                            <h4 className="text-cycustom-deeppurple-light font-semibold">All Collections</h4>
                                        </div>
                                    </div>
                                    {this.state.userCollectionResults && this.state.userCollectionResults.map((coll, index) => {
                                        return <div key={index} className="bg-custom-lightblue-light rounded-lg my-1 hover:bg-opacity-30">
                                                <div className="hideParent flex justify-between items-center space-x-4 p-3"
                                                onClick={() => this.setState({collectionFilter: coll.id})}>
                                                    <h4 className="text-cycustom-deeppurple-light font-semibold">{coll.title}</h4>
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
                            <div className="col-span-5 px-1">
                                {/* HEADER REPLACES THIS SPACE */}
                                <div id="contentWrapper" className="px-2 py-1 rounded-lg bg-white">
                                    {this.state.affirmationResults && this.state.collectionFilter
                                        ? this.state.affirmationResults.filter(aff => aff.userCollectionId === this.state.collectionFilter).map((aff, index) => {
                                            return <div key={index} className="bg-custom-lightblue-light rounded-lg hover:bg-opacity-30">
                                                    <div className="hideParent flex justify-between items-center space-x-4 p-2 my-1">
                                                        <h4 className="text-cycustom-deeppurple-light font-semibold">{aff.statement}</h4>
                                                        <div id="buttonOptions" className="flex flex-row justify-end">
                                                            <div className="hideChild">
                                                                <EditUserAffirmation
                                                                    collectionResults={this.state.userCollectionResults}
                                                                    //thisCollId={aff.userCollectionId![0]}   //It sees the [] of userCollections. How can I grab just the collId? 
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
                                            return <div key={index} className="bg-custom-lightblue-light rounded-lg hover:bg-opacity-30">
                                                    <div className="hideParent flex justify-between items-center space-x-4 p-2 my-1">
                                                        <h4 className="text-cycustom-deeppurple-light font-semibold">{aff.statement}</h4>
                                                        <div id="buttonOptions" className="flex flex-row justify-end">
                                                            <div className="hideChild">
                                                                <EditUserAffirmation
                                                                    collectionResults={this.state.userCollectionResults}
                                                                    // thisCollId={aff.userCollectionId}  
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
                            <div id="Interval Player" className="col-span-3 px-1 pr-3 h-full">
                                <div id="contentWrapper" className="px-2 py-2 rounded-3xl bg-white">
                                <TimerContainer
                                    setIntervalFilter={this.setIntervalFilter}
                                    intervalArray={this.state.intervalArray!}
                                />
                                </div>
                            </div>
                        </div>
                        {/* END OF COLUMNS */}
                    </div>
                    </div> {/* This is a gradient behind the nav curve. */}
                </div> 
            </div>
        )
    }
}
export default MyPractice;