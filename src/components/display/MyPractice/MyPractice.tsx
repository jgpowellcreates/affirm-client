import React, {Component} from 'react';
import {IAffirmations} from '../../../types/Models';

interface IMyPractice {
    userCollectionResults?: IUserCollections[] | null;
    affirmationResults?: IAffirmations[] | null;
    collectionFilter: number | null;
    intervalArray: IAffirmations[] | null;
}

interface IUserCollections {
    affirmations: IAffirmations[];
    createdAt: string;
    descriptiong: string;
    id: number;
    ownerRole: number;
    title: string;
    updatedAt: string;
    userId: string;
}

class MyPractice extends Component <{},IMyPractice> {
    constructor(props : any){
        super(props);
        this.state = {
            userCollectionResults: null,
            affirmationResults: null,
            collectionFilter: null,
            intervalArray: null,
        }
    }

    componentDidMount() {
        this.grabUserCollections()
    }

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
            if (data.userCollection) {
                data.userCollection.map((coll:IUserCollections, index:number) => {
                    affirmationArray.push(...coll.affirmations)
                })
                this.setState({
                    userCollectionResults: data.userCollection,
                    affirmationResults: affirmationArray
                })
            } else {
                console.log("Nothing to return");
            }
        })
    }

    intervalArrayFilter : IAffirmations[] = [];

    intervalFilterSet = () => {
        this.intervalArrayFilter.splice(0,this.intervalArrayFilter.length);
        //this.intervalArrayFilter.push(this.state.affirmationResults!.filter(aff => aff.userCollectionId === this.state.collectionFilter))
        //this.intervalArrayFilter.push
    }

    render(){
        return(
            <div>
                <h3>My Practice</h3>
                <button onClick={() => console.log(this.state.userCollectionResults, this.state.affirmationResults)}>CHECK ARRAYS</button>
                <br /><button onClick={() => console.log(this.state.collectionFilter)}>CHECK FILTERS</button>
                <br /><button onClick={() => this.intervalFilterSet}>INTERVAL TEST</button>

                <div className="grid grid-cols-3">
                    <div id="COL 1">
                        <h3 className="text-center">My Collections</h3>
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
                                        <button className="hideChild">Edit</button>
                                        <button className="hideChild">Delete</button>
                                    </div>
                                 </div>
                         })}
                    </div>

                    <div>
                    <h3 className="text-center">Affirmations</h3>
                         {this.state.affirmationResults && this.state.collectionFilter
                            ? this.state.affirmationResults.filter(aff => aff.userCollectionId === this.state.collectionFilter).map((aff, index) => {
                                return <div key={index} className="shadow border rounded-lg">
                                        <div className="hideParent flex items-center space-x-4 p-2">
                                            <h4>{aff.statement}</h4>
                                            <button className="hideChild">Edit</button>
                                            <button className="hideChild">Delete</button>
                                        </div>
                                    </div>
                            })
                            : this.state.affirmationResults && this.state.affirmationResults.map((aff, index) => {
                                return <div key={index} className="shadow border rounded-lg">
                                        <div className="hideParent flex items-center space-x-4 p-2">
                                            <h4>{aff.statement}</h4>
                                            <button className="hideChild">Edit</button>
                                            <button className="hideChild">Delete</button>
                                        </div>
                                    </div>
                         })}
                    </div>

                    <div id="Interval Player">
                    <h3 className="text-center">Start My Practice!</h3>
                         <div className="shadow border rounded-lg">
                             <div onClick={() => console.log("This should copy the filtered affirmations to the intervalPlayer stateful var. If affs = 0, cannot play. Select affs!")}>
                                 <h4>Add a play button over this image that changes on hover</h4>
                                 <h4>Interval slider should live below image</h4>
                                <img src="https://greentreeyogadotcom.files.wordpress.com/2014/08/peaceful-water-1480533.jpg" alt="pretty leaves" />
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default MyPractice;