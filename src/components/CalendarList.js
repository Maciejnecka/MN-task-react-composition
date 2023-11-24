import React from 'react';

class CalendarList extends React.Component {
  render() {
    return (
      <div className="calendar-list">
        <h1 className="calendar-list__title">Meeting List</h1>
        <ul className="calendar-list__items">
          {this.props.meetings.map((meeting) => (
            <li key={meeting.id} className="calendar-list__item">
              <div className="calendar-list__header">
                <span className="calendar-list__date">
                  <span
                    className="calendar-list__icon"
                    role="img"
                    aria-label="Calendar"
                  >
                    📅
                  </span>
                  {meeting.date}
                </span>
                <br />
                <span className="calendar-list__time">
                  <span
                    className="calendar-list__icon"
                    role="img"
                    aria-label="Clock"
                  >
                    🕒
                  </span>
                  {meeting.time}
                </span>
              </div>
              <div className="calendar-list__details">
                <span className="calendar-list__name">
                  {' '}
                  <span
                    className="calendar-list__icon"
                    role="img"
                    aria-label="Person"
                  >
                    👤
                  </span>
                  {meeting.firstName} {meeting.lastName}
                </span>
                <br />
                <span className="calendar-list__email">
                  <span
                    className="calendar-list__icon"
                    role="img"
                    aria-label="Email"
                  >
                    ✉️
                  </span>
                  {meeting.email}
                </span>
                <br />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default CalendarList;
