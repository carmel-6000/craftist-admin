import React, { Component } from 'react';
import './App.css';
import Grid from './Grid/Grid';
import Example from './Grid/Example';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Redirect } from 'react-router';
import Login from './Auth/Login';
import Auth  from './Auth/Auth';
import ClientItemsList from './scenes/ClientItemsList/ClientItemsList';
import logoImage from './img/craftist-logo.jpg';

const PrivateRoute = ({component:Component, ...rest})=>(
  <Route {...rest} render={(props)=>(
    Auth.isAuthenticated()===true ? <Component {...props} /> : <Redirect to='/login' />
    )}/>
  )
  
class App extends Component {

render() {
    return (
      <Router>
      
      <div className="App">

      <header className="App-header">
        
        <Link to="/"><img src={logoImage} className='craftist-logo' /></Link>
        <h1 className="App-title"><Link to="/">Craftist Admin</Link></h1>
         <ul>
          <li>
            <div onClick={this.logOut}>Log Out</div>
          </li>
        </ul>
      </header>

        <PrivateRoute exact path="/" 
          component={()=>(<Grid modelMeta={'/api/meta/clients'} modelApi={'/api/Clients'} useShortFieldsSyntax={true}/>)}
        />
        <Route path="/clients/:clientName/items" component={ClientItemsList} />
        <Route path="/login" component={Login} />
      </div>
      
      </Router>
    );
  }
}


//export default App;
export default App
