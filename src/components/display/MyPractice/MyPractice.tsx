import React, {Component} from 'react';
import AuthContext from '../../site/AuthContext';
import AddUserCollection from '../Modals/AddUserCollection';
import EditUserCollection from '../Modals/EditUserCollection';
import DeleteUserCollection from '../Modals/DeleteUserCollection';
import AddAffirmation from '../Modals/AddAffirmation';
import DeleteUserAffirmation from '../Modals/DeleteUserAffirmation';
import IntervalTimer from '../Modals/IntervalTimer';
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
            <div>
                <h3>My Practice - AM I RUNNING</h3>
                <button onClick={() => console.log(this.state.intervalArray)}>CHECK INTERVAL ARRAYS</button>
                <br /><button onClick={() => console.log(this.state.collectionFilter)}>CHECK FILTERS</button>

                <div className="grid grid-cols-3">
                    <div id="COL 1">
                        <div id="categoryHeader" className="flex justify-center">
                            <h3 className="text-center">My Collections</h3>
                            <div>
                                <AddUserCollection refreshDash={this.grabUserCollections}/>
                            </div>
                        </div>
                            <div className="shadow border rounded-lg">
                                <div className="flex items-center space-x-4 p-2"
                                onClick={() =>  this.setState({collectionFilter: null})}>
                                    <h4>All Collections</h4>
                                </div>
                            </div>
                         {this.state.userCollectionResults && this.state.userCollectionResults.map((coll, index) => {
                             return <div key={index} className="shadow border rounded-lg">
                                    <div className="hideParent flex items-center space-x-4 p-2"
                                     onClick={() => this.setState({collectionFilter: coll.id})}>
                                        <h4>{coll.title}</h4>
                                        <div className="hideChild">
                                            <EditUserCollection collInfo={coll} refreshDash={this.grabUserCollections}/>
                                        </div>
                                        <div className="hideChild">
                                            <DeleteUserCollection collInfo={coll} refreshDash={this.grabUserCollections}/>
                                        </div>
                                    </div>
                                 </div>
                         })}
                    </div>

                    <div>
                        <div className="flex justify-center">
                        <h3 className="text-center">Affirmations</h3>
                            <div>
                                <AddAffirmation 
                                    collectionResults={this.state.userCollectionResults}
                                    refreshDash={this.grabUserCollections}
                                />
                            </div>
                        </div>
                         {this.state.affirmationResults && this.state.collectionFilter
                            ? this.state.affirmationResults.filter(aff => aff.userCollectionId === this.state.collectionFilter).map((aff, index) => {
                                return <div key={index} className="shadow border rounded-lg">
                                        <div className="hideParent flex items-center space-x-4 p-2">
                                            <h4>{aff.statement}</h4>
                                            {/* <button className="hideChild">Edit</button> */}
                                            <div className="hideChild">
                                                <DeleteUserAffirmation
                                                    affirmationId={aff.id}
                                                    affirmationInfo={aff}
                                                    refreshDash={this.grabUserCollections}
                                                />
                                            </div>
                                        </div>
                                    </div>
                            })
                            : this.state.affirmationResults && this.state.affirmationResults.map((aff, index) => {
                                return <div key={index} className="shadow border rounded-lg">
                                        <div className="hideParent flex items-center space-x-4 p-2">
                                            <h4>{aff.statement}</h4>
                                            {/* <button className="hideChild">Edit</button> */}
                                            <div className="hideChild">
                                                <DeleteUserAffirmation
                                                    affirmationId={aff.id}
                                                    affirmationInfo={aff}
                                                    refreshDash={this.grabUserCollections}
                                                />
                                            </div>
                                        </div>
                                    </div>
                         })}
                    </div>

                    <div id="Interval Player">
                    <h3 className="text-center">Start My Practice!</h3>
                         <IntervalTimer
                            setIntervalFilter={this.setIntervalFilter}
                            intervalArray={this.state.intervalArray!}
                         />
                    </div>
                </div>
            </div>
        )
    }
}
export default MyPractice;