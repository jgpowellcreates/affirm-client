import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { Container } from '@material-ui/core';
import Splash from '../src/components/site/Splash';
import Navigation from '../src/components/site/Navigation';
import Browse from '../src/components/display/Browse/Browse';
import MyPractice from '../src/components/display/MyPractice/MyPractice';
import Resources from '../src/components/display/Resources/Resources';

function App() {

  const sessionToken = null;

  const viewConductor = () => {
    return sessionToken !== undefined
      ? <>
        <Router>
          <Navigation />
          <h2>Test Text - App Component</h2>
          <Switch>
              <Route exact path="/browse"><Browse /></Route>
              <Route exact path="/mypractice"><MyPractice /></Route>
              <Route exact path="/resources"><Resources /></Route>
          </Switch>
        </Router>
        </>
      : <Splash />
  }

  return(
      <Container maxWidth="sm">
        <Splash />
      </Container>
  );
}

export default App;
