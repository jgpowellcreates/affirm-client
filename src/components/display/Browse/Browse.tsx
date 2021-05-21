import React, {Component} from 'react';
import AffirmationList from '../Modals/AffirmationList';
import {ICategories} from '../../../types/Models';

interface IBrowse {
    categoryResults: ICategories[] | null;
    token: string | null;
}

class Browse extends Component <{},IBrowse> {
    constructor(props : any){
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
                Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg5NTMyMzcwLTNmODctNDBkZi1hYzMxLTNkNWEwMGJjMGU2YiIsImlhdCI6MTYyMTQzMzQwMywiZXhwIjoxNjIxNTE5ODAzfQ.PPGd39wBJND8AhuHG0F9JYFh2VSVs2FGGaTdv4Z697E"
            })
        })
        .then(data => data.json())
        .then(data => {this.setState({categoryResults: data})})
    }

    render(){
        return(
            <div>
                <h3>Browse</h3>
                <button onClick={() => console.log(this.state.categoryResults)}>See Results</button>
                {this.state.categoryResults?.map((cat, index) => {
                    if (cat.collections.length > 0) {
                    return(
                    <div id="eachCategoryHolder" key={index} className="m-1 p-1">
                        <h2>{cat.name}</h2>
                        <div id="holdsCollectionArray" className="flex bg-green-200 m-1 p-1">
                        {cat.collections.map((coll, collIndex) => {
                            return(
                            <div key={collIndex} className="shadow border rounded-lg flex-row bg-blue-200 m-1 p-1">
                                <h3>{coll.title}</h3>
                                <AffirmationList
                                    title={coll.title}
                                    description={coll.description}
                                    affirmations={coll.affirmations} />
                            </div>
                            )
                        })}
                        </div>
                    </div>
                    )
                    }
                })}
            </div>
        )
    }
}
export default Browse;