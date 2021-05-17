import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {CssBaseline, Container, Drawer, AppBar, Toolbar,
    List, ListItem, ListItemIcon, ListItemText, Typography} from '@material-ui/core';

export default class Navigation extends Component<{},{}> {
    constructor(props : any){
        super(props);
        this.state = {

        }
    }

    render() {
        return(
            <Container>
                <CssBaseline>
                    <AppBar position="fixed">
                        <Toolbar>
                            <Typography>
                                Affirm Brand
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Drawer variant="permanent">
                        <Toolbar>
                            <div>
                                <List>
                                    <ListItem>
                                        <Link to='/browse'>
                                            <ListItemText>Browse</ListItemText>
                                        </Link>
                                    </ListItem>
                                    <ListItem>
                                        <Link to="/mypractice">
                                            <ListItemText>My Practice</ListItemText>
                                        </Link>
                                    </ListItem>
                                    <ListItem>
                                        <Link to="/resources">
                                            <ListItemText>Resources</ListItemText>
                                        </Link>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText>Log Out</ListItemText>
                                    </ListItem>
                                </List>
                            </div>
                        </Toolbar>
                    </Drawer>
                </CssBaseline>
            </Container>
        )
    }
};