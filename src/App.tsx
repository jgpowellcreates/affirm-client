import React, {useContext} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { Container } from '@material-ui/core';
import Splash from './components/site/Splash';
import Navigation from './components/site/Navigation';
import Browse from './components/display/Browse/Browse';
import MyPractice from './components/display/MyPractice/MyPractice';
import AdminDashboard from './components/display/AdminDash/AdminDashboard';
import Resources from './components/display/Resources/Resources';
import AuthContext from './components/site/AuthContext';

function App() {
  const userInfo = useContext(AuthContext);

  return(
      <Container maxWidth="sm">
        {userInfo.token
        ?
        <>
          <Router>
            <Navigation />
            <h2>I NEED A WAY TO CREATE SPACE FROM THE HEADER</h2>
            <Switch>
                <Route exact path="/browse"><Browse /></Route>
                <Route exact path="/mypractice"><MyPractice /></Route>
                <Route exact path="/admindash"><AdminDashboard /></Route>
                <Route exact path="/resources"><Resources /></Route>
            </Switch>
          </Router>
          </>
        : 
        <Splash />}
        {`Id ${userInfo.id}  roleId: ${userInfo.roleId}   token: ${userInfo.token}`}
      </Container>
  );
}

export default App;
