import React, { Component } from 'react';
import './ClientItemsList.css';
import Grid from '../../Grid/Grid';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Redirect } from 'react-router';


class ClientItemsList extends Component {
  constructor(props){
    super(props);
    console.log("ClientItemsList with Client name",this.props.match.params);
    this.clientName=this.props.match.params.clientName;

  }
  render() {
    const whereObj={userName:this.clientName};
    return (
      <React.Fragment>
        <h2>{this.clientName} Items List</h2>
        <Grid 
          modelMeta={'/api/meta/client_items'} 
          modelApi={'/api/ClientItems/findByClient'} 
          whereObj={whereObj}
          editable={false}
          useShortFieldsSyntax={false}
        />
      </React.Fragment>

    );
  }
}

export default ClientItemsList
