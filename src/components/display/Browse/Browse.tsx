import React, {Component} from 'react';
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
            token: null
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
                {this.state.categoryResults?.map((cat, index) => {
                    return(
                    <div key={index}>
                        <h3>{cat.name}</h3>
                        <div className="flex">
                        {cat.collections.map((coll, collIndex) => {
                            return(
                            <div key={collIndex} className="shadow border rounded-lg flex-row">
                                <h3>{coll.title}</h3>
                            </div>
                            )
                        })}
                        </div>
                    </div>
                    )
                })}
            </div>
        )
    }
}
export default Browse;