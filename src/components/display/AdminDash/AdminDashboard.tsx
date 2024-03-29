import React, {Component} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import AuthContext from '../../site/AuthContext';
import {ICategories, ICollections, IAffirmations, userRoles} from '../../../types/Models';
import AddCategory from '../Modals/AddCategory';
import EditCategory from '../Modals/EditCategory';
import DeleteCategory from '../Modals/DeleteCategory';
import AddCollection from '../Modals/AddCollection';
import EditCollection from '../Modals/EditCollection';
import DeleteCollection from '../Modals/DeleteCollection';
import AddAffirmation from '../Modals/AddAffirmation';
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

interface IAdminDashProps extends RouteComponentProps {}

class AdminDashboard extends Component <IAdminDashProps, IAdminDashState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>

    constructor(props: IAdminDashProps){
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
        if (this.context.roleId! < userRoles.admin) {
            this.props.history.push('/browse');
        }
        this.grabCategories()
    }

    grabCategories = () => {
        let collectionArray:ICollections[] = [];
        let affirmationArray:IAffirmations[] = [];

        fetch(`${process.env.REACT_APP_DATABASE_URL}category/`, {
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": `${this.context.token}`
            })
        })
        .then(data => data.json())
        .then(data => {
            data.map((cat:ICategories, index:number) => {
                return collectionArray.push(...cat.collections)
            })
            collectionArray.map((coll:ICollections, index:number) => {
                return affirmationArray.push(...coll.affirmations)
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
                if (coll.categoryId === categoryId) return true
                return false
            }).map(coll => coll.id)
            //console.log(cascadeArray)
        }
        this.setState({categoryFilter: categoryId, 
                      collectionFilter: (categoryId) ? cascadeArray : null})
    }

    render() {
        return(
            <div id="activeDashWindow" className="w-full h-screen">
                <div id="backgroundColor" className=" h-screen bg-gradient-to-r from-custom-darkblue via-custom-darkblue to-custom-darkblue-dark">
                    <div className="h-20 bg-gradient-to-r from-custom-darkblue via-custom-darkblue to-custom-darkblue-dark">
                        <h3 className="text-center pt-6 text-white text-3xl font-bold">Admin Dashboard</h3>
                    </div>
                    
                    <div id="navCurveBGColor" className="h-full rounded-tl-3xl bg-gradient-to-b from-custom-lightblue-light via-custom-orange to-custom-deeppurple-shade">
                    <div id="navCurve" className="h-screen bg-custom-lightblue bg-opacity-80 rounded-tl-3xl pl-3 pt-3">
                        
                        {/* COLUMN TITLES */}
                        <div className="grid grid-cols-12">
                            <div className="col-span-3 flex flex-row justify-center content-end">
                                <div className="flex content-end text-center w-min pl-4 mx-3">
                                    <h4 className="bg-white px-5 pt-1 rounded-t-lg text-lg text-custom-deeppurple font-bold">Categories</h4>
                                </div>
                                <div className="float-right">
                                    <AddCategory refreshDash={this.grabCategories}/>
                                </div>
                            </div>
                            <div className="col-span-4 flex flex-row justify-center content-end">
                                <div className="flex content-end text-center w-min pl-4 mx-3">
                                    <h4 className="bg-white px-5 pt-1 rounded-t-lg text-lg text-custom-deeppurple font-bold">Collections</h4>
                                </div>
                                <div>
                                    <AddCollection
                                        categoryResults={this.state.categoryResults}
                                        refreshDash={this.grabCategories}
                                    />
                                </div>
                            </div>
                            <div className="col-span-5 flex flex-row justify-center content-end">
                                <div className="flex content-end text-center w-min pl-4 mx-3">
                                    <h4 className="bg-white px-5 pt-1 rounded-t-lg text-lg text-custom-deeppurple font-bold">Affirmations</h4>
                                </div>
                                <div>
                                    <AddAffirmation
                                        collectionResults={this.state.collectionResults}
                                        refreshDash={this.grabCategories}
                                    />
                                </div>
                            </div>
                        </div>
                        

                        {/* COLUMN DETAILS */}
                        <div className="grid grid-cols-12 h-full overflow-y-auto">
                            
                            {/* COLUMN 1 */}
                            <div className="col-span-3 h-full px-1">
                                <div id="contentWrapper" className="px-2 py-1 rounded-lg bg-white">
                                    <div className="bg-custom-lightblue-light rounded-lg hover:bg-opacity-30">
                                        {/*  */}
                                        <div className="p-2 my-1"
                                        onClick={() =>  this.setState({categoryFilter: null, collectionFilter: null})}>
                                            <h4 className="text-custom-deeppurple font-semibold">All Categories</h4>
                                        </div>
                                    </div>
                                    {this.state.categoryResults && this.state.categoryResults.map((cat, index) => {
                                        return <div key={index} className="bg-custom-lightblue-light rounded-lg hover:bg-opacity-30">
                                            <div className="hideParent flex justify-between items-center space-x-4 p-3 my-1"
                                                onClick={() => this.cascadeFilter(cat.id)}>
                                                <h4 className="text-custom-deeppurple font-semibold">{cat.name}</h4>
                                                <div id="buttonOptions" className="flex flex-row justify-end">
                                                    <div className="hideChild">
                                                        <EditCategory categoryId={cat.id} categoryName={cat.name} refreshDash={this.grabCategories}/>
                                                    </div>
                                                    <div className="hideChild">
                                                        <DeleteCategory
                                                            categoryId={cat.id}
                                                            categoryInfo={cat}
                                                            refreshDash={this.grabCategories}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    })}
                                </div>
                            </div>
                            
                            {/* COLUMN TWO */}
                            <div className="col-span-4 px-1">
                                <div id="contentWrapper" className="px-2 py-1 rounded-lg bg-white">
                                    <div className="bg-custom-lightblue-light rounded-lg hover:bg-opacity-30">
                                        <div className="p-2 my-1"
                                        onClick={() =>  this.cascadeFilter(this.state.categoryFilter)}>
                                            <h4 className="text-custom-deeppurple font-semibold ">All Collections</h4>
                                        </div>
                                    </div>
                                    {this.state.collectionResults && this.state.categoryFilter
                                    ? this.state.collectionResults.filter(coll => coll.categoryId === this.state.categoryFilter).map((coll, index) => {
                                        return <div key={index} className="bg-custom-lightblue-light rounded-lg hover:bg-opacity-30">
                                                <div className="hideParent flex justify-between items-center space-x-4 p-2 my-1"
                                                    onClick={() =>  this.setState({collectionFilter: [coll.id]})}>
                                                    <h4 className="text-custom-deeppurple font-semibold">{coll.title}</h4>
                                                    <div id="buttonOptions" className="flex flex-row justify-end"> 
                                                        <div className="hideChild">
                                                            <EditCollection
                                                                categoryResults={this.state.categoryResults}
                                                                thisCatId={coll.categoryId}
                                                                collInfo={coll}
                                                                refreshDash={this.grabCategories}
                                                            />
                                                        </div>
                                                        <div className="hideChild">
                                                            <DeleteCollection
                                                                collectionId={coll.id}
                                                                collectionInfo={coll}
                                                                refreshDash={this.grabCategories}    
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    })
                                    : this.state.collectionResults && this.state.collectionResults.map((coll, index) => {
                                        return <div key={index} className="bg-custom-lightblue-light rounded-lg hover:bg-opacity-30">
                                                <div className="hideParent flex justify-between items-center space-x-4 p-2 my-1"
                                                    onClick={() =>  this.setState({collectionFilter: [coll.id]})}>
                                                    <h4 className="text-custom-deeppurple font-semibold">{coll.title}</h4>
                                                    <div id="buttonOptions" className="flex flex-row justify-end">
                                                        <div className="hideChild">
                                                            <EditCollection 
                                                                categoryResults={this.state.categoryResults}
                                                                thisCatId={coll.categoryId}
                                                                collInfo={coll}
                                                                refreshDash={this.grabCategories}
                                                            />
                                                        </div>
                                                        <div className="hideChild">
                                                            <DeleteCollection
                                                                collectionId={coll.id}
                                                                collectionInfo={coll}
                                                                refreshDash={this.grabCategories}    
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    })}
                                </div>
                            </div>

                            {/* COLUMN 3 */}
                            <div className="col-span-5 px-1 pr-3">
                                <div id="contentWrapper" className="px-2 py-1 rounded-lg bg-white">
                                    {this.state.affirmationResults && this.state.collectionFilter
                                    ? this.state.affirmationResults.filter(aff => this.state.collectionFilter?.includes(aff.collectionId!)).map((aff, index) => {
                                        return <div key={index} className="bg-custom-lightblue-light rounded-lg hover:bg-opacity-30">
                                                <div className="hideParent flex justify-between items-center space-x-4 p-2 my-1">
                                                    <h4 className="text-custom-deeppurple font-semibold">{aff.statement}</h4>
                                                    <div  id="buttonOptions" className="flex flex-row justify-end">
                                                        <div className="hideChild">
                                                            <EditAffirmation
                                                                collectionResults={this.state.collectionResults}
                                                                thisCollId={aff.collectionId}
                                                                affInfo={aff}
                                                                refreshDash={this.grabCategories}
                                                            />
                                                        </div>
                                                        <div className="hideChild">
                                                            <DeleteAffirmation
                                                                affirmationId={aff.id}
                                                                affirmationInfo={aff}
                                                                refreshDash={this.grabCategories}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    })
                                    : this.state.affirmationResults && this.state.affirmationResults.map((aff, index) => {
                                        return <div key={index} className="bg-custom-lightblue-light rounded-lg hover:bg-opacity-30">
                                                <div className="hideParent flex justify-between items-center space-x-4 p-2 my-1">
                                                    <h4 className="text-custom-deeppurple font-semibold">{aff.statement}</h4>
                                                    <div id="buttonOptions" className="flex flex-row justify-end">
                                                        <div className="hideChild">
                                                            <EditAffirmation
                                                                collectionResults={this.state.collectionResults}
                                                                thisCollId={aff.collectionId}
                                                                affInfo={aff}
                                                                refreshDash={this.grabCategories}
                                                            />
                                                        </div>
                                                        <div className="hideChild">
                                                            <DeleteAffirmation
                                                                affirmationId={aff.id}
                                                                affirmationInfo={aff}
                                                                refreshDash={this.grabCategories}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    })}
                                </div>
                            </div>
                            {/* END OF INDIVIDUAL COLUMNS */}

                        </div>   
                    </div>         
                    </div> {/* This is a gradient behind the nav curve. */}
                </div>
            </div>
        )
    }
}

export default AdminDashboard;