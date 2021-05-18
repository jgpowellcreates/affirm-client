import React, {Component} from 'react';
import { resourceLimits } from 'worker_threads';
import AuthContext from '../../site/AuthContext';

interface IAdminDashState {
    categoryResults?: ICategories[] | undefined | null;
    collectionResults?: ICollections[] | undefined | null;
    affirmationResults?: IAffirmations[] | undefined | null;
    token: string | undefined | null;
    categoryFilter: number | null;
    collectionFilter: number | null;
}

interface ICategories {
    collections: ICollections[];
    createdAt: string;
    id: number;
    name: string;
    updatedAt: string;
}

interface ICollections {
    affirmations: IAffirmations[];
    bannerImg: string | undefined | null;
    categoryId: number;
    createdAt: string;
    id: number;
    isPublic: boolean;
    title: string;
    updatedAt: string;
}

interface IAffirmations {
    collectionId?: number | null;
    createdAt: string;
    id: number;
    ownerRole: number;
    statement: string;
    updatedAt: string;
    userCollectionId?: number | null;
}


class AdminDashboard extends Component <{},IAdminDashState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>

    constructor(props : any){
        super(props);
        this.state = {
            categoryResults: null,
            collectionResults: null,
            affirmationResults: null,
            token: null,
            categoryFilter: null,
            collectionFilter: null
        }
    }

    componentDidMount() {
        this.setState({token: this.context.token}, this.grabCategories)
    }

    grabCategories = () => {
        let collectionArray:any = [];
        let affirmationArray:any = [];

        fetch(`${process.env.REACT_APP_DATABASE_URL}category/`, {
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg5NTMyMzcwLTNmODctNDBkZi1hYzMxLTNkNWEwMGJjMGU2YiIsImlhdCI6MTYyMTM1MjM3NCwiZXhwIjoxNjIxNDM4Nzc0fQ.UgSXhRCq1m4vLH4SLHJ9XzIUbz2Ub5QN2scm-nn30Fk"
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

    render() {
        return(
            <div>
                <button onClick={() => console.log(this.state.categoryResults ,this.state.collectionResults, this.state.affirmationResults)}>CHECK ARRAYS</button>
                <br /><button onClick={() => console.log(this.state.categoryFilter ,this.state.collectionFilter)}>CHECK FILTERS</button>
                <h3>Admin Dashboard</h3>
                <div className="grid grid-cols-3">
                    
                    <div>
                        <h3 className="text-center">Categories</h3>
                         {this.state.categoryResults && this.state.categoryResults.map((cat, index) => {
                             return <div key={index} className="shadow border rounded-lg">
                                     <div className="flex items-center space-x-4 p-2"
                                     onClick={() =>  this.setState({categoryFilter: cat.id})}>
                                         <h4>{cat.name}</h4>

                                     </div>
                                 </div>
                         })}
                    </div>

                    <div>
                        <h3 className="text-center">Collections</h3>
                         {this.state.collectionResults && this.state.categoryFilter
                            ? this.state.collectionResults.filter(coll => coll.categoryId === this.state.categoryFilter).map((coll, index) => {
                                return <div key={index} className="shadow border rounded-lg">
                                        <div className="flex items-center space-x-4 p-2"
                                            onClick={() =>  this.setState({collectionFilter: coll.id})}>
                                            <h4>{coll.title}</h4>

                                        </div>
                                    </div>
                            })
                            : this.state.collectionResults && this.state.collectionResults.map((coll, index) => {
                                return <div key={index} className="shadow border rounded-lg">
                                        <div className="flex items-center space-x-4 p-2"
                                            onClick={() =>  this.setState({collectionFilter: coll.id})}>
                                            <h4>{coll.title}</h4>

                                        </div>
                                    </div>
                         })}
                    </div>

                    <div>
                    <h3 className="text-center">Affirmations</h3>
                         {this.state.affirmationResults && this.state.collectionFilter
                            ? this.state.affirmationResults.filter(aff => aff.collectionId === this.state.collectionFilter).map((aff, index) => {
                                return <div key={index} className="shadow border rounded-lg">
                                        <div className="flex items-center space-x-4 p-2">
                                            <h4>{aff.statement}</h4>

                                        </div>
                                    </div>
                            })
                            : this.state.affirmationResults && this.state.affirmationResults.map((aff, index) => {
                                return <div key={index} className="shadow border rounded-lg">
                                        <div className="flex items-center space-x-4 p-2">
                                            <h4>{aff.statement}</h4>

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

//Running again, but adding in stateful variables for the Collections & Affirmations.
//Stateful variables can then be filtered before being mapped into the Rendered area
//componentDidUpdate should only need to run when Cat/Coll/Aff are added/edited deleted
//If statements check for filter IDs, otherwise, they map everything




// populateCollections : ICollections[] = [];
//     filteredCollections : ICollections[] | undefined | null = []
//     narrowCollections(cat : ICategories) {
//         /* console.log("Recognize the click");
//         this.setState({categoryFilter: cat.id}) */
//         this.filteredCollections = this.populateCollections.filter((coll, index) => (coll.categoryId === this.state.categoryFilter && this.populateCollections.indexOf(coll) === index));
//     }

//     populateAffirmations : IAffirmations[] = [];
//     filteredAffirmations : IAffirmations[] | undefined | null = this.populateAffirmations.filter(aff => aff.id === this.state.collectionFilter)

//     render(){
//         return(
//             <div>
//                     <h3>Admin Dashboard</h3>
//                     <button onClick={() => console.log("Category Filter:", this.state.categoryFilter, "Collection Filter:", this.state.collectionFilter)}>Check Filters</button>
//                     <br />
//                     <button onClick={() => console.log("Populated:", this.populateCollections, "Filtered:", this.filteredCollections)}>Check Affs</button>

//                 <div className="grid grid-cols-3">

//                     <div id="columnOne">
//                         <h3 className="text-center">Categories</h3>
//                         {this.state.categoryResults && this.state.categoryResults.map((cat, index) => {
//                             this.populateCollections.push(...cat.collections)
//                             return <div key={index} className="shadow border rounded-lg">
//                                     <div className="flex items-center space-x-4 p-2"
//                                     onClick={() =>  this.setState({categoryFilter: cat.id},  this.narrowCollections(cat)}>
//                                         <h4>{cat.name}</h4>

//                                     </div>
//                                 </div>
//                         })}
//                     </div>

//                     <div id="columnTwo">
//                         <h3 className="text-center">Collections</h3>
//                             {this.filteredCollections && this.filteredCollections.map((coll:any, index:number) => {
//                             return(
//                                 <div key={index} className="shadow border rounded-lg">
//                                     <div className="flex items-center space-x-4 p-2">
//                                         <h4>{coll.title}</h4>
//                                     </div>
//                                 </div>
//                                 )
//                             })}
//                         {/* {this.populateCollections && this.filteredAffirmations && this.populateCollections.map((coll, index) => {
//                             this.populateAffirmations.push(...coll.affirmations)
//                             return <div key={index} className="shadow border rounded-lg">
//                                     <div className="flex items-center space-x-4 p-2"
//                                         onClick={() => this.setState({collectionFilter: coll.id})}>
//                                         <h4>{coll.title}</h4>
//                                     </div>
//                                 </div>
//                         })} */}

//                     </div>
//                     <div id="columnThree">
//                         <h3 className="text-center">Affirmations</h3>
                        
//                         {/* this.filteredAffirmations && 
//                         this.filteredAffirmations.map((aff, index) => {
//                             return <div key={index} className="shadow border rounded-lg">
//                                     <div className="flex items-center space-x-4 p-2">
//                                         <h4>{aff.statement}</h4>
//                                     </div>
//                                 </div> */
//                         }
//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }
// export default AdminDashboard;

// //<CollectionsMap colls={this.populateCollections.filter((coll, index) => (coll.categoryId === this.state.categoryFilter && this.populateCollections.indexOf(coll) === index))}/>


// const CollectionsMap = (props: any) => {
//     return(
//         props.colls.map((coll:any, index:number) => {
//             return(
//             <div key={index} className="shadow border rounded-lg">
//                 <div className="flex items-center space-x-4 p-2">
//                     <h4>{coll.title}</h4>
//                 </div>
//             </div>
//             )
//         })
//     )
// }

// //<AffirmationsMap affs={this.populateAffirmations.filter((aff, index) => (aff.collectionId === this.state.collectionFilter && this.populateAffirmations.indexOf(aff) === index))} />

// const AffirmationsMap = (props : any) => {
//     return(
//         props.affs.map((aff:any, index:number) => {
//             <div key={index} className="shadow border rounded-lg">
//                 <div className="flex items-center space-x-4 p-2">
//                     <h4>{aff.statement}</h4>
//                 </div>
//             </div>
//     })
//     )
// }
