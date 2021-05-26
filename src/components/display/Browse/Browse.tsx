import React, {Component} from 'react';
import AffirmationList from './AffirmationList';
import {ICategories} from '../../../types/Models';

interface IBrowse {
    categoryResults: ICategories[] | null;
    token: string | null;
}

class Browse extends Component <{},IBrowse> {
    constructor(props : {}){
        super(props);
        this.state = {
            categoryResults: null,
            token: null,
        }
    }

    componentDidMount() {
        this.setState({token: this.context.token}, this.grabCategories)
    }

    grabCategories = () => {
        fetch(`${process.env.REACT_APP_DATABASE_URL}category/`, {
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg5NTMyMzcwLTNmODctNDBkZi1hYzMxLTNkNWEwMGJjMGU2YiIsImlhdCI6MTYyMTQzMzQwMywiZXhwIjoxNjIxNTE5ODAzfQ.PPGd39wBJND8AhuHG0F9JYFh2VSVs2FGGaTdv4Z697E"
            })
        })
        .then(data => data.json())
        .then(data => this.setState({categoryResults: data}))
    }

    render(){
        return(
            <div id="activeBrowseWindow" className="w-full h-screen">
                <div id="backgroundColor" className="h-screen bg-gradient-to-r from-custom-darkblue via-custom-darkblue to-custom-darkblue-dark">
                    <div className="h-20 w-full bg-gradient-to-r from-custom-darkblue via-custom-darkblue to-custom-darkblue-dark">
                        <h3 className="text-center pt-6 text-white text-3xl font-bold">Browse All Categories</h3>
                    </div>

                    <div id="navCurveBGColor" className="h-full rounded-tl-3xl bg-gradient-to-b from-custom-lightblue-light via-custom-orange to-custom-deeppurple-shade">
                    <div id="navCurve" className="h-full bg-custom-lightblue bg-opacity-80 rounded-tl-3xl pl-3 pt-3 overflow-y-auto">
                    {this.state.categoryResults?.map((cat, index) => {
                        if (cat.collections.length > 0) {
                        return(
                        <div id="categoryHolder"
                            key={index}
                            className=" m-1 p-1">

                            <h2 id="categoryName"
                                className="w-max mx-1 mt-1 mb-0 px-5 pt-3 pb-0 rounded-t-lg
                                          text-lg text-white font-bold bg-custom-darkblue"
                            >
                                {cat.name}
                            </h2>
                            <div id="holdsCollectionArray"
                                className="overflow-x-auto w-min min-w-4 flex mx-1 mt-0 mb-0 p-2 rounded-b-lg rounded-tr-lg bg-gradient-to-br from-custom-darkblue to-custom-darkblue-light">
                            
                            {cat.collections.map((coll, collIndex) => {
                                return(
                                <div key={collIndex}
                                    id="collectionCards"
                                    className="flex flex-col justify-between min-w-3 max-w-6xl m-2 p-3 h-36 bg-white bg-opacity-80 rounded-xl hover:shadow-xl">

                                    <h3 className="text-custom-deeppurple font-semibold"
                                        >{coll.title}
                                    </h3>
                                    <div id="" className=" self-center">
                                        <AffirmationList
                                            title={coll.title}
                                            description={coll.description}
                                            affirmations={coll.affirmations}
                                            update={this.grabCategories}
                                            />
                                    </div>
                                </div>
                                )
                            })}

                            
                            </div>
                        </div>
                        )
                        }
                    })}
                    </div>
                    </div> {/* This is the nav curve gradient. */}
                </div>
            </div>
        )
    }
}
export default Browse;