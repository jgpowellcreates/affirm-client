import React, {Component, useContext} from 'react';
import {BrowserRouter as Router, Switch, Route, RouteComponentProps} from 'react-router-dom';
import Splash from './components/site/Splash';
import Navigation from './components/site/Navigation';
import Browse from './components/display/Browse/Browse';
import MyPractice from './components/display/MyPractice/MyPractice';
import AdminDashboard from './components/display/AdminDash/AdminDashboard';
import Resources from './components/display/Resources/Resources';
import AuthContext from './components/site/AuthContext';
import {userRoles} from './types/Models'

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

          <Route path="/" component={Splash} />}
        </Router>
      </div>
  );
}

export default App;

/* interface AuthRouteProps {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  history: any;
}

class AuthRoute extends React.Component<AuthRouteProps, {}> {
  static contextType = AuthContext;
  constructor(props: AuthRouteProps) {
    super(props);
  }

  render() {
    if (this.context.roleId < userRoles.admin) {
      this.props.history.push('/')
    }

    return <Route path={this.props.path} component={this.props.component} />
  }
} */