import React from 'react';
import Api from '../providers/calendarProvider';
import CalendarList from './CalendarList';
import CalendarForm from './CalendarForm';

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.api = new Api();
    this.state = {
      meetings: [],
    };
  }

  componentDidMount() {
    this.api.load().then((meetings) => {
      this.setState({ meetings });
    });
  }

  handleFormSubmit = (formData) => {
    const updateMeetings = [...this.state.meetings, formData];
    this.setState({ meetings: updateMeetings });

    this.api.update(formData);
  };
  render() {
    return (
      <div>
        <CalendarList meetings={this.state.meetings} />
        <CalendarForm onSubmit={this.handleFormSubmit} />
      </div>
    );
  }
}
export default Calendar;
