import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios'
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import { Redirect } from "react-router-dom";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: props.userid,
      add_client_email: "",
      role: props.role,
      relation: props.relation,
      tab: 0
    }
  }
  handleInputChange = e => {
    this.setState({ add_client_email: e.target.value });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ add_client_email: "" });
    const option = {
      method: "POST",
      url: 'http://localhost:3000/api/users/update',
      data: this.state
    }
    axios(option)
    .then((response) => {
      if (response.status === 200) {
        console.log(response.data.updated_relation)
        this.props.updateRelation(response.data.updated_relation);
        this.setState({relation: response.data.updated_relation})
      }
    })
  }
  handleChange = (event, value) => {
    this.setState({tab: value});
  }
  render() {
    if (this.props.redirect) {
      return (
        <Redirect to={this.props.redirect} />);
    }
    let tabs;
    if(JSON.parse(localStorage.getItem('token')).role === "doctor"){
      tabs = <Tabs value={this.state.tab} onChange={this.handleChange}>
      <Tab label="New Client" />
      {
        this.state.relation.map((person, index) => (
          <Tab label={person.first_name} />
        ))
      }
      </Tabs>
    }
    return (
      <div>
      <AppBar position="static" color="default">
          <Toolbar>
              Dashboard
          </Toolbar>
        </AppBar>
        <AppBar position="static">
          {tabs}
        </AppBar>
        {
          this.state.tab === 0 &&
          <form onSubmit={this.handleSubmit}>
            <TextField
              label="Add Client"
              style={{ margin: 8 }}
              placeholder="Enter Client Email"
              margin="normal"
              onChange={this.handleInputChange}
              value={this.state.add_client_email}
            />
          <Button color="inherit" type="submit">Add</Button>
          </form>
        }
        {   this.state.relation.map((person, index) => (
            (this.state.tab - 1) === index &&
            <div>
              <p>First Name: {person.first_name}</p>
              <p>Last Name: {person.last_name}</p>
              <p>Email: {person.email}</p>
            </div>
            ))
        }


        <List>


        </List>

      </div>
    );
  }
}

