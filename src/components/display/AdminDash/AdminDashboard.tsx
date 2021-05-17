import React, {Component} from 'react';
import Container from '@material-ui/core/Container';

class AdminDashboard extends Component <{},{}> {
    constructor(props : any){
        super(props);
        this.state = {

        }
    }

    render(){
        return(
            <Container>
                <h3>Admin Dashboard</h3>
            </Container>
        )
    }
}
export default AdminDashboard;