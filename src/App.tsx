import React, {useContext} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import LogInPage from './components/site/LogInPage';
import Navigation from './components/site/Navigation';
import Browse from './components/display/Browse/Browse';
import MyPractice from './components/display/MyPractice/MyPractice';
import AdminDashboard from './components/display/AdminDash/AdminDashboard';
import Resources from './components/display/Resources/Resources';
import AuthContext from './components/site/AuthContext';

function App() {
  const userInfo = useContext(AuthContext);

  return(
      <div>
        <Router>
          {userInfo.token
          ?
          <>
              <Navigation />
              <div className="flex-initial" style={{margin: "0 0 0 10em"}}>
              <Switch>
                  <Route exact path="/browse" component={Browse} />
                  <Route exact path="/mypractice" component={MyPractice} />
                  <Route exact path="/admindash" component={AdminDashboard} />
                  <Route exact path="/resources" component ={Resources} />
              </Switch>
              </div>
            </>
          : 
          <Route path="/" component={LogInPage} />}
        </Router>
      </div>
  );
}

export default App;