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
import  { Glyphicon , Navbar , Nav , NavItem , NavDropdown , DropdownButton , MenuItem , NavbarHeader, NavbarBrand } from 'react-bootstrap/lib'

const PrivateRoute = ({component:Component, ...rest})=>(
  <Route {...rest} render={(props)=>(
    Auth.isAuthenticated()===true ? <Component {...props}/> : <Redirect to='/login' />
    )}/>
  )

const DropDownTitle=(props)=>{
  return (<div>
    <Glyphicon glyph="user" /> { " " + localStorage.getItem('email')}
  </div>);
}

class  NavHeaderComponent extends Component {
    constructor(props) {
        super(props);

    }

    render () {
        return (
            <Nav className="pull-right dropdown-title" >
                <DropdownButton noCaret bStyle="btn btn-lg"
                eventKey={3} title={ <DropDownTitle/> } 
            >
                      <MenuItem eventKey='3' onClick={this.props.logout}><Glyphicon glyph="log-out" /> Logout</MenuItem>
                </DropdownButton>
            </Nav>
        );
    }
}
  
class App extends Component {

    constructor(props){
        super(props)
        this.state = { navHeader: Auth.isAuthenticated() === true ? true : false,  }
    }

    updateNav = () => {
        this.setState({ navHeader: true})
    }

    // Calling Auth.logout -> clears cache and returns back. hitting route login
    logOut = () => {
        Auth.logout();
        this.setState({ navHeader: false});
    }

    render() {
        let navHeader = this.state.navHeader === true ? <NavHeaderComponent logout={this.logOut} /> : "";
            return (
              <Router>
              <div className="App">
                    {navHeader}
                    <header className="App-header">
                      <Link to="/"><img src={logoImage} className='craftist-logo' /></Link>
                      <h1 className="App-title"><Link to="/" className="heading-style">Craftist Admin Panel</Link></h1>
                    </header>

                    <PrivateRoute exact
                          path="/"
                          component={()=>(
                          <Grid modelMeta={'/api/meta/clients'} modelApi={'/api/Clients'} useShortFieldsSyntax={true} navHeader={this.updateNav}/>
                      )
                      }
                    />
                    <Route path="/clients/:clientName/items" component={ClientItemsList} />
                    <Route
                        path="/login"
                        render={(props)=><Login {...props} navHeader={this.updateNav} />}
                    />
              </div>

              </Router>
            );
        }
}


//export default App;
export default App
