import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios'
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import DeleteIcon from '@material-ui/icons/Delete';
class Exercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: props.userInfo.userid,
      role: props.userInfo.role,
      relation: props.userInfo.relation,
      tab: 0,
      exercises: [],
      list_client_exercises: {},
      new_exercise: '',
    }
  }
  handleChange = (event, value) => {
    this.setState({tab: value});
  }
  componentDidMount() {
    let id;
    if (this.state.role === 'client') {
      id = this.state.userid
    } else {
      id = this.state.relation.map(person => person.id)
    }
    const options = {
      method: "GET",
      url: 'http://localhost:3000/api/exercises/index',
      params: {id: id}
    }
    axios(options)
    .then((response) => {
      console.log(response.data.exercises)
      if (this.state.role === 'client') {
        this.setState({exercises: response.data.exercises})
      } else {
        const list_client_exercises = {};
        response.data.exercises.map((exercise) => {
          if (!list_client_exercises[exercise.user_id]) {
            list_client_exercises[exercise.user_id] = [exercise]
          } else {
            list_client_exercises[exercise.user_id].push(exercise);
          }
        })
        this.setState({list_client_exercises})
      }
    })

  }

  handleClick = () => {
    const options = {
      method: "POST",
      url: 'https://trackapi.nutritionix.com/v2/natural/exercise',
      headers: {
        'x-app-id': '6f20e60a',
        'x-app-key': '8c1c3fc675791ad02e8e5718aa3847cc',
        'x-remote-user-id': 0,
        'Content-Type': 'application/json',
      },
      data: {
        query: this.state.new_exercise,
        "gender":"female",
         "weight_kg":72.5,
         "height_cm":167.64,
         "age": 24
      }
    }

    this.setState({new_exercise: ''})
    axios(options)
    .then((response) => {
      console.log(response.data.exercises)
      if (response.data.exercises.length !== 0) {
        let newexercise = response.data.exercises[0]
          let modified = {};
          modified.user_id = this.state.userid
          modified.name = newexercise.name
          modified.calories = newexercise.nf_calories
          modified.duration = newexercise.duration_min
        const option = {
          method: "POST",
          url: 'http://localhost:3000/api/exercises/create',
          data: {
            exercise: modified,
          }
        }
        axios(option)
        .then((response) => {
          this.setState({exercises: response.data.exercises})
        })
      }
    })
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  list_client_foods_helper = (person) => {
    return this.state.list_client_exercises[person.id] ? this.state.list_client_exercises[person.id] : [];
  }
  render() {
    let add_food
    if (this.state.role === 'client') {
      add_food = <TableRow><TableCell>
                <TextField
                  name = "new_exercise"
                  label="New Exercise"
                  style={{ margin: 8 }}
                  placeholder="Enter Exercise Query, ex. ran 3 miles"
                  margin="normal"
                  value={this.state.new_exercise}
                  onChange={this.handleInputChange}
                />
              </TableCell>
              <TableCell>
                <Button variant="fab" color="primary" aria-label="Add" onClick={this.handleClick}>
                  <AddIcon />
                </Button></TableCell>
                </TableRow>
            }
    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
              Exercise
          </Toolbar>
        </AppBar>

        <AppBar position="static">
          <Tabs value={this.state.tab} onChange={this.handleChange}>
          {
            this.state.relation.map((person, index) => (
              <Tab label={person.first_name} />
            ))
          }
          </Tabs>
        </AppBar>
        {
          this.state.relation.map((person, index) => (
            this.state.tab === index &&
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Calories</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {add_food}
                { this.state.role === 'client' &&
                  this.state.exercises.map((exercise, index) => (
                    <TableRow key={index}>
                    <TableCell>{exercise.name}</TableCell>
                    <TableCell>{exercise.duration}</TableCell>
                    <TableCell>{exercise.calories}</TableCell>
                    </TableRow>
                  ))
                }
                { this.state.role !== 'client' &&
                this.list_client_foods_helper(person).map((exercise, index) => (
                    <TableRow key={index}>
                    <TableCell>{exercise.name}</TableCell>
                    <TableCell>{exercise.duration}</TableCell>
                    <TableCell>{exercise.calories}</TableCell>
                    </TableRow>
                  ))
            }
              </TableBody>
            </Table>
            )
          )
        }
      </div>
    );
  }

}

export default Exercise
