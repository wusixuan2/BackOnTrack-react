import React, {Component} from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import axios from 'axios'
import CalendarDialog from './CalendarDialog.jsx'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AddIcon from '@material-ui/icons/AddCircle'
import "react-big-calendar/lib/css/react-big-calendar.css"
import '../Style/calendar.css'

const localizer = BigCalendar.momentLocalizer(moment);

class Calendar extends Component {
  constructor(props){
    super(props)
    this.state = {
      events: [],
      show: false,
      selectedEvent: {},
    }
  }

  //redirection to create new event page.
  createEventRouteChange = () => {
    let path = `/calendar/create_event`;
    this.props.history.push(path);
  }

  //handle action when an event on the calendar is click.
  //should redirect to new page to show details of the event
  eventClickAction = (e) => {
    this.setState({
      show:!this.state.show,
      selectedEvent: {
        id:e ? e.id : "",
        title:e ? e.title : "",
        description: e ? e.description : "",
        start: e ? e.start : "",
        end: e ? e.end : "",
        client_id: e ? e.client_id : "",
        allday: e ? e.allday : "",
      }
    })
  }



  componentDidMount() {
    const options = {
      method: "GET",
      url: 'http://localhost:3000/api/events/index',
      params: {id: JSON.parse(localStorage.getItem('token')).user_id,
      role: JSON.parse(localStorage.getItem('token')).role}
    }
    axios(options)
    .then((response) => {
      this.setState({events: response.data.events.map((event) =>({
        ...event,
        end:moment(event.end).toDate(),
        start:moment(event.start).toDate(),
      }))})
    })
  }

  render() {
    let addButton;
    if(JSON.parse(localStorage.getItem('token')).role !== "client"){
      addButton =
        <AddIcon
          onClick={this.createEventRouteChange}
          className='Calendar_addEventBtn'
          color='primary'
        />
    }
    return(

      <div style={{height: '800px'}}>
        <AppBar position="static" color="default">
          <Toolbar>
              Calendar
          </Toolbar>
        </AppBar>
        {addButton}
        <BigCalendar
          className='calendar'
          localizer={localizer}
          events={this.state.events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={this.eventClickAction}
          onSelectSlot={this.createEventRouteChange}
          timeslots={2}
          step={30}
          selectable
        />

        <div>
          {this.state.show ?
            <CalendarDialog
              eventClickAction={this.eventClickAction}
              show={this.state.show}
              eventInfo={this.state.selectedEvent}
            /> : null}
        </div>

      </div>
    )
  }


}

export default Calendar
