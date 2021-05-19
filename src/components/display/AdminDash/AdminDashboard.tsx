import React, {Component} from 'react';
import AuthContext from '../../site/AuthContext';
import {ICategories, ICollections, IAffirmations} from '../../../types/Models';
import EditCategory from '../Modals/EditCategory';
import DeleteCategory from '../Modals/DeleteCategory';
import EditCollection from '../Modals/EditCollection';
import DeleteCollection from '../Modals/DeleteCollection';
import EditAffirmation from '../Modals/EditAffirmation';
import DeleteAffirmation from '../Modals/DeleteAffirmation';
import './AdminDashboard.css';

interface IAdminDashState {
    categoryResults?: ICategories[] | null;
    collectionResults?: ICollections[] | null;
    affirmationResults?: IAffirmations[] | null;
    categoryFilter: number | null;
    collectionFilter?: number[] | null;
}

class AdminDashboard extends Component <{},IAdminDashState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>

    constructor(props:{}){
        super(props);
        this.state = {
            categoryResults: null,
            collectionResults: null,
            affirmationResults: null,
            categoryFilter: null,
            collectionFilter: null
        }
    }

    componentDidMount() {
        this.grabCategories()
    }

    grabCategories = () => {
        let collectionArray:any = [];
        let affirmationArray:any = [];

        fetch(`${process.env.REACT_APP_DATABASE_URL}category/`, {
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": `${this.context.token}`
            })
        })
        .then(data => data.json())
        .then(data => {
            data.map((cat:ICategories, index:number) => {
                collectionArray.push(...cat.collections)
            })
            collectionArray.map((coll:ICollections, index:number) => {
                affirmationArray.push(...coll.affirmations)
            })
            this.setState({
                categoryResults: data,
                collectionResults: collectionArray,
                affirmationResults: affirmationArray
            })
        }) 
    }

    cascadeFilter = (categoryId : number | null) => {
        let cascadeArray:number[] | null = [];
        if (this.state.collectionResults) {
            cascadeArray = this.state.collectionResults.filter(coll => {
                if (coll.categoryId == categoryId) return true
                return false
            }).map(coll => coll.id)
            console.log(cascadeArray)
        }
        this.setState({categoryFilter: categoryId, 
                      collectionFilter: (categoryId) ? cascadeArray : null})
    }


    render() {
        return(
            <div>
                <button onClick={() => console.log(this.state.categoryResults ,this.state.collectionResults, this.state.affirmationResults)}>CHECK ARRAYS</button>
                <br /><button onClick={() => console.log(this.state.categoryFilter ,this.state.collectionFilter)}>CHECK FILTERS</button>
                <br /><button onClick={() => console.log("CONTEXT:",this.context.token)}>CHECK TOKEN</button>
                <h3>Admin Dashboard</h3>
                <div className="grid grid-cols-3">
                    
                    <div>
                        <h3 className="text-center">Categories</h3>
                            <div className="shadow border rounded-lg">
                                <div className="flex items-center space-x-4 p-2"
                                onClick={() =>  this.setState({categoryFilter: null, collectionFilter: null})}>
                                    <h4>All Categories</h4>
                                </div>
                            </div>
                         {this.state.categoryResults && this.state.categoryResults.map((cat, index) => {
                             return <div key={index} className="shadow border rounded-lg">
                                    <div className="hideParent flex items-center space-x-4 p-2"
                                     onClick={() => this.cascadeFilter(cat.id)}>
                                        <h4>{cat.name}</h4>
                                        <div className="hideChild">
                                            <EditCategory categoryId={cat.id} refreshDash={this.grabCategories}/>
                                        </div>
                                        <div className="hideChild">
                                            <DeleteCategory />
                                        </div>
                                    </div>
                                 </div>
                         })}
                    </div>

                    <div>
                        <h3 className="text-center">Collections</h3>
                            <div className="shadow border rounded-lg">
                                <div className="flex items-center space-x-4 p-2"
                                onClick={() =>  this.cascadeFilter(this.state.categoryFilter)}>
                                    <h4>All Collections</h4>
                                </div>
                            </div>
                         {this.state.collectionResults && this.state.categoryFilter
                            ? this.state.collectionResults.filter(coll => coll.categoryId === this.state.categoryFilter).map((coll, index) => {
                                return <div key={index} className="shadow border rounded-lg">
                                        <div className="hideParent flex items-center space-x-4 p-2"
                                            onClick={() =>  this.setState({collectionFilter: [coll.id]})}>
                                            <h4>{coll.title}</h4>
                                            <div className="hideChild">
                                                <EditCollection
                                                    categoryResults={this.state.categoryResults}
                                                    thisCatId={coll.categoryId}
                                                    collInfo={coll}
                                                    refreshDash={this.grabCategories}
                                                />
                                            </div>
                                            <div className="hideChild">
                                                <DeleteCollection />
                                            </div>
                                        </div>
                                    </div>
                            })
                            : this.state.collectionResults && this.state.collectionResults.map((coll, index) => {
                                return <div key={index} className="shadow border rounded-lg">
                                        <div className="hideParent flex items-center space-x-4 p-2"
                                            onClick={() =>  this.setState({collectionFilter: [coll.id]})}>
                                            <h4>{coll.title}</h4>
                                            <div className="hideChild">
                                                <EditCollection 
                                                    categoryResults={this.state.categoryResults}
                                                    thisCatId={coll.categoryId}
                                                    collInfo={coll}
                                                    refreshDash={this.grabCategories}
                                                />
                                            </div>
                                            <div className="hideChild">
                                                <DeleteCollection />
                                            </div>
                                        </div>
                                    </div>
                         })}
                    </div>

                    <div>
                    <h3 className="text-center">Affirmations</h3>
                         {this.state.affirmationResults && this.state.collectionFilter
                            ? this.state.affirmationResults.filter(aff => this.state.collectionFilter?.includes(aff.collectionId!)).map((aff, index) => {
                                return <div key={index} className="shadow border rounded-lg">
                                        <div className="hideParent flex items-center space-x-4 p-2">
                                            <h4>{aff.statement}</h4>
                                            <div className="hideChild">
                                                <EditAffirmation
                                                    collectionResults={this.state.collectionResults}
                                                    thisCollId={aff.collectionId}
                                                    affInfo={aff}
                                                    refreshDash={this.grabCategories}
                                                />
                                            </div>
                                            <div className="hideChild">
                                                <DeleteAffirmation />
                                            </div>
                                        </div>
                                    </div>
                            })
                            : this.state.affirmationResults && this.state.affirmationResults.map((aff, index) => {
                                return <div key={index} className="shadow border rounded-lg">
                                        <div className="hideParent flex items-center space-x-4 p-2">
                                            <h4>{aff.statement}</h4>
                                            <div className="hideChild">
                                                <EditAffirmation
                                                    collectionResults={this.state.collectionResults}
                                                    thisCollId={aff.collectionId}
                                                    affInfo={aff}
                                                    refreshDash={this.grabCategories}
                                                />
                                            </div>
                                            <div className="hideChild">
                                                <DeleteAffirmation />
                                            </div>
                                        </div>
                                    </div>
                         })}
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminDashboard;